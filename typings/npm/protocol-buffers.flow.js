declare class ProtocolBufferType {
  encode(object : any) : Buffer;
  decode(buffer : Buffer) : any;
}
