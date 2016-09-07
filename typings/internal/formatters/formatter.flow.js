declare interface EbbFormatter {
  decodeMessageType(rawMessage : Buffer) : string;
  decodeMessage(rawMessage : Buffer) : Promise<any>;
  encodeMessage(typeKey : string, message : any) : Promise<Buffer>;
}

declare interface EbbFormatterTestHarness {
  init() : Promise<*>;
  getFormatter() : EbbFormatter;
  getSampleMessageType(): string;
  generateSampleMessage(sequence : number) : any;
  end() : Promise<*>;
}
