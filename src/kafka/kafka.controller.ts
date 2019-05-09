import { Controller, Get } from '@nestjs/common';

import { ExampleKafkaService } from '../shared/kafka/example-kafka.service';

@Controller('kafka')
export class KafkaController {

    constructor(private kafkaService: ExampleKafkaService) {}

    // @Get('produce')
    // produce(): string {
    //     this.kafkaService.produce('newTopic', 'OMG IT WORKED!!!');
    //     return 'Starting producer...';
    // }

    // @Get('consume')
    // consume(): string {
    //     // this.kafkaService.consume();
    //     return 'Starting consumer...';
    // }

}
