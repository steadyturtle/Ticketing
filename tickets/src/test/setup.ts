import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => string[];
}
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asssd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: "1234",
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const json = JSON.stringify(session);
  const base64 = Buffer.from(json).toString("base64");
  return [`session=${base64}`];
};
