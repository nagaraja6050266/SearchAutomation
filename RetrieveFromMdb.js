require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);
async function main() {
    try {
        await client.connect();
        console.log("Connected to the MongoDB cluster");
        const database = client.db("FirstDB");
        const collection = database.collection("FirstCollection");
        const documents = await collection.find({}).toArray();
        console.log("Documents retrieved from MongoDB:");
        for (document of documents) {
            console.log(document.keyword);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}
main();
