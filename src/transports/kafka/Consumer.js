/* @flow */

// NPM Imports
import { GroupConsumer } from 'no-kafka';
import type { GroupConsumerStrategy, Message } from 'no-kafka';

// Internal Imports
import ConsumerBase from '../ConsumerBase';


/**
 * The KafkaConsumer reads data from a partitioned Kafka stream
 * using the cooperative GroupConsumer from No-Kafka.
 */
export default class KafkaConsumer extends ConsumerBase {
  consumer : GroupConsumer | null;
  formatter : EbbFormatter;
  options : KafkaConsumerOptions;
  running : boolean;

  /**
   * Create a new KafkaProducer
   */
  constructor(
    formatter : EbbFormatter,
    options : KafkaConsumerOptions) {
    super();
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

    this.consumer = new GroupConsumer(this.options.driver);
    const strategy : GroupConsumerStrategy = {
      strategy: 'GroupConsumerStrategy',
      subscriptions: [this.options.topic],
      handler: (msgSet, topic, partition) =>
        this.handleMessageSet(msgSet, topic, partition),
    };
    const strategies = [strategy];

    await this.consumer.init(strategies);
    this.running = true;
  }

  /**
   * Handle a set of messages from Kafka
   */
  async handleMessageSet(
    msgSet : Array<Message>,
    topic : Message,
    partition : number) : Promise<*> {
    console.log('Message set for %s / %s', topic, partition);
    console.log(msgSet.length);
    console.log(msgSet[0]);
    throw new Error('Boom');
  }

  /**
   * End this instance.
   */
  async end() : Promise<*> {
    // If not running, succeed silently.
    if (!this.running) {
      return;
    }

    this.running = false;
    /* istanbul ignore else */
    if (this.consumer) {
      await this.consumer.end();
    }
    this.consumer = null;
  }
}
