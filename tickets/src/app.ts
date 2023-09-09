import express from "express";
import "express-async-errors";

//import {json} from 'body-parser'
import { createTicketsRouter } from "./routes/new";
import { showTicketsRouter } from "./routes/show";
import { getTicketsRouter } from "./routes/index";
import { updateTicketsRouter } from "./routes/update";

import { errorHandler, notFoundError } from "@steadyturtletickets/common";
import { currentUser } from "@steadyturtletickets/common";
import cookieSession from "cookie-session";
const app = express();
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createTicketsRouter);
app.use(showTicketsRouter);
app.use(getTicketsRouter);
app.use(updateTicketsRouter);

app.all("*", async () => {
  throw new notFoundError();
});
app.use(errorHandler);

export { app };
