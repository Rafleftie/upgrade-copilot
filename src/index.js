const { getNames, hasAdmin, findActiveUser, filterActiveUsers, firstTwo, groupById } = require('./utils');
const { orderTotals, summarize } = require('./orders');
const { toPairsList, restOfList } = require('./reporting');

const people = [
  { id: 1, name: 'Ada', active: true },
  { id: 2, name: 'Grace', active: false },
  { id: 3, name: 'Alan', active: true },
];

const orders = [
  { total: 10 },
  { total: 25 },
  { total: 5 },
];

console.log('Names:', getNames(people));
console.log('Has admin?', hasAdmin(['user', 'admin']));
console.log('First active user:', findActiveUser(people));
console.log('All active users:', filterActiveUsers(people));
console.log('First two people:', firstTwo(people));
console.log('People grouped by id:', groupById(people));
console.log('Order totals:', orderTotals(orders));
console.log('Order summary:', summarize(orders, { total: 0 }));
console.log('Pairs:', toPairsList({ a: 1, b: 2 }));
console.log('Rest of list:', restOfList(people));
