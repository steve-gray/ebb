declare type MatrixTestContext = {
  transportContext : EbbTransportTestHarness,
  producer: EbbTransportProducer,
  consumer: EbbTransportConsumer,

  formatterContext : EbbFormatterTestHarness,
  formatter: EbbFormatter,

  testLabel: string
}
