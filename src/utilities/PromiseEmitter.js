/* @flow */

/**
 * The PromiseEmitter allows for the definition of handlers on a type
 * that emit promises. Handlers can be awaited by the emitter for
 * allowing complex chained events.
 */
export default class PromiseEmitter {
  eventMap : { [eventName: string] : [any] };

  /**
   * Initialize a new PromiseEmitter
   */
  constructor() {
    this.eventMap = {};
  }

  /**
   * Declare an event on this emitter instance.
   */
  declareEvent(eventName : string) : void {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
  }
}
