declare module 'no-kafka' {
  declare class NoKafkaClient {
    end() : Promise<*>;
  }

  declare interface OptionsBase {
    connectionString : string;
    clientId? : string;
  }

  declare interface GroupConsumerOptions extends OptionsBase {
    groupId: string;
  }

  declare interface ProducerOptions extends OptionsBase {
  }

  declare type ProduceRequest = {
    topic: string;
    partition: number;
    message: {
      key?: Buffer | string;
      value: Buffer | string;
    }
  }

  declare class ProduceResult {
  }

  declare class Producer extends NoKafkaClient {
    constructor(options : KafkaProducerOptions) : void;
    init() : Promise<*>;
    send(request : ProduceRequest) : Promise<ProduceResult>;
  }

  declare class MessageBody {
    key: Buffer;
    value: Buffer;
  }

  declare class Message {
    offset: number;
    messageSize: number;
    message: MessageBody;
  }

  declare function DataHandlerFunction(
    msgSet : Array<Message>,
    topic : string,
    partition : number) : Promise<*>;

  declare class GroupConsumer extends NoKafkaClient {
    constructor(options : GroupConsumerOptions) : void;
    init(strategies : Array<GroupConsumerStrategy>) : Promise<*>;
  }

  declare type GroupConsumerStrategy = {
    strategy: string;
    subscriptions : Array<string>;
  }
}
