/* @flow */

let count = 0;

/**
 * Sync.resolve
 *
 * Helper/cheat method to perform semi-synchronous resolutions of
 * promises when the value is known and cached. The normal promises
 * implementation will transit via the event loop - which is 'fine',
 * but also quite slow.
 */
function resolve(value : any) : Thenable {
  // Every N iterations, bust out a real promise
  // to let the stack breathe a little. Otherwise
  // you will get an overflow fairly quicky. 1000
  // chosen due to un-scientific more/less testing
  count += 1;
  if (count === 1000) {
    count = 0;
    return Promise.resolve(value);
  }

  return {
    // Used for 'internal code' to cheat and just pull the
    // value out and skip an async wait
    outcome: value,

    // Pseudo-promise chaining
    then: (func : ThenableGenerator) => {
      const result = func(value);
      if (result && result.then) {
        return result;
      }

      return resolve(result);
    },

    // To silently allow code that tries to .catch to continue
    // to run, even though a constant can never throw. If the value
    // chains a real promise, that instead will handle .catch.
    catch: () => null,
  };
}

export default {
  resolve,
};
