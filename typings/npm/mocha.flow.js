declare class describe {
  static (description: string, spec: () => void): void;
  static only(description: string, spec: () => void): void;
  static skip(description: string, spec: () => void): void;
  static timeout(ms: number): void;
}

declare function callback(error? : any) : void;

declare class it {
  static (description: string, spec: (done : callback) => void | Promise<*>): void;
  static only(description: string, spec: () => void): void;
  static skip(description: string, spec: () => void): void;
  static timeout(ms: number): void;
}

declare class beforeEach {
  static (setup: () => void | Promise<*>): void;
}

declare class afterEach {
  static (tearDown: () => void | Promise<*>): void;
}
