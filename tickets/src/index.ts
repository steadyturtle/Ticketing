import mongoose from "mongoose";

import { app } from "./app";

const startDB = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must required");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must required");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecting to Mongo...");
  } catch (error) {
    console.error(error);
  }
};
app.listen(3004, () => {
  console.log("Listening to port 3004!!!");
});

startDB();
