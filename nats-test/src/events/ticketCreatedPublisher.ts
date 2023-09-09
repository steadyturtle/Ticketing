import { Publisher } from './base-publisher';
import { Subjects } from './Subjects';
import { TicketCreatedEvent } from './TicketCreatedEvent';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.ticketCreated;
}
