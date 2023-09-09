import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';

import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';

it('has a router handler listening to /api/orders for post request', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.statusCode).not.toEqual(404);
});

it("returns 401 if user's not signed in", async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});
it("returns other than 401 if user's signed in", async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('got an error if user provide no ticketID', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('got an error if user provide invalid ticketID', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: 'salmple' })
    .expect(400);
});

it('return an error if ticket is not found', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ id, title: 'concert', price: 200 });
  await ticket.save();
  const order = Order.build({
    userId: 'djfkdjf',
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('returns 201 if order save successfully ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ id, title: 'abcd', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});
