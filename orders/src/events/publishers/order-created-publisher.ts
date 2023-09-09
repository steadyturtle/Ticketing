import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@steadyturtletickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.orderCreated;
}
