import request from "supertest";
import { app } from "../../app";
const route = "/api/users/signout";

it("returns 200 if we successfully signout", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.get("Set-Cookie")).toEqual([
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
