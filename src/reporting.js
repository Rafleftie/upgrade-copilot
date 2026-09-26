const _ = require('lodash');

// Converts an object into a list of [key, value] pairs.
function toPairsList(obj) {
  return _.toPairs(obj);
}

// Returns every item except the first.
function restOfList(items) {
  return _.tail(items);
}

module.exports = { toPairsList, restOfList };
