const test = require('node:test');
const assert = require('node:assert');
const { toPairsList, restOfList } = require('../src/reporting');

test('toPairsList converts an object to key-value pairs', () => {
  assert.deepStrictEqual(toPairsList({ a: 1, b: 2 }), [['a', 1], ['b', 2]]);
});

test('restOfList returns everything except the first element', () => {
  assert.deepStrictEqual(restOfList([1, 2, 3]), [2, 3]);
});
