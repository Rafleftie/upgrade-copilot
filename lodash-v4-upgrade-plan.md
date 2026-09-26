# Lodash v3 → v4 Upgrade Plan

## Top-Level Overview

**Goal:** Upgrade lodash from `3.10.1` to `4.x` in this project with zero regressions.

**Scope:** Every lodash call in `src/` touches a breaking change, so all three source files must be migrated. Tests in `test/` that exercise affected functions are verified; new minimal happy-path tests (one per function, matching the style of the existing `test/utils.test.js`) are added for the 7 currently-untested affected functions. The `package.json` version pin is updated last, after all code is safe.

**Design decisions (confirmed):**
- `summarize` in `src/orders.js` will use an arrow function closing over `context` — no `.bind()`.
- New tests are minimal: one happy-path assertion per function, using `node:test` + `node:assert`, matching the style of `test/utils.test.js`.

---

## Risk Assessment Summary

### Breaking changes (from `docs/lodash-v4-migration-notes.md`)

| Category | v3 API | v4 Replacement |
|---|---|---|
| Removed | `_.pluck(coll, key)` | `_.map(coll, key)` |
| Removed | `_.findWhere(coll, obj)` | `_.find(coll, obj)` |
| Removed | `_.where(coll, obj)` | `_.filter(coll, obj)` |
| Renamed | `_.contains` | `_.includes` |
| Renamed | `_.indexBy` | `_.keyBy` |
| Renamed | `_.pairs` | `_.toPairs` |
| Renamed | `_.rest` | `_.tail` |
| Signature change | `_.first(list, n)` → n elements | `_.take(list, n)` |
| Signature change | `_.each(coll, fn, thisArg)` | `thisArg` dropped; use arrow fn |

### Affected calls mapped per file

**`src/utils.js`** — 6 broken calls:

| Line | Call | Fix |
|---|---|---|
| 5 | `_.pluck(people, 'name')` | `_.map(people, 'name')` |
| 10 | `_.contains(users, 'admin')` | `_.includes(users, 'admin')` |
| 15 | `_.findWhere(users, { active: true })` | `_.find(users, { active: true })` |
| 20 | `_.where(users, { active: true })` | `_.filter(users, { active: true })` |
| 25 | `_.first(items, 2)` | `_.take(items, 2)` |
| 30 | `_.indexBy(items, 'id')` | `_.keyBy(items, 'id')` |

**`src/reporting.js`** — 2 broken calls:

| Line | Call | Fix |
|---|---|---|
| 5 | `_.pairs(obj)` | `_.toPairs(obj)` |
| 10 | `_.rest(items)` | `_.tail(items)` |

**`src/orders.js`** — 2 broken calls:

| Line | Call | Fix |
|---|---|---|
| 5 | `_.pluck(orders, 'total')` | `_.map(orders, 'total')` |
| 11-13 | `_.each(orders, fn, context)` | Arrow fn closing over `context`; remove third arg |

### Test coverage for affected functions

| Function | File | Has test? |
|---|---|---|
| `getNames` | `src/utils.js` | ✅ `test/utils.test.js` line 9 |
| `hasAdmin` | `src/utils.js` | ✅ `test/utils.test.js` line 14 |
| `findActiveUser` | `src/utils.js` | ✅ `test/utils.test.js` line 18 |
| `filterActiveUsers` | `src/utils.js` | ❌ needs new test |
| `firstTwo` | `src/utils.js` | ❌ needs new test |
| `groupById` | `src/utils.js` | ❌ needs new test |
| `toPairsList` | `src/reporting.js` | ❌ needs new test file |
| `restOfList` | `src/reporting.js` | ❌ needs new test file |
| `orderTotals` | `src/orders.js` | ❌ needs new test file |
| `summarize` | `src/orders.js` | ❌ needs new test file |

---

## Sub-Tasks

---

### Sub-Task 1 — Fix `src/utils.js`

**Status:** `[x] done`

**Intent:** Replace all 6 broken lodash calls in `src/utils.js` with their v4 equivalents. No other lines in the file are changed.

**Expected Outcomes:**
- `_.pluck` → `_.map`
- `_.contains` → `_.includes`
- `_.findWhere` → `_.find`
- `_.where` → `_.filter`
- `_.first(items, 2)` → `_.take(items, 2)`
- `_.indexBy` → `_.keyBy`

**Todo List:**
1. In `src/utils.js` line 5, replace `_.pluck(people, 'name')` with `_.map(people, 'name')`
2. Line 10: replace `_.contains(users, 'admin')` with `_.includes(users, 'admin')`
3. Line 15: replace `_.findWhere(users, { active: true })` with `_.find(users, { active: true })`
4. Line 20: replace `_.where(users, { active: true })` with `_.filter(users, { active: true })`
5. Line 25: replace `_.first(items, 2)` with `_.take(items, 2)`
6. Line 30: replace `_.indexBy(items, 'id')` with `_.keyBy(items, 'id')`

