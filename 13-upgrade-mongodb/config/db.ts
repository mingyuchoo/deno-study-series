// importing the deno_mongo package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

// create .env file to use Deno.env
const dbHostUrl = Deno.env.get("DB_HOST_URL") || "localhost:27017";
const dbName = Deno.env.get("DB_NAME") || "test";
const dbUserName = Deno.env.get("DB_USER_NAME") || "test";
const dbUserPwd = Deno.env.get("DB_USER_PWD") || "test";

// Create client
const client = new MongoClient();
// Connect to mongodb
client.connectWithUri(
  `mongodb://${dbUserName}:${dbUserPwd}@${dbHostUrl}/?authSource=${dbName}`,
);

const db = client.database(dbName);

export default db;
