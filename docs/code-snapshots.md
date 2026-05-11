# Code Snapshots

This repository includes small code snapshots for NAMAA. I wrote these samples with example identifiers and example merchant data so the technical ideas are easy to review and run locally.

Production app reference: [NAMAA Loyalty Rewards on the Apple App Store](https://apps.apple.com/us/app/namaa-loyalty-rewards/id6762251888)

## What is included

- `samples/schema.sql` shows PostgreSQL table structure, relationships, constraints, and indexes for a loyalty marketplace.
- `samples/personalization-scoring.js` shows how nearby merchants can be ranked from distance, offer value, merchant activity, and customer interest.
- `samples/redemption-state-machine.js` shows a controlled reward redemption lifecycle with explicit status transitions.
- `samples/pos-event-normalizer.js` shows how Clover and Square-style transaction events can be normalized into one internal shape.
- `tests/*.test.js` proves the samples run and covers the important edge cases.

## Why this is useful

Screenshots are not enough for a technical review. These snapshots show the kind of engineering work behind NAMAA:

- data integrity with SQL constraints, foreign keys, unique idempotency keys, and query indexes
- redemption flow safety through explicit state transitions
- POS integration thinking through normalized transaction events
- personalization logic that is simple to explain and easy to test
- tests that can be run locally without credentials

## Run locally

```bash
npm test
npm run demo:ranking
npm run demo:redemption
npm run demo:pos
```
