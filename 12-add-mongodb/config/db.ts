// importing the deno_mongo package from url
import { init, MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

// Intialize the plugin
// await init()

// Create client
const client = new MongoClient();
// Connect to mongodb
client.connectWithUri("mongodb://test:test@localhost:27017");

// Specifying the database name
const dbname :string = "test";
const db = client.database(dbname);

// Declare the collections here. Here we are using only one collection (i.e friends).
const Friend = db.collection("friends");

export {db, Friend};