**Relevant Context:**
- File: `src/utils.js`

---

### Sub-Task 2 — Fix `src/reporting.js`

**Status:** `[x] done`

**Intent:** Replace the 2 renamed lodash calls in `src/reporting.js`. No other lines in the file are changed.

**Expected Outcomes:**
- `_.pairs` → `_.toPairs`
- `_.rest` → `_.tail`

**Todo List:**
1. In `src/reporting.js` line 5, replace `_.pairs(obj)` with `_.toPairs(obj)`
2. Line 10: replace `_.rest(items)` with `_.tail(items)`

**Relevant Context:**
- File: `src/reporting.js`

---

### Sub-Task 3 — Fix `src/orders.js`

**Status:** `[x] done`

**Intent:** Replace the removed `_.pluck` call and rewrite `summarize` to drop the `thisArg` pattern using an arrow function that closes over `context`. External behavior is unchanged — the function still mutates and returns `context`.

**Expected Outcomes:**
- `_.pluck(orders, 'total')` → `_.map(orders, 'total')`
- `_.each(orders, function(order){ this.total += order.total; }, context)` becomes:
  ```js
  _.each(orders, (order) => {
    context.total += order.total;
  });
  ```

**Todo List:**
1. In `src/orders.js` line 5, replace `_.pluck(orders, 'total')` with `_.map(orders, 'total')`
2. Lines 11-13: replace the anonymous `function` + third `context` argument with an arrow function that closes over `context` and remove the third argument entirely

**Relevant Context:**
- File: `src/orders.js`
- The public contract of `summarize(orders, context)` does not change.

---

### Sub-Task 4 — Add missing tests for all 7 untested affected functions

**Status:** `[x] done`

**Intent:** Provide at least one minimal happy-path test for every affected function that currently lacks coverage, so that the lodash v4 fixes can be verified by running the test suite. Style matches the existing `test/utils.test.js` exactly: `node:test` + `node:assert`, one `test()` block per function.

**Expected Outcomes:**
- `test/utils.test.js` gains 3 new test cases at the bottom: `filterActiveUsers`, `firstTwo`, `groupById`
- `test/reporting.test.js` is created with 2 test cases: `toPairsList`, `restOfList`
- `test/orders.test.js` is created with 2 test cases: `orderTotals`, `summarize`
- All new tests pass against the fixed source files from Sub-Tasks 1–3

**Todo List:**

1. Append to `test/utils.test.js` (after the existing `findActiveUser` test):
   ```js
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
   ```
   - Update the destructured import on line 3 to also include `filterActiveUsers`, `firstTwo`, `groupById`

2. Create `test/reporting.test.js`:
   ```js
   const test = require('node:test');
   const assert = require('node:assert');
   const { toPairsList, restOfList } = require('../src/reporting');

   test('toPairsList converts an object to key-value pairs', () => {
     assert.deepStrictEqual(toPairsList({ a: 1, b: 2 }), [['a', 1], ['b', 2]]);
   });

   test('restOfList returns everything except the first element', () => {
     assert.deepStrictEqual(restOfList([1, 2, 3]), [2, 3]);
   });
   ```

3. Create `test/orders.test.js`:
   ```js
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
   ```

**Relevant Context:**
- Existing test style: `test/utils.test.js`
- Test framework: `node:test` + `node:assert` (Node.js built-in, no install needed)

---

### Sub-Task 5 — Bump `package.json` to lodash `^4.17.21`

**Status:** `[x] done`

**Intent:** Update the version constraint so that `npm install` fetches lodash 4. This must happen after Sub-Tasks 1–3 so the codebase is never in a state where it calls v3-only APIs against a v4 install.

**Expected Outcomes:**
- `"lodash": "3.10.1"` becomes `"lodash": "^4.17.21"` in `package.json`

**Todo List:**
1. In `package.json`, change `"lodash": "3.10.1"` to `"lodash": "^4.17.21"`

**Relevant Context:**
- File: `package.json`
- **Must be the final sub-task.**

---

## Execution Order

Sub-Tasks 1, 2, and 3 are independent — they can be done in any order. Sub-Task 4 depends on 1–3 (tests must run against fixed code). Sub-Task 5 must be last.

```
Sub-Task 1  (fix utils.js)      ──┐
Sub-Task 2  (fix reporting.js)  ──┼──► Sub-Task 4 (add tests) ──► Sub-Task 5 (bump package.json)
Sub-Task 3  (fix orders.js)     ──┘
```
