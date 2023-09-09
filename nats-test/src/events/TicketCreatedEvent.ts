import { Subjects } from './Subjects';

export interface TicketCreatedEvent {
  subject: Subjects.ticketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
