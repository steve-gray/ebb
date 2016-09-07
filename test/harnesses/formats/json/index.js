/* @flow */
import JsonFormat from '../../../../src/formats/json';

export default function generate() : EbbFormatterTestHarness {
  const formatter = new JsonFormat('utf-8');

  return {
    init: async () => {
      // Nothing to set-up.
    },
    getFormatter: () => formatter,
    getSampleMessageType: () => 'PingMessageType',
    generateSampleMessage: (x : number) => ({
      pingId: x.toString(),
    }),
    end: async () => {
      // Nothing to clean up
    },
  };
}
