import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("Espero que api/v1/status responda 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.database.server_version).toBe("18.1");
  expect(response.status).toBe(200);
  console.log(responseBody);
});
