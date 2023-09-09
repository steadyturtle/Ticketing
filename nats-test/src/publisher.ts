import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';
import { TicketCreatedEvent } from './events/TicketCreatedEvent';

//stan means client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: 'abcc',
    title: 'new concert',
    price: 200,
  });
});
