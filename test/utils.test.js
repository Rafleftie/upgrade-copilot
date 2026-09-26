const test = require('node:test');
const assert = require('node:assert');
const { getNames, hasAdmin, findActiveUser, filterActiveUsers, firstTwo, groupById } = require('../src/utils');

// NOTE: filterActiveUsers, firstTwo, and groupById are intentionally
// left untested here, as are everything in orders.js and reporting.js.
// This gives the "test coverage checker" subagent real gaps to find.

test('getNames returns a list of names', () => {
  const people = [{ name: 'Ada' }, { name: 'Grace' }];
  assert.deepStrictEqual(getNames(people), ['Ada', 'Grace']);
});

test('hasAdmin detects an admin in the collection', () => {
  assert.strictEqual(hasAdmin(['user', 'admin']), true);
});

test('findActiveUser finds the first active user', () => {
  const users = [
    { name: 'a', active: false },
    { name: 'b', active: true },
  ];
  assert.deepStrictEqual(findActiveUser(users), { name: 'b', active: true });
});

test('filterActiveUsers returns only active users', () => {
  const users = [{ name: 'a', active: false }, { name: 'b', active: true }];
  assert.deepStrictEqual(filterActiveUsers(users), [{ name: 'b', active: true }]);
});

test('firstTwo returns the first two items', () => {
  assert.deepStrictEqual(firstTwo([10, 20, 30]), [10, 20]);
});

test('groupById builds a lookup object keyed by id', () => {
  const items = [{ id: 1, val: 'a' }, { id: 2, val: 'b' }];
  assert.deepStrictEqual(groupById(items), { 1: { id: 1, val: 'a' }, 2: { id: 2, val: 'b' } });
});
