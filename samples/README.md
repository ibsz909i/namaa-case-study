# Code Snapshots

These samples use example identifiers and example merchant data to show the technical ideas behind NAMAA in a way that is easy to run and review.

## `personalization-scoring.js`

This file demonstrates a simple merchant ranking idea using fake data. It shows how distance, offer value, merchant activity, and customer interest can be combined into a score.

## `redemption-state-machine.js`

This file demonstrates a small redemption lifecycle: created, presented, verified, redeemed, expired, and rejected. It shows how a reward flow can avoid invalid status movement and duplicate transition problems.

## `pos-event-normalizer.js`

This file demonstrates how Clover and Square-style payment events can be normalized into one internal transaction shape before idempotency checks and reward handling.

## `schema.sql`

This file contains a PostgreSQL schema snapshot for merchants, locations, offers, wallets, wallet events, redemptions, and POS transaction events.

## Run the samples

```bash
npm test
npm run demo:ranking
npm run demo:redemption
npm run demo:pos
```

The goal is to make the engineering approach reviewable through code, not only through written explanation.
