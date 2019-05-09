import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { ExampleKafkaService } from '../shared/kafka/example-kafka.service';

@Module({
  controllers: [KafkaController],
  providers: [ExampleKafkaService],
})
export class KafkaModule {}
