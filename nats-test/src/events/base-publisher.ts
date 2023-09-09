import { Stan } from 'node-nats-streaming';
import { Subjects } from './Subjects';

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;
  //private data:T['data']
  constructor(client: Stan) {
    this.client = client;
    //this.data = data;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) return reject();
        console.log('Event publish');
        resolve();
      });
    });
  }
}
