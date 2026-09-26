const _ = require('lodash');

// Returns the total value of each order.
function orderTotals(orders) {
  return _.map(orders, 'total');
}

// Accumulates order totals onto a shared context object, relying on
// lodash passing a custom `this` binding into the iteratee.
function summarize(orders, context) {
  _.each(orders, (order) => {
    context.total += order.total;
  });
  return context;
}

module.exports = { orderTotals, summarize };
