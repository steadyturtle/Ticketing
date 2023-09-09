import {
  notFoundError,
  requireAuth,
  validateRequest,
} from '@steadyturtletickets/common';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const router = express.Router();

router.get(
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
    const order = await Order.find({
      _id: req.params.orderId,
      userId: req.currentUser?.id,
    }).populate('ticket');
    if (!order.length) throw new notFoundError();
    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
