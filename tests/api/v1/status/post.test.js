import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("POST /api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status", {
    method: "POST",
  });
  const responseBody = await response.json();
  expect(response.status).toBe(405);
  expect(responseBody).toEqual({
    name: "MethodNotAllowed",
    message: "Esse método não é permitido para esse endpoint.",
    action: "Verifique se o método HTTP enviado é válido para esse endpoint.",
    status_code: 405,
  });
});
