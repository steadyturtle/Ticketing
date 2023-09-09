import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './app';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const startDB = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must required');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must required');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must required');
  if (!process.env.NATS_CLIENT_ID)
    throw new Error('NATS_CLIENT_ID must required');
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('NATS_CLUSTER_ID must required');
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS subscriber destroyed');

      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecting to Mongo...');
  } catch (error) {
    console.error(error);
  }
};
app.listen(3005, () => {
  console.log('Listening to port 3005!!!');
});

startDB();
