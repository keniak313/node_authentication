#! /usr/bin/env node
import "dotenv/config";
import pg from "pg";
const { Client } = pg;


//REPLACE WITH NEEDED DEFAULT DB VALUES
const SQL = `
CREATE TABLE IF NOT EXISTS <TABLE_NAME> (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    <COLUMN_NAME> <DATA_TYPE> np. VARCHAR ( 255 ) lub DATA
);

INSERT INTO <TABLE_NAME> (<COLUMN_NAME>, <COLUMN_NAME>)
VALUES
    ('Name1', 'Col2 val'),
    ('Name2');
`

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
