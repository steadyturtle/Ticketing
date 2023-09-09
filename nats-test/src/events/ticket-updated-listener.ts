import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './TicketCreatedEvent';
import { TicketUpdatedEvent } from './TicketUpdatedEvent';

import { Subjects } from './Subjects';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.ticketUpdated;
  queueGroupName = 'payment-queue';

  onMessage(data: any, msg: Message) {
    console.log('event updated data ', data, ' > ', msg.getSubject());

    msg.ack();
  }
}
