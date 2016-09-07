
declare class AvscSchema {
  fromBuffer(input : Buffer, resolver? : AvscResolver | null, noCheck? : boolean) : any;
  toBuffer() : Buffer;
}

declare class AvscResolver {
}
