/* @flow */

import ProtocolBuffersFormat from '../../../../src/formats/protocol-buffers';
import MockProtocolBufferRegistry from './mock-protobuff-registry';

export default function generate() : EbbFormatterTestHarness {
  const registry = new MockProtocolBufferRegistry();
  const formatter = new ProtocolBuffersFormat(registry);

  return {
    init: async () => {
      // Nothing to set-up.
    },
    getFormatter: () => formatter,
    getSampleMessageType: () => 'PingMessage',
    generateSampleMessage: (x : number) => ({
      pingId: x.toString(),
    }),
    end: async () => {
      // Nothing to clean up
    },
  };
}
