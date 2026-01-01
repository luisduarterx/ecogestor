import { Client } from "pg";
async function query(queryObject) {
  let client;
  try {
    client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: process.env.NODE_ENV === "development" ? false : true,
    });
    await client.connect();

    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}
export default { query: query };
