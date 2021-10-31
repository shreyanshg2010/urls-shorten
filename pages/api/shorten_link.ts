// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
import { NowRequest, NowResponse } from "@vercel/node";

let cachedDb;

async function connectToDb() {
  const { MongoClient } = require("mongodb");
  if (cachedDb) return cachedDb;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const client = new MongoClient(process.env.MONGODB_URI, options);
  cachedDb = client;
  return await client.connect();
}

export default async (req: NowRequest, res: NowResponse) => {
  const db = await connectToDb();

  console.log("req", req.body.link);
  if (req.body.link) {
    const entry = await db
      .db("links_db")
      .collection("links_collection")
      .insertOne({ link: req.body.link });
    res.statusCode = 201;
    return res.json({
      short_link: `${process.env.VERCEL_URL}/r/${entry.insertedId}`,
    });
  }

  res
    .status(409)
    .json({ error: "no_link_found", error_description: "No link found" });
};
