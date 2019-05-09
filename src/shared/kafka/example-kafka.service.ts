import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer } from 'kafka-node';
import { Consumer } from 'kafka-node';
import { Subject } from 'rxjs';

@Injectable()
export class ExampleKafkaService {
  producerErrors = new Subject();
  producerEvents = new Subject();
  consumerErrors = new Subject();
  consumerEvents = new Subject();

  client: KafkaClient;
  producer: Producer;
  //   payloads = [{ topic: 'test', messages: 'hello world', partition: 0 }];

  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });

    // Setup producer
    this.producer = new Producer(this.client);
    this.producer.on('ready', () => {
        console.log('ready!!');
    });
    this.producer.on('error', error => {
      this.producerErrors.next(error);
    });

    // Setup Consumer

  }

  produce(kafkaTopic: string, kafkaMessage: string): void {
    const payload = [
      { topic: kafkaTopic, messages: kafkaMessage, partition: 0 },
    ];
    this.producer.send(payload, (err, data) => {
      if (err) {
        this.producerErrors.next(err);
      }
      this.producerEvents.next(data);
    });
  }

//   consume(kafkaTopic: string): Observable<any> {
//     const topics = [{ topic: kafkaTopic, partition: 0 }];
//     const consumer = new Consumer(this.client, topics, { autoCommit: false });
//     consumer.on('message', message => {
//       this.consumerEvents.next(message);
//     });
//     consumer.on('error', error => {
//       this.consumerErrors.next(error);
//     });
//     return this.
//   }
}
