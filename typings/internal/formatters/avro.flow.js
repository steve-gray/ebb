declare class MessageType {
  getMessageType(rawMessage : Buffer) : Promise<string>;
}

declare interface AvroSchemaRegistry {
  getSchema(fingerprint : string) : Promise<AvscSchema>;
}
