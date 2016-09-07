declare function ThenableGenerator(value : any) : any;

declare type Thenable = {
  then: ThenableGenerator;
  catch: function;
}
