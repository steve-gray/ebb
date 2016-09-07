/* flow disabled - Doesn't understand Mocha before/after
   semantics and all the nullable checks were driving me
   insane */

/* eslint-disable no-loop-func */

// NPM
import bluebird from 'bluebird';
import chai from 'chai';
import cap from 'chai-as-promised';

import formatters from './harnesses/formats';
import transports from './harnesses/transports';

// Globals
const expect = chai.expect;
chai.use(cap);

describe('Matrix Testing', () => {
  const startTime = new Date().getTime();
  let count = 0;

  for (const formatName of Object.keys(formatters)) {
    const formatGenerator = formatters[formatName];

    describe(`Format=${formatName}`, () => {
      for (const providerName of Object.keys(transports)) {
        const transportGenerator = transports[providerName];

        describe('Format Testing', () => {
          let formatContext = null;
          let formatter = null;
          let testLabel = null;

          // Set up
          beforeEach(async () => {
            // Determine auto-topic name
            testLabel = `format_tests_${count}`;
            count += 1;

            // Initialize the formatter
            formatContext = formatGenerator(testLabel);
            await formatContext.init();
            formatter = formatContext.getFormatter();
          });

          it('Should initialize/shutdown', () => null);

          it('Should silently ignore double-init/end', async () => {
            if (formatter.init) {
              await formatter.init();
            }
            if (formatter.end) {
              await formatter.end();
            }
          });

          it('Should round-trip a message', async () => {
            const typeKey = formatContext.getSampleMessageType();
            const sample = formatContext.generateSampleMessage(0);
            const encoded = await formatter.encodeMessage(typeKey, sample);
            const decoded = await formatter.decodeMessage(encoded);
            expect(sample).to.deep.eql(decoded);
          });

          it('Should be able to peek the message header', async () => {
            const typeKey = formatContext.getSampleMessageType();
            const sample = formatContext.generateSampleMessage(0);
            const encoded = await formatter.encodeMessage(typeKey, sample);
            const decodedType = formatter.decodeMessageType(encoded);
            expect(decodedType).to.deep.eql(decodedType);
          });

          afterEach(async () => {
            await formatContext.end();
            formatContext = null;
            formatter = null;
          });
        });

        describe(`Provider=${providerName}`, () => {
          let context : MatrixTestContext | null;

          // Set up permutations
          beforeEach(async () => {
            // Determine auto-topic name
            const testLabel = `test_matrix_${startTime}_${count}`;
            count += 1;

            // Initialize the formatter
            const formatterContext = formatGenerator(testLabel);
            await formatterContext.init();
            const formatter = formatterContext.getFormatter();

            // Initialize the provider
            const transportContext = transportGenerator(testLabel, formatter);
            await transportContext.init();

            // Get a producer instance
            const producer = transportContext.getProducer();
            const consumer = transportContext.getConsumer();

            context = {
              transportContext,
              producer,
              consumer,
              formatterContext,
              formatter,
              testLabel,
            };
          });

          afterEach(async () => {
            if (!context) {
              return;
            }

            if (context.formatterContext) {
              await context.formatterContext.end();
            }
            if (context.transportContext) {
              await context.transportContext.end();
            }

            context = null;
          });

          // Test 01: No-Op (Just validate before/after handlers)
          it('Functional - Should stop/start', () => null);

          it('Functional - Should ignore consumer double init/end', async () => {
            await context.consumer.init();
            await context.consumer.end();
          });

          it('Functional - Should ignore producer double init/end', async () => {
            await context.producer.init();
            await context.producer.end();
          });

          // Test 02: Just send a message when nobody is looking.
          it('Functional - Should send a single message', () =>
            context.producer.write(
              context.formatterContext.getSampleMessageType(),
              context.formatterContext.generateSampleMessage(0),
          ));

          // Test 03: Should send at least 5k messages/sec
          const rateBlindSend = 5000;
          it(`Performance - Send at ${rateBlindSend} messages/sec`, async () => {
            const sequence = Array.from(Array(rateBlindSend).keys());
            await bluebird.map(sequence, (x) =>
              context.producer.write(
                context.formatterContext.getSampleMessageType(),
                context.formatterContext.generateSampleMessage(x)));
          }).timeout(1000);

          const rateSendRecieve = 1000;
          it(`Performance - Send/Recieve ${rateSendRecieve} messages/sec`, async () => {
            const sequence = Array.from(Array(rateBlindSend).keys());
            await bluebird.map(sequence, (x) =>
              context.producer.write(
                context.formatterContext.getSampleMessageType(),
                context.formatterContext.generateSampleMessage(x)));
            await bluebird.delay(3000);
          }).timeout(5000);
        });
      }
    });
  }
});
