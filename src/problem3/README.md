# WalletPage Refactor Review

## Problem

Review the `WalletPage` component and identify computational inefficiencies, React anti-patterns, TypeScript issues, and logic bugs. A refactored version is also provided.

## Key Findings

| Area        | Issue                                                                            | Fix                                                                                |
| ----------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| TypeScript  | `WalletBalance` is missing `blockchain`, but the code uses `balance.blockchain`. | Add `blockchain: string` to the interface.                                         |
| TypeScript  | `getPriority` uses `any`.                                                        | Use `string` instead of `any`.                                                     |
| Logic       | `lhsPriority` is referenced but never defined.                                   | Use the current balance priority.                                                  |
| Logic       | Filter condition keeps `amount <= 0`.                                            | Keep valid positive balances with `amount > 0`.                                    |
| Logic       | `formattedBalances` is calculated but not used.                                  | Render from the processed/formatted balance list.                                  |
| Logic       | Sort comparator may return `undefined` when priorities are equal.                | Return a numeric result for all cases.                                             |
| Performance | `getPriority` is recreated on every render.                                      | Move priority logic outside the component.                                         |
| Performance | `prices` is included in the sorting memo even when sorting does not use it.      | Use dependencies only where needed, or include price calculation in the same memo. |
| React       | Uses array index as `key`.                                                       | Use a more stable key like `blockchain-currency`.                                  |
| React       | `children` is destructured but not rendered.                                     | Render `children` or remove it.                                                    |
| Safety      | Missing price values can produce `NaN`.                                          | Use a fallback: `prices[currency] ?? 0`.                                           |

## Refactor Notes

- Priority values are stored in a lookup object instead of a `switch`.
- Filtering, sorting, formatting, and USD value calculation are handled in one memoized pipeline.
- `WalletRow` receives already prepared display data.
- The row key is more stable than the original array index.

## Assumptions

- `classes.row`, `WalletRow`, `BoxProps`, `useWalletBalances`, and `usePrices` are already defined or imported elsewhere.
- If a real unique balance ID exists, it should be used as the React key instead of `blockchain-currency`.
