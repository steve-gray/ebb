/* @flow */

import { Producer } from 'no-kafka';

/**
 * The KafkaProducer writes data to a Kafka topic using a formatter,
 * allowing the KafkaFormattedConsumer to extract it later.
 */
export default class KafkaProducer {
  formatter : EbbFormatter;
  options : KafkaProducerOptions;
  producer : Producer;
  running : boolean;

  /**
   * Create a new KafkaProducer
   */
  constructor(
    formatter : EbbFormatter,
    options : KafkaProducerOptions) {
    this.formatter = formatter;
    this.options = options;
  }

  /**
   * Initialize this instance.
   */
  async init() : Promise<*> {
    // If we're already running, succeed silently.
    if (this.running) {
      return;
    }

    this.producer = new Producer(this.options.driver);
    await this.producer.init();
    this.running = true;
  }

  /**
   * Write a message to the producer.
   */
  async write(messageType : string, messageBody : any) : Promise<*> {
    const encoded =
      await this.formatter.encodeMessage(messageType, messageBody);

    const result = await this.producer.send({
      topic: this.options.topic,
      partition: 0,
      message: {
        value: encoded,
      },
    });

    return result;
  }

  /**
   * End this instance.
   */
  async end() {
    // If not running, succeed silently.
    if (!this.running) {
      return;
    }

    this.running = false;
    /* istanbul ignore else */
    await this.producer.end();
  }
}
