import request from "supertest";
import { app } from "../../app";
const route = "/api/users/currentuser";

it("responds with details of current user", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .get(route)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if user is not authenticate", async () => {
  const response = await request(app).get(route).send().expect(200);
  expect(response.body.currentUser).toEqual(null);
});
