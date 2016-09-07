/* @flow */

import PromiseEmitter from '../utilities/PromiseEmitter';

/**
 * The ConsumerBase is the default base type for transport
 * consumers. It defines the common events profile.
 */
export default class ConsumerBase extends PromiseEmitter {
  /**
   * Initialize the ConsumerBase
   */
  constructor() {
    super();
    this.declareEvent('messageSet');
  }
}
