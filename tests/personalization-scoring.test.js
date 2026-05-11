import assert from "node:assert/strict";
import {
  distanceScore,
  rankMerchants,
  scoreMerchant,
} from "../samples/personalization-scoring.js";

assert.equal(distanceScore(0.4), 10);
assert.equal(distanceScore(1.5), 6);
assert.equal(distanceScore(6), 1);

const ranked = rankMerchants([
  {
    name: "Far Strong Offer",
    distanceMiles: 4,
    offerValue: 10,
    recentActivity: 6,
    customerInterest: 6,
  },
  {
    name: "Nearby Relevant Offer",
    distanceMiles: 0.7,
    offerValue: 8,
    recentActivity: 8,
    customerInterest: 10,
  },
]);

assert.equal(ranked[0].name, "Nearby Relevant Offer");
assert.equal(Number.isFinite(scoreMerchant(ranked[0])), true);

console.log("personalization-scoring.test.js passed");

