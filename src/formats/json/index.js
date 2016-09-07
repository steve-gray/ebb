/* @flow */

import Sync from '../../utilities/Sync';

/**
 * The JsonFormat is used when working with a stream that contains a serialized
 * JSON object as a Buffer.
 */
export default class JsonFormat {
  encoding : buffer$Encoding;

  /**
   * Initialize a new JsonFormat
   * @param {string}  encoding      - Text encoding (utf-8/utf-16 etc)
   */
  constructor(encoding? : buffer$Encoding) {
    this.encoding = encoding || 'utf-8';
  }

  /**
   * Decode the whole JSON format
   * @private
   */
  decodeFromRaw(rawMessage : Buffer) : JsonMessage {
    const jsonString = rawMessage.toString(this.encoding);
    const message = (JSON.parse(jsonString) : JsonMessage);
    return message;
  }

  /**
   * Extract the message type from the headers in the stream.
   */
  decodeMessageType(rawMessage : Buffer) : string {
    const message = this.decodeFromRaw(rawMessage);
    return message.typeKey;
  }

  /**
   * Decode a message
   */
  async decodeMessage(rawMessage : Buffer) : Promise<any> {
    const message = this.decodeFromRaw(rawMessage);
    return Sync.resolve(message.body);
  }

  /**
   * Encode the given message type for storage in Kafka.
   */
  async encodeMessage(typeKey : string, message : any) : Promise<Buffer> {
    const payloadObject = {
      typeKey,
      body: message,
    };
    const payloadString = JSON.stringify(payloadObject);
    const buffer = new Buffer(payloadString, this.encoding);
    return buffer;
  }
}
