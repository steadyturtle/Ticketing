import request from "supertest";
import { app } from "../../app";
const route = "/api/users/signup";
it("returns 201 if we successfully signup", async () => {
  return request(app)
    .post(route)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 if email is invalid", async () => {
  return request(app)
    .post(route)
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns 400 if password is invalid", async () => {
  return request(app)
    .post(route)
    .send({
      email: "test@test.com",
      password: "w",
    })
    .expect(400);
});

it("returns 400 if email and password is missing", async () => {
  await request(app)
    .post(route)
    .send({
      password: "password",
    })
    .expect(400);

  await request(app)
    .post(route)
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("sets a cookie for a successful signup request", async () => {
  const response = await request(app)
    .post(route)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
