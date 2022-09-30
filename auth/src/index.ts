import mongoose from "mongoose";

import { app } from "./app";

const startDB = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must required");
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connecting to Mongo...");
  } catch (error) {
    console.error(error);
  }
};
app.listen(3003, () => {
  console.log("Listening to port 3003!!!");
});

startDB();
