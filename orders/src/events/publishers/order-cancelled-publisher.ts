import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@steadyturtletickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.orderCancelled;
}
