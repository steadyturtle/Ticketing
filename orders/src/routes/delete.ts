import {
  NotAuthorizedError,
  notFoundError,
  requireAuth,
  validateRequest,
} from '@steadyturtletickets/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('orderId must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) throw new notFoundError();
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
    order.status = OrderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
