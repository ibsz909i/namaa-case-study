import assert from "node:assert/strict";
import {
  buildIdempotencyKey,
  normalizePosEvent,
} from "../samples/pos-event-normalizer.js";

const normalizedClover = normalizePosEvent("clover", {
  merchantId: "merchant_demo_1",
  device: { storeId: "store_demo_1" },
  payment: {
    id: "payment_demo_1",
    amount: 1299,
    currency: "USD",
    result: "SUCCESS",
  },
});

assert.equal(normalizedClover.provider, "clover");
assert.equal(normalizedClover.status, "paid");
assert.equal(normalizedClover.amountCents, 1299);
assert.equal(
  buildIdempotencyKey(normalizedClover),
  "clover:merchant_demo_1:store_demo_1:payment_demo_1:1299"
);

const normalizedSquare = normalizePosEvent("square", {
  data: {
    object: {
      payment: {
        id: "payment_demo_2",
        merchant_id: "merchant_demo_2",
        location_id: "store_demo_2",
        amount_money: { amount: 2300, currency: "USD" },
        status: "COMPLETED",
      },
    },
  },
});

assert.equal(normalizedSquare.provider, "square");
assert.equal(normalizedSquare.status, "paid");
assert.equal(normalizedSquare.amountCents, 2300);
assert.throws(() => normalizePosEvent("unsupported", {}), /Unsupported POS provider/);

console.log("pos-event-normalizer.test.js passed");

