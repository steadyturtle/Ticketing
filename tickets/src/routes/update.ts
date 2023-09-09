import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  notFoundError,
} from '@steadyturtletickets/common';
import { Ticket } from '../models/tickets.model';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title must be provide'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new notFoundError();
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      userId: ticket.userId,
      price: ticket.price,
      version: ticket.version,
    });
    res.send(ticket);
  }
);
export { router as updateTicketsRouter };
