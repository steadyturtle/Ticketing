import request from "supertest";
import { app } from "../../app";
const route = "/api/users/signin";

it("returns 200 if we successfully signin", async () => {
  const cookie = await global.signin();
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
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

it("returns 400 if password is empty", async () => {
  return request(app)
    .post(route)
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

it("returns 400 if user not found", async () => {
  const cookie = await global.signin();
  return request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      email: "tesssst@test.com",
      password: "12345",
    })
    .expect(400);
});

it("returns 400 if password not match", async () => {
  const cookie = await global.signin();
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "passw",
    })
    .expect(400);
});

it("sets a cookie for a successful signin request", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
