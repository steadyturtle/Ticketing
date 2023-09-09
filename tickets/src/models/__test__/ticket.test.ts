import { Ticket } from '../tickets.model';

it('implements optimistic concurrent control', async () => {
  const ticket = Ticket.build({ title: 'abc', price: 10, userId: 'abc' });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 15 });
  await firstInstance?.save();

  secondInstance?.set({ price: 20 });
  //await secondInstance?.save();
  try {
    await secondInstance?.save();
  } catch (error) {
    return;
  }
  throw new Error('should not be here');
});
