declare class ProtocolBuffersRegistry {
  getSchema(typeKey : string) : Promise<ProtocolBufferType>;
}
