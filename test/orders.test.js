const test = require('node:test');
const assert = require('node:assert');
const { orderTotals, summarize } = require('../src/orders');

test('orderTotals returns the total from each order', () => {
  const orders = [{ total: 10 }, { total: 20 }];
  assert.deepStrictEqual(orderTotals(orders), [10, 20]);
});

test('summarize accumulates totals onto the context object', () => {
  const orders = [{ total: 10 }, { total: 20 }];
  const ctx = { total: 0 };
  const result = summarize(orders, ctx);
  assert.strictEqual(result.total, 30);
});
