const { MongoClient } = require("mongodb");

const db = {};
const MONGODB_URL = "mongodb://localhost:27017";
const DATABASE = "my-blog";

async function connectDb() {
  const client = new MongoClient(MONGODB_URL);
  await client.connect();
  const database = client.db(DATABASE);

  db.posts = database.collection("posts");
}

module.exports = { connectDb, db };
