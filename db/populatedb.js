#! /usr/bin/env node
import "dotenv/config";
import pg from "pg";
const { Client } = pg;

//REPLACE WITH NEEDED DEFAULT DB VALUES
const SQL = `
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR (255),
password VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id INTEGER references users(id) ON DELETE CASCADE,
message VARCHAR (255),
date_added TIMESTAMP WITH TIME ZONE
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}

main();
