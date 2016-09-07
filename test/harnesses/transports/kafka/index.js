/* @flow */

// NPM
import KafkaTools from 'kafka-tools';

// Internal
import KafkaConsumer from '../../../../src/transports/kafka/Consumer';
import KafkaProducer from '../../../../src/transports/kafka/Producer';

// Globals
const brokerConnectionString = 'localhost:9092';
const zookeeperConnectionString = 'localhost:2181';

export default function generate(
  testLabel : string,
  formatter : EbbFormatter) : EbbTransportTestHarness {
  let producer : EbbTransportProducer | null = null;
  let consumer : EbbTransportConsumer | null = null;

  return {
    init: async () => {
      // Create a topic for this test
      const kafkaTools = new KafkaTools.kafka.Client(zookeeperConnectionString);
      await new Promise((resolve, reject) => {
        kafkaTools.zk.createTopic(testLabel, 1, 1, {}, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      kafkaTools.close();

      producer = new KafkaProducer(
        formatter,
        {
          driver: {
            connectionString: brokerConnectionString,
          },
          topic: testLabel,
        });
      await producer.init();

      consumer = new KafkaConsumer(
        formatter,
        {
          driver: {
            connectionString: brokerConnectionString,
            groupId: `Group-${testLabel}`,
            maxBytes: 102400, // 100KB, forces some chunking.
          },
          topic: testLabel,
        }
      );
      await consumer.init();
    },

    getProducer: () => {
      if (producer) {
        return producer;
      }
      throw new Error('Cannot get producer: not initialized');
    },

    getConsumer: () => {
      if (consumer) {
        return consumer;
      }
      throw new Error('Cannot get consumer: not initialized');
    },

    end: async () => {
      if (producer) {
        await producer.end();
      }
      if (consumer) {
        await consumer.end();
      }
    },
  };
}
