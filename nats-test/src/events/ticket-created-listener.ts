import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './TicketCreatedEvent';
import { Subjects } from './Subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.ticketCreated;
  queueGroupName = 'payment-queue';

  onMessage(data: any, msg: Message) {
    console.log('event data ', data);

    msg.ack();
  }
}
