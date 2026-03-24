import { prisma } from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
afterAll(async () => {
  await prisma.$disconnect();
});

test("GET api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.database.server_version).toBeDefined();
  expect(response.status).toBe(200);
});
