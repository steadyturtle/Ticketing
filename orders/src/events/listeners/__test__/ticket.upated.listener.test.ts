import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@steadyturtletickets/common';
import { Message } from 'node-nats-streaming';
natsWrapper;
const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });
  await ticket.save();
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'concert new',
    price: 100,
    version: ticket.version + 1,
    userId: 'djfkd',
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { ticket, listener, data, msg };
};

it('find, update ticket', async () => {
  const { data, listener, msg } = await setup();
  // @ts-ignore
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket!.id).toEqual(data.id);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('indicate that ack function get called', async () => {
  const { data, msg, listener } = await setup();
  // @ts-ignore
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack function if the version is not correct', async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
