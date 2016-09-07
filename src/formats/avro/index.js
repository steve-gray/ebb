/* @flow */

import avsc from 'avsc';
import envelope from './envelope.json';
import headers from './envelope-headers.json';

/**
 * The AvroFormat is used when working with a stream that contains a serialized
 * Apache Avro schema. The AvroFormat uses the AVSC library for all it's work with
 * the formatting.
 */
export default class AvroFormat {
  envelopeSchema : AvscSchema;
  headerResolver : AvscResolver;
  headerSchema : AvscSchema;
  registry : AvroSchemaRegistry;

  /**
   * Initialize a new instance of the AvroFormat.
   */
  constructor(registry : AvroSchemaRegistry) {
    this.envelopeSchema = avsc.parse(envelope);
    this.headerSchema = avsc.parse(headers);
    this.headerResolver = this.headerSchema.createResolver(this.envelopeSchema);
    this.registry = registry;
  }

  /**
   * Extract the message type from the headers in the stream.
   */
  decodeMessageType(rawMessage : Buffer) : string {
    const message =
      this.headerSchema.fromBuffer(rawMessage, this.headerResolver, true);
    return message.headers.schemaFingerprint.toString('hex');
  }

  /**
   * Decode a message
   */
  async decodeMessage(rawMessage : Buffer) : Promise<any> {
    const envelopeContent = this.envelopeSchema.fromBuffer(rawMessage);
    const fingerprint = envelopeContent.headers.schemaFingerprint.toString('hex');
    const innerSchema = await this.registry.getSchema(fingerprint);
    const decoded = innerSchema.fromBuffer(envelopeContent.binaryData, null, true);

    // Strip away the AVSC magic. Immense hack.
    Object.setPrototypeOf(decoded, Object.prototype);

    return decoded;
  }

  /**
   * Encode the given message type for storage in a stream.
   */
  async encodeMessage(typeKey : string, message : any) : Promise<Buffer> {
    // Encode the inner message
    const innerSchema = await this.registry.getSchema(typeKey);
    const innerBuffer = innerSchema.toBuffer(message);

    // Outer wrapper
    const wrapper = {
      headers: {
        schemaFingerprint: new Buffer(typeKey, 'hex'),
      },
      binaryData: innerBuffer,
    };
    const buffer = this.envelopeSchema.toBuffer(wrapper);

    return buffer;
  }
}
