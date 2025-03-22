const app = require("./expressCalculator");
const request = require("supertest");
test("GET /mean", async () => {
  const res = await request(app).get("/mean?nums=1,2,3,4,5");
  expect(res.statusCode).toBe(200);
  expect(res.body.response.value).toBe(3);
});

test("GET /median", async () => {
  const res = await request(app).get("/median?nums=1,2,3,4,5");
  expect(res.statusCode).toBe(200);
  expect(res.body.response.value).toBe(3);
});

test("GET /mode", async () => {
  const res = await request(app).get("/mode?nums=1,2,3,4,5,5");
  expect(res.statusCode).toBe(200);
  expect(res.body.response.value).toStrictEqual([5]);
});
