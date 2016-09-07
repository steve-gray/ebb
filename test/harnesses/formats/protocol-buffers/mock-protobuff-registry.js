// NPM
import pbuff from 'protocol-buffers';
import Sync from '../../../../src/utilities/Sync';

export default class MockProtocolBuffersRegistry {
  constructor() {
    this.defs = pbuff('message PingMessage { required string pingId = 1; }');
  }

  getSchema(schemaKey : string) : Promise<ProtocolBufferSchema> {
    return Sync.resolve(this.defs[schemaKey]);
  }
}
