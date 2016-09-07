// NPM
import avsc from 'avsc';

// Internal
import Sync from '../../../../src/utilities/Sync';

// Globals
export const PING_FINGERPRINT = 'f6b30b85151152541bb838772ebb0941';

export default class MockAvroRegistry {
  constructor() {
    this.pingSchema = avsc.parse({
      name: 'PingMessage',
      type: 'record',
      fields: [
        { name: 'pingId', type: 'string' },
      ],
    });
  }

  getSchema(schemaKey : string) : Promise<AvscSchema> {
    switch (schemaKey) {
      case PING_FINGERPRINT:
        return Sync.resolve(this.pingSchema);
      default:
        throw new Error(`No schema with key: ${schemaKey}`);
    }
  }
}
