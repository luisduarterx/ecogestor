import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.database.server_version).toBe("18.1");
  expect(response.status).toBe(200);
  console.log(responseBody);
});
