/* @flow */

// NPM Imports
import chai from 'chai';

// Internal Imports
import JsonFormat from '../../src/formats/json';

// Globals
const expect = chai.expect;

describe('formats/json', () => {
  it('Should default to UTF-8 encoding', () => {
    const instance = new JsonFormat();
    expect(instance.encoding).to.eql('utf-8');
  });
});
