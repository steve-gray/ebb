
declare interface EbbTransportTestHarness {
  init() : Promise<*>;
  getProducer() : EbbTransportProducer;
  getConsumer() : EbbTransportConsumer;
  end() : Promise<*>;
}

declare interface EbbTransportBase {
  init() : Promise<*>;
  end() : Promise<*>;
}

declare interface EbbTransportProducer
  extends EbbTransportBase {
  write(typeKey : string, message : any) : Promise<*>;
}

declare interface EbbTransportConsumer
  extends EbbTransportBase {
}