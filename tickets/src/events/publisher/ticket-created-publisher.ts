import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@steadyturtletickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.ticketCreated;
}
