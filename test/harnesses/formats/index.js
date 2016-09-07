/* @flow */

// Internal Imports
import AvroFormatHarness from './avro';
import JsonFormatHarness from './json';
import ProtocolBuffersHarness from './protocol-buffers';

export default {
  Avro: AvroFormatHarness,
  JSON: JsonFormatHarness,
  ProtocolBuffers: ProtocolBuffersHarness,
};
