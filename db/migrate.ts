import {drizzle} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import { client, db } from ".";

async function main() {
    console.log("Migration started");
    await migrate(db, {migrationsFolder: "drizzle"});
}

// create a new database
main().catch((err) => console.error(err)).then(
    () => client.end(),
);