import { Stan, Message, SubscriptionOptions } from 'node-nats-streaming';
import { Subjects } from './Subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;
  abstract queueGroupName: string;
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T['data'], msg: Message): void;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // for receiving all past events that has been created.
      .setDurableName(this.queueGroupName) // for receiving only those events that are not processed yet.
      .setManualAckMode(true); //by settings manualAckMode(true)
    //we are giving acknowledgement about the event,
    //that we are done working with this event
    //if we didn't send acknowledgement in certain time
    //by default (30 seconds) then, nats will resend that event
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // by queue group we are sending event mannerly to  same instances of service;
      this.subscriptionOptions()
    );
    subscription.on('message', (msg: Message) => {
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);

      //msg.ack(); // acknowledgement sent to nats to ensure that event handled successfully
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
