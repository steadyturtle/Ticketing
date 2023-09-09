import express from 'express';
import 'express-async-errors';

//import {json} from 'body-parser'
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';

import { errorHandler, notFoundError } from '@steadyturtletickets/common';
import { currentUser } from '@steadyturtletickets/common';
import cookieSession from 'cookie-session';
const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new notFoundError();
});
app.use(errorHandler);

export { app };
