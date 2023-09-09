import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@steadyturtletickets/common';
import { queueGroupName } from '../queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets.model';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.orderCreated = Subjects.orderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    if (data.status === OrderStatus.Created) {
      const ticket = await Ticket.findById(data.ticket.id);
      if (!ticket) throw new Error('Ticket not found');
      ticket.set({ orderId: data.id });
      await ticket.save();
      msg.ack();
    }
  }
}
