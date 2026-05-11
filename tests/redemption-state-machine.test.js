import assert from "node:assert/strict";
import {
  canTransition,
  createRedemption,
  isTerminalStatus,
  redemptionStatuses,
  transitionRedemption,
} from "../samples/redemption-state-machine.js";

const redemption = createRedemption({
  customerId: "customer_demo_1",
  merchantId: "merchant_demo_1",
  offerId: "offer_demo_1",
  pointsCost: 120,
});

assert.equal(redemption.status, redemptionStatuses.CREATED);
assert.equal(canTransition(redemptionStatuses.CREATED, redemptionStatuses.PRESENTED), true);
assert.equal(canTransition(redemptionStatuses.CREATED, redemptionStatuses.REDEEMED), false);

const presented = transitionRedemption(redemption, redemptionStatuses.PRESENTED, {
  actor: "customer",
  eventName: "qr_code_presented",
});

const duplicate = transitionRedemption(presented, redemptionStatuses.PRESENTED);
assert.equal(duplicate.status, redemptionStatuses.PRESENTED);
assert.equal(duplicate.lastEvent, "duplicate_transition_ignored");

const verified = transitionRedemption(presented, redemptionStatuses.VERIFIED, {
  actor: "merchant",
});
const redeemed = transitionRedemption(verified, redemptionStatuses.REDEEMED);

assert.equal(isTerminalStatus(redeemed.status), true);
assert.throws(
  () => transitionRedemption(redeemed, redemptionStatuses.PRESENTED),
  /Cannot move redemption/
);

console.log("redemption-state-machine.test.js passed");

