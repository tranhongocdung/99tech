# WalletPage Code Review: Computational Inefficiencies, Anti-Patterns & Additional Issues

This document summarizes the issues found in the original `original.tsx` implementation of the WalletPage component, focusing on computational inefficiencies, code anti-patterns, naming conventions, code logic, and performance issues.

## 1. Type/Interface Issues
- **Missing Properties:**
  - `WalletBalance` interface lacks a `blockchain` property, but the code expects it.
- **Missing Imports:**
  - `BoxProps`, `React`, `useWalletBalances`, `usePrices`, `WalletRow`, and `classes` are all used but not imported or defined.
- **Inconsistent Types:**
  - `FormattedWalletBalance` is defined but not used consistently.

## 2. Naming Convention Issues
- **Inconsistent or Vague Naming:**
  - Variables like `lhs`, `rhs`, `lhsPriority`, `leftPriority`, `rightPriority` are not descriptive in the context of wallet balances. More meaningful names would improve clarity.
  - The `getPriority` parameter is typed as `any`, which is not type-safe. It should be `string` or a specific union of supported blockchain names.
  - `rows` is a generic name; something like `walletRows` would be more descriptive.
- **Interface Naming:**
  - `FormattedWalletBalance` is only used for adding a `formatted` string, but the code does not consistently use this type, leading to confusion.

## 3. Filtering/Sorting Logic Problems
- **Incorrect Filtering Logic:**
  - The filter logic is flawed: it checks for `lhsPriority > -99` (which is undefined in the filter scope) and `balance.amount <= 0`, which likely does not match the intended logic (probably should filter for positive balances with valid priority).
- **Incorrect Use of Types:**
  - The code expects `blockchain` on `WalletBalance`, but the interface does not define it.
  - The mapping for rendering expects `FormattedWalletBalance`, but the data is not guaranteed to have the `formatted` property.
- **Potential for Runtime Errors:**
  - Accessing `prices[balance.currency]` without checking if the price exists can result in `NaN` values.
  - Using `classes.row` without ensuring `classes` is defined.
- **Unused Variables:**
  - `children` is destructured from props but never used.

## 4. Performance Issues
- **Unnecessary Recomputations:**
  - The `useMemo` for `sortedBalances` depends on both `balances` and `prices`, but only `balances` is used in the computation.
  - The `formattedBalances` mapping is done outside of the main rendering loop, but the code then maps over `sortedBalances` again for rendering, duplicating work.
- **Inefficient Filtering and Sorting:**
  - The code filters and sorts in a single `useMemo`, but the filter logic is inefficient and may include unnecessary items.
  - The filter and sort could be combined more efficiently, and the logic should be clarified to avoid unnecessary iterations.
- **Key Prop Usage:**
  - Using `index` as a key in a list can cause unnecessary re-renders and bugs if the list order changes.

## 5. JSX/React Usage
- **Missing React Import:**
  - `React` is not imported, which is required for JSX unless using the new JSX transform.
- **Undefined Components/Classes:**
  - `WalletRow` and `classes.row` are used without import or definition.

## 6. General Code Quality
- **Lack of Error Handling:**
  - The code does not handle missing prices or balances gracefully.
- **Poor Modularity:**
  - The code is not modular and mixes logic and rendering.

## 7. Additional Minor Issues
- **Formatting:**
  - `balance.amount.toFixed()` is used without specifying decimals, which may not be user-friendly for all currencies.
- **Type Safety:**
  - The use of `any` in function parameters and lack of strict typing can lead to bugs and makes the code harder to maintain.

---

## Optimization: Using a Lookup Object for Blockchain Priority

**Previous Approach:**
- The original code used a `switch` statement in the `getPriority` function to assign priorities to blockchains. This approach is verbose and requires manual updates to the function every time a new blockchain is added or priorities change.

**Optimized Approach:**
- The refactored code uses a `BLOCKCHAIN_PRIORITY` lookup object. This allows you to add, remove, or update blockchain priorities in a single place, making the code more maintainable and scalable.
- The `getPriority` function simply returns the value from the lookup object, or a default if not found.

**Benefits:**
- **Easier to maintain:** Adding or updating blockchains only requires editing the lookup object.
- **Scalable:** Supports a large and growing list of blockchains without increasing code complexity.
- **Cleaner code:** Reduces boilerplate and improves readability.

---

For a refactored and improved version, see `refactored.tsx` in this folder. 