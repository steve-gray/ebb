import type { GroupConsumerOptions, ProducerOptions } from 'no-kafka';

declare interface KafkaConsumerOptions {
  topic: string;
  driver: GroupConsumerOptions;
}

declare interface KafkaProducerOptions {
  topic: string;
  driver: ProducerOptions;
}
