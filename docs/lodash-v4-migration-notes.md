# Migration notes: lodash 3.x → 4.x

Internal summary of the changes relevant to this codebase, prepared for the
upgrade risk assessment. Written from the official lodash 4.0 release notes
and migration guide, condensed to the parts that matter for our usage.

## Renamed or removed functions

| 3.x name      | Status in 4.x                          | Notes |
|---------------|------------------------------------------|-------|
| `_.pluck`     | Removed                                  | Replace with `_.map(collection, 'propertyName')` — lodash 4's `_.map` accepts a property-name shorthand that does the same job. |
| `_.contains`  | Renamed to `_.includes`                  | Same behavior, new name. |
| `_.findWhere` | Removed                                  | Replace with `_.find(collection, matchObject)` — `_.find` accepts a plain object as a shorthand for matching properties. |
| `_.where`     | Removed                                  | Replace with `_.filter(collection, matchObject)`, same shorthand as above. |
| `_.indexBy`   | Renamed to `_.keyBy`                     | Same behavior, new name. |
| `_.pairs`     | Renamed to `_.toPairs`                   | Same behavior, new name. |
| `_.rest`      | Renamed to `_.tail`                      | Same behavior, new name. |

## Behavior changes (function kept, signature/semantics changed)

- **`_.first` / `_.last` with a count argument**: in 3.x, calling
  `_.first(list, n)` returned the first `n` elements. In 4.x, `_.first`
  (aliased `_.head`) only ever returns a single element — the first item —
  and no longer accepts a count. To get the first `n` elements in 4.x, use
  `_.take(list, n)` instead.
- **Collection iteration methods lose the `thisArg` parameter**: in 3.x,
  methods like `_.each`/`_.forEach` accepted a third argument that was bound
  as `this` inside the iteratee callback. In 4.x this parameter was dropped
  entirely from collection methods. Code relying on it needs to either use
  an arrow function that closes over the outer `this`/variable, or use
  `Function.prototype.bind` on the iteratee before passing it in.

## Functions unaffected by this upgrade (for reference)

Everything else currently used in this codebase — none beyond what's listed
above — keeps the same name and behavior between 3.x and 4.x.
