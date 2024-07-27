import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { Config } from "../config";
import { schema } from "./schema";

export const client = new Client({
  connectionString: Config.POSTGRES_STRING,
  ssl : false
});

await client.connect();

export const db = drizzle(client, 
  {
    schema : schema
  }
);


