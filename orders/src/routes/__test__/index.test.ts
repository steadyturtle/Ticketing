import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';

import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';

const buildTicket = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ id, title: 'abcd', price: 20 });
  await ticket.save();
  return ticket;
};

it('has a router handler listening to /api/orders for get request', async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.statusCode).not.toEqual(404);
});

it('Returns 401 if user not authenticated', async () => {
  await request(app).get('/api/orders').expect(401);
});

it('Returns orders data successfully', async () => {
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();
  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: t1.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: t2.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: t3.id })
    .expect(201);

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(res.body.length).toEqual(2);
});
