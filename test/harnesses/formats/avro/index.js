/* @flow */
import AvroFormat from '../../../../src/formats/avro';
import MockAvroRegistry, { PING_FINGERPRINT } from './mock-avro-registry';

export default function generate() : EbbFormatterTestHarness {
  const registry = new MockAvroRegistry();
  const formatter = new AvroFormat(registry);

  return {
    init: async () => {
      // Nothing to set-up.
    },
    getFormatter: () => formatter,
    getSampleMessageType: () => PING_FINGERPRINT,
    generateSampleMessage: (x : number) => ({
      pingId: x.toString(),
    }),
    end: async () => {
      // Nothing to clean up
    },
  };
}
