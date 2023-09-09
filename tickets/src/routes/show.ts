import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets.model';
import { notFoundError } from '@steadyturtletickets/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const tickets = await Ticket.findById(req.params.id);

  if (!tickets) throw new notFoundError();
  res.send(tickets);
});

export { router as showTicketsRouter };
