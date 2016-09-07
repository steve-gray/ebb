import Sync from './Sync';

/**
 * The ThrottledQueue is a mechanism that allows up to N items to be queued,
 * with a promise-based enqueue operation. However, when the Nth item is queued
 * the resolution of the promise is held - until at least one item is dequeued.
 */
export default class ThrottledQueue {
  /**
   * Initialize a new instance of the ThrottledQueue
   */
  constructor(limit : Number) {
    this.queue = [];
    this.pending = [];
    this.limit = limit;
  }

  /**
   * Queue an item.
   */
  enqueue(value) {
    // Queue the item, if we've got space.
    if (this.queue.length < this.limit) {
      this.queue.push(value);
      return Sync.resolve();
    }

    return new Promise((resolve) => {
      this.pending.push({
        resolve,
        value,
      });
    });
  }

  /**
   * Pull the next item from the queue.
   */
  dequeue() {
    // Fetch our return value
    let result;
    if (this.queue.length > 0) {
      result = this.queue.shift();
    }

    // Release the next item, if pending
    while (this.queue.length < this.limit && this.pending.length > 0) {
      const nextTask = this.pending.shift();

      // Place into the queue
      this.queue.push(nextTask.value);

      // Resolve on the next tick
      try {
        nextTask.resolve();
      } catch (err) {
        // TODO - Log this - But this is no different to an error
        // on an uncaught next tick.
      }
    }

    return result;
  }
}
