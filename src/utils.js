const _ = require('lodash');

// Returns a flat list of a given property across a collection.
function getNames(people) {
  return _.map(people, 'name');
}

// Checks whether a collection contains a given value.
function hasAdmin(users) {
  return _.includes(users, 'admin');
}

// Finds the first item in a collection matching a set of properties.
function findActiveUser(users) {
  return _.find(users, { active: true });
}

// Filters a collection down to items matching a set of properties.
function filterActiveUsers(users) {
  return _.filter(users, { active: true });
}

// Returns the first N items of a list.
function firstTwo(items) {
  return _.take(items, 2);
}

// Builds a lookup object keyed by a given property.
function groupById(items) {
  return _.keyBy(items, 'id');
}

module.exports = {
  getNames,
  hasAdmin,
  findActiveUser,
  filterActiveUsers,
  firstTwo,
  groupById,
};
