const { MongoClient } = require("mongodb");
const fs = require("fs").promises;

// MongoDB URI - make sure all values are accurate and the IP is whitelisted
const uri =
  "mongodb+srv://Avisekh:28lG37N915VC4fmw@db-mongodb-nyc3-06588-53e12b7f.mongo.ondigitalocean.com/Angel_api?replicaSet=db-mongodb-nyc3-06588&tls=true&authSource=admin";

async function insertDataFromFile() {
  // Create a new MongoClient instance
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected successfully to MongoDB.");

    // Specify the database and collection
    const database = client.db("Angel_api"); // Your database name
    const collection = database.collection("bracket"); // Your collection name

    // Read and parse the JSON data from the file
    const fileData = await fs.readFile("robo.json", "utf-8"); // Replace with your JSON file name
    const data = JSON.parse(fileData);

    // Check if data is an array and insert into MongoDB
    if (Array.isArray(data)) {
      const result = await collection.insertMany(data);
      console.log(`${result.insertedCount} documents were inserted.`);
    } else {
      console.error(
        "Data is not an array. Ensure JSON file contains an array of objects."
      );
    }
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    // Close the database connection
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Run the function to insert data from the JSON file
insertDataFromFile();
