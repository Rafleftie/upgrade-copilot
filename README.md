# Upgrade Copilot — sample project

This is a deliberately small, self-contained project for demoing
**Upgrade Copilot**: an IBM Bob 2.0 workflow that assesses whether a
dependency version bump is safe, by cross-referencing the dependency's
documented breaking changes against how your code actually uses it —
then drafting the safe migrations for you.

## The scenario

This project pins `lodash` at `^3.10.1`. The target upgrade is `lodash@4.x`,
a real, well-documented breaking upgrade (`docs/lodash-v4-migration-notes.md`
summarizes the relevant changes).

The codebase uses several lodash 3.x functions that were renamed, removed,
or changed behavior in 4.x — spread across three files, with **only some
of the call sites covered by tests**. That's intentional: it gives each
subagent in the pipeline something real to find.

| File | What it does | Uses a 4.x-breaking lodash call? | Covered by a test? |
|---|---|---|---|
| `src/utils.js` — `getNames` | list of names via `_.pluck` | Yes (`_.pluck` removed) | Yes |
| `src/utils.js` — `hasAdmin` | membership check via `_.contains` | Yes (`_.contains` renamed) | Yes |
| `src/utils.js` — `findActiveUser` | lookup via `_.findWhere` | Yes (`_.findWhere` removed) | Yes |
| `src/utils.js` — `filterActiveUsers` | filter via `_.where` | Yes (`_.where` removed) | **No** |
| `src/utils.js` — `firstTwo` | `_.first(list, n)` | Yes (signature changed) | **No** |
| `src/utils.js` — `groupById` | `_.indexBy` | Yes (renamed to `_.keyBy`) | **No** |
| `src/orders.js` — `orderTotals` | `_.pluck` again | Yes | **No** |
| `src/orders.js` — `summarize` | `_.each` with a `thisArg` | Yes (`thisArg` dropped in 4.x) | **No** |
| `src/reporting.js` — `toPairsList` | `_.pairs` | Yes (renamed to `_.toPairs`) | **No** |
| `src/reporting.js` — `restOfList` | `_.rest` | Yes (renamed to `_.tail`) | **No** |

## Running it

```
npm install
npm test        # runs the (partial) test suite
node src/index.js   # runs the demo script
```

## What "Upgrade Copilot" should produce from this project

1. A classified list of every lodash 3→4 breaking change from the migration
   notes (breaking / renamed / behavior-changed).
2. Every call site in this repo that touches lodash.
3. A cross-reference: which of those call sites are actually at risk from a
   breaking change (all 8 of the ones marked "Yes" above), versus which are
   safe because they don't touch anything that changed.
4. A flag on the 7 at-risk call sites that have **no test coverage** — i.e.
   where upgrading would be flying blind.
5. Draft patches for each at-risk call site, based on the migration notes.
