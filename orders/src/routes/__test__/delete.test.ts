import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if order is not found', async () => {
  const user = global.signin();
  await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});

it('returns 400 if orderId is not provided', async () => {
  const user = global.signin();
  await request(app)
    .delete(`/api/orders/hhjhkj`)
    .set('Cookie', user)
    .send()
    .expect(400);
});

it('marks an order as cancelled', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ id, title: 'test', price: 20 });
  ticket.save();
  const user = global.signin();
  const newOrder = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  const order = await request(app)
    .get(`/api/orders/${newOrder.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  await request(app)
    .delete(`/api/orders/${newOrder.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  //expect(order.body.length).toEqual(1);
});
