/* @flow */

// NPM
import chai from 'chai';
import cap from 'chai-as-promised';

// Internal
import Sync from '../../src/utilities/Sync';

// Globals
const expect = chai.expect;
chai.use(cap);

describe('utilities/Sync', () => {
  it('Should resolve inline (before next tick)', async () => {
    let latched = false;
    Sync.resolve(42).then(() => {
      latched = true;
    });
    expect(latched).to.eql(true);
  });

  it('Should run chain of then-generators', async () => {
    let latched = false;
    Sync.resolve(42)
      .then(() => Sync.resolve(43))
      .then((x) => {
        latched = true;
        expect(x).to.eql(43);
      });
    expect(latched).to.eql(true);
  });

  it('Should allow long .then chains', async () => {
    const target = 100000;
    let count = 0;

    function chain(x, limit) {
      if (x === limit) {
        return null;
      }
      count += 1;
      return Sync.resolve(x)
        .then(() => chain(x + 1, limit));
    }

    // Should do more than 1 item before
    // the await.
    const promise = chain(count, target);
    expect(count).to.be.gt(1);
    await promise;

    // Eventually hit target
    expect(count).to.eql(target);
  });

  it('Should have a dummy catch block', (done) => {
    Sync.resolve(42)
      .then(() => done())
      .catch(() => done('Should never get called'));
  });
});
