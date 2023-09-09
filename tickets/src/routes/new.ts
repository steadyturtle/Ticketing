import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@steadyturtletickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets.model';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',

  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title must be provide'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      userId: ticket.userId,
      price: ticket.price,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketsRouter };
