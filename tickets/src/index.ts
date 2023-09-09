import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './app';

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

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecting to Mongo...');
  } catch (error) {
    console.error(error);
  }
};
app.listen(3004, () => {
  console.log('Listening to port 3004!!!');
});

startDB();
