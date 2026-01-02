import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("Espero que api/v1/migrations responda 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(response.status).toBe(200);
  expect(responseBody.length).toBeGreaterThan(0);
});
