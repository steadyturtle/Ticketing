import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@steadyturtletickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.ticketUpdated;
}
