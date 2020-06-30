// importing the deno_mongo package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

// create .env file to use Deno.env
const env = Deno.env.toObject();
const DB_HOST_URL = env.DB_HOST_URL || "localhost:27017";
const DB_NAME = env.DB_NAME || "test";
const DB_USER_NAME = env.DB_USER_NAME || "test";
const DB_USER_PWD = env.DB_USER_PWD || "test";

// Create client
const client = new MongoClient();
// Connect to mongodb
client.connectWithUri(
  `mongodb://${DB_USER_NAME}:${DB_USER_PWD}@${DB_HOST_URL}/?authSource=${DB_NAME}`,
);

const db = client.database(DB_NAME);

export default db;
