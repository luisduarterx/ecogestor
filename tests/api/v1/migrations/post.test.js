test("Espero que POST em api/v1/migrations responda 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(response.status).toBe(200);
});
