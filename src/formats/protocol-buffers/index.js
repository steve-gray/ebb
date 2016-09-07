/* @flow */

import pbuf from 'protocol-buffers';

const envelopeProto = `message Envelope {
  required string typeKey = 1;
  required bytes body = 2;
}`;

/**
 * The ProtocolBuffersFormat uses protocol buffers to serialize data. The
 * definitions to use are supplied by a ProtocolBuffersRegistry of parsed
 * schemas.
 */
export default class ProtocolBuffersFormat {
  envelope : ProtocolBufferType;
  registry : ProtocolBuffersRegistry;

  /**
   * Initialize a new instance of the AvroFormat.
   */
  constructor(registry : ProtocolBuffersRegistry) {
    this.envelope = pbuf(envelopeProto).Envelope;
    this.registry = registry;
  }

  /**
   * Extract the message type from the headers in the stream.
   */
  decodeMessageType(rawMessage : Buffer) : string {
    const envelope = this.envelope.decode(rawMessage);
    return envelope.typeKey;
  }

  /**
   * Decode a message
   */
  async decodeMessage(rawMessage : Buffer) : Promise<any> {
    const envelope = this.envelope.decode(rawMessage);
    const innerSchema = await this.registry.getSchema(envelope.typeKey);
    const decoded = innerSchema.decode(envelope.body);

    return decoded;
  }

  /**
   * Encode the given message type for storage in a stream.
   */
  async encodeMessage(typeKey : string, message : any) : Promise<Buffer> {
    // Encode the inner message
    const innerSchema = await this.registry.getSchema(typeKey);
    const body = innerSchema.encode(message);

    // Outer wrapper
    const wrapper = {
      typeKey,
      body,
    };
    const buffer = this.envelope.encode(wrapper);

    return buffer;
  }
}
