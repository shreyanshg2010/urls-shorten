// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient, ObjectId } from "mongodb";
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
  const entry = await db
    .db("links_db")
    .collection("links_collection")
    .findOne({ _id: req.query.id });
  if (entry !== null) {
    return res.redirect(301, entry.link);
  }
  return res.redirect(301, "/");

  console.log("req", req.body.link);
  if (req.body.link) {
    res.statusCode = 201;
    return res.json({
      short_link: `https://localhost:3000/r/${entry.insertedId}`,
    });
  }

  res
    .status(409)
    .json({ error: "no_link_found", error_description: "No link found" });
};
