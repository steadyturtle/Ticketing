import request from "supertest";

import { app } from "../../app";

it("has a router handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  console.log("response ", response.statusCode);
  expect(response.statusCode).not.toEqual(404);
});
it("returns 401 if user's not signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});
it("returns other than 401 if user's signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  console.log("response ", response.status);
  expect(response.status).not.toEqual(401);
});

it("got an error if user provide invalid title", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});
it("got an error if user provide invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "sample title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});
it("returns success if user provide valid data", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "valid title",
      price: 100,
    })
    .expect(201);
});
