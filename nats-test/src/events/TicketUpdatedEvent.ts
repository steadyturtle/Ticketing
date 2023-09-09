import { Subjects } from './Subjects';

export interface TicketUpdatedEvent {
  subject: Subjects.ticketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
