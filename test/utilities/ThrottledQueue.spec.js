/* @flow */

// NPM
import bluebird from 'bluebird';
import chai from 'chai';
import cap from 'chai-as-promised';

// Internal
import ThrottledQueue from '../../src/utilities/ThrottledQueue';

// Globals
const expect = chai.expect;
chai.use(cap);

describe('utilities/ThrottledQueue', () => {
  it('Should queue N promises', () => {
    let count = 0;

    const queue = new ThrottledQueue(5);
    queue.enqueue(1).then(() => { count += 1; });
    queue.enqueue(2).then(() => { count += 1; });
    queue.enqueue(3).then(() => { count += 1; });
    queue.enqueue(4).then(() => { count += 1; });
    queue.enqueue(5).then(() => { count += 1; });
    queue.enqueue(6).then(() => { count += 1; });

    expect(count).to.eql(5);
    expect(queue.dequeue()).to.eql(1);
    expect(queue.dequeue()).to.eql(2);
    expect(queue.dequeue()).to.eql(3);
    expect(queue.dequeue()).to.eql(4);
    expect(queue.dequeue()).to.eql(5);
  });

  it('Should return undefined when queue depleted', () => {
    let count = 0;

    const queue = new ThrottledQueue(5);
    queue.enqueue(1).then(() => { count += 1; });
    queue.enqueue(2).then(() => { count += 1; });
    queue.enqueue(3).then(() => { count += 1; });

    expect(count).to.eql(3);
    expect(queue.dequeue()).to.eql(1);
    expect(queue.dequeue()).to.eql(2);
    expect(queue.dequeue()).to.eql(3);
    expect(queue.dequeue()).to.eql(undefined);
    expect(queue.dequeue()).to.eql(undefined);
  });

  it('Should enqueue next after dequeue', async () => {
    let count = 0;

    const queue = new ThrottledQueue(3);
    queue.enqueue(1).then(() => { count += 1; });
    queue.enqueue(2).then(() => { count += 1; });
    queue.enqueue(3).then(() => { count += 1; });
    queue.enqueue(4).then(() => { count += 1; });
    queue.enqueue(5).then(() => { count += 1; });
    queue.enqueue(6).then(() => { count += 1; });

    expect(count).to.eql(3);
    expect(queue.dequeue()).to.eql(1);
    expect(queue.dequeue()).to.eql(2);
    expect(queue.dequeue()).to.eql(3);

    expect(queue.dequeue()).to.eql(4);
    expect(queue.dequeue()).to.eql(5);
    expect(queue.dequeue()).to.eql(6);

    // Should only show the count move once the NodeJS
    // environment has ticked. 10msec is arbitrary and
    // high.
    expect(count).to.eql(3);
    await bluebird.delay(10);
    expect(count).to.eql(6);
  });
});
