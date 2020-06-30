// importing the deno_mongo package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

// Create client
const client = new MongoClient();
// Connect to mongodb
client.connectWithUri("mongodb://test:test@localhost:27017/?authSource=test");

// Specifying the database name
const dbname: string = "test";
const db = client.database(dbname);

export default db;