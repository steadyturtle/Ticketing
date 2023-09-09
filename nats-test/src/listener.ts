import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  stan.on('close', () => {
    console.log('NATS subscriber destroyed');

    process.exit();
  });

  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
