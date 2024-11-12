// database.js
const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri =
  "mongodb+srv://Avisekh:28lG37N915VC4fmw@db-mongodb-nyc3-06588-53e12b7f.mongo.ondigitalocean.com/trades?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-06588";

const dbName = "Angel_api"; // Replace with your actual database name

// Function to find the symbol data in the database
async function findSymbolInDatabase(symbol) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection("totalscript"); // Replace with your actual collection name

    // Query the database for the symbol data
    const document = await collection.findOne({ symbol: symbol });

    return document;
  } finally {
    await client.close();
  }
}

module.exports = { findSymbolInDatabase };
