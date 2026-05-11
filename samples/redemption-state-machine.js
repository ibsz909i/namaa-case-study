export const redemptionStatuses = Object.freeze({
  CREATED: "created",
  PRESENTED: "presented",
  VERIFIED: "verified",
  REDEEMED: "redeemed",
  EXPIRED: "expired",
  REJECTED: "rejected",
});

const allowedTransitions = Object.freeze({
  [redemptionStatuses.CREATED]: new Set([
    redemptionStatuses.PRESENTED,
    redemptionStatuses.EXPIRED,
    redemptionStatuses.REJECTED,
  ]),
  [redemptionStatuses.PRESENTED]: new Set([
    redemptionStatuses.VERIFIED,
    redemptionStatuses.EXPIRED,
    redemptionStatuses.REJECTED,
  ]),
  [redemptionStatuses.VERIFIED]: new Set([
    redemptionStatuses.REDEEMED,
    redemptionStatuses.EXPIRED,
    redemptionStatuses.REJECTED,
  ]),
  [redemptionStatuses.REDEEMED]: new Set(),
  [redemptionStatuses.EXPIRED]: new Set(),
  [redemptionStatuses.REJECTED]: new Set(),
});

export function isTerminalStatus(status) {
  return allowedTransitions[status]?.size === 0;
}

export function canTransition(fromStatus, toStatus) {
  return allowedTransitions[fromStatus]?.has(toStatus) ?? false;
}

export function transitionRedemption(redemption, nextStatus, context = {}) {
  if (!redemption || typeof redemption !== "object") {
    throw new TypeError("A redemption object is required.");
  }

  const currentStatus = redemption.status;

  if (!Object.values(redemptionStatuses).includes(currentStatus)) {
    throw new Error(`Unknown redemption status: ${currentStatus}`);
  }

  if (!Object.values(redemptionStatuses).includes(nextStatus)) {
    throw new Error(`Unknown next status: ${nextStatus}`);
  }

  if (currentStatus === nextStatus) {
    return {
      ...redemption,
      lastEvent: "duplicate_transition_ignored",
    };
  }

  if (!canTransition(currentStatus, nextStatus)) {
    throw new Error(`Cannot move redemption from ${currentStatus} to ${nextStatus}.`);
  }

  return {
    ...redemption,
    status: nextStatus,
    updatedAt: context.now ?? new Date().toISOString(),
    lastEvent: context.eventName ?? `moved_to_${nextStatus}`,
    handledBy: context.actor ?? "system",
  };
}

export function createRedemption({ customerId, merchantId, offerId, pointsCost }) {
  if (!customerId || !merchantId || !offerId) {
    throw new Error("customerId, merchantId, and offerId are required.");
  }

  if (!Number.isInteger(pointsCost) || pointsCost <= 0) {
    throw new Error("pointsCost must be a positive integer.");
  }

  return {
    id: `demo_redemption_${customerId}_${merchantId}_${offerId}`,
    customerId,
    merchantId,
    offerId,
    pointsCost,
    status: redemptionStatuses.CREATED,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    lastEvent: "created",
    handledBy: "system",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const redemption = createRedemption({
    customerId: "customer_demo_1",
    merchantId: "merchant_demo_1",
    offerId: "offer_demo_1",
    pointsCost: 120,
  });

  const presented = transitionRedemption(redemption, redemptionStatuses.PRESENTED, {
    actor: "customer",
    eventName: "qr_code_presented",
  });

  const verified = transitionRedemption(presented, redemptionStatuses.VERIFIED, {
    actor: "merchant",
    eventName: "merchant_verified_code",
  });

  const redeemed = transitionRedemption(verified, redemptionStatuses.REDEEMED, {
    actor: "system",
    eventName: "wallet_points_committed",
  });

  console.table([redemption, presented, verified, redeemed]);
}

