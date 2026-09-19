const {MongoClient} = require("mongodb");
require("dotenv").config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "BlockchainDB";
let db;

async function connectDB(){
  if(db) return db;
  await client.connect();
  db=client.db(dbName);
  console.log('Connected to MongoDB');
  return db;
}

function getCollection(name){
  if(!db){
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db.collection(name);
}

module.exports = { connectDB, getCollection };