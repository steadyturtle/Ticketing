import request from 'supertest';
import { Ticket } from '../../models/tickets.model';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
it('has a router handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.statusCode).not.toEqual(404);
});
it("returns 401 if user's not signed in", async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});
it("returns other than 401 if user's signed in", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('got an error if user provide invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});
it('got an error if user provide invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sample title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});
it('returns success if user provide valid data', async () => {
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'valid title',
      price: 100,
    })
    .expect(201);
  ticket = await Ticket.find({});
  expect(ticket.length).toEqual(1);
  expect(ticket[0].price).toEqual(100);
  expect(ticket[0].title).toEqual('valid title');
});

it('publishes an event', async () => {
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'valid title',
      price: 100,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
