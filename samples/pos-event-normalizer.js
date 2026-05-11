const supportedProviders = new Set(["clover", "square"]);

export function normalizePosEvent(provider, event) {
  if (!supportedProviders.has(provider)) {
    throw new Error(`Unsupported POS provider: ${provider}`);
  }

  if (!event || typeof event !== "object") {
    throw new TypeError("A POS event object is required.");
  }

  if (provider === "clover") {
    return normalizeCloverEvent(event);
  }

  return normalizeSquareEvent(event);
}

function normalizeCloverEvent(event) {
  const payment = event.payment ?? {};

  return {
    provider: "clover",
    externalTransactionId: String(payment.id ?? ""),
    merchantReference: String(event.merchantId ?? ""),
    storeReference: String(event.device?.storeId ?? ""),
    amountCents: toCents(payment.amount),
    currency: payment.currency ?? "USD",
    occurredAt: event.createdAt ?? new Date().toISOString(),
    status: mapStatus(payment.result),
    source: "pos_event",
  };
}

function normalizeSquareEvent(event) {
  const payment = event.data?.object?.payment ?? {};

  return {
    provider: "square",
    externalTransactionId: String(payment.id ?? ""),
    merchantReference: String(payment.merchant_id ?? ""),
    storeReference: String(payment.location_id ?? ""),
    amountCents: toCents(payment.amount_money?.amount),
    currency: payment.amount_money?.currency ?? "USD",
    occurredAt: payment.created_at ?? new Date().toISOString(),
    status: mapStatus(payment.status),
    source: "pos_event",
  };
}

function toCents(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
  return Math.round(amount);
}

function mapStatus(status) {
  const normalized = String(status ?? "").toLowerCase();

  if (["success", "completed", "approved"].includes(normalized)) {
    return "paid";
  }

  if (["failed", "declined", "canceled", "cancelled"].includes(normalized)) {
    return "failed";
  }

  return "pending";
}

export function buildIdempotencyKey(event) {
  const parts = [
    event.provider,
    event.merchantReference,
    event.storeReference,
    event.externalTransactionId,
    event.amountCents,
  ];

  return parts.map((part) => String(part || "missing")).join(":");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cloverEvent = {
    merchantId: "merchant_demo_1",
    createdAt: "2026-05-11T14:30:00.000Z",
    device: { storeId: "store_demo_1" },
    payment: {
      id: "clover_payment_demo_1",
      amount: 1299,
      currency: "USD",
      result: "SUCCESS",
    },
  };

  const squareEvent = {
    data: {
      object: {
        payment: {
          id: "square_payment_demo_1",
          merchant_id: "merchant_demo_2",
          location_id: "store_demo_2",
          amount_money: { amount: 2300, currency: "USD" },
          status: "COMPLETED",
          created_at: "2026-05-11T14:35:00.000Z",
        },
      },
    },
  };

  const normalized = [
    normalizePosEvent("clover", cloverEvent),
    normalizePosEvent("square", squareEvent),
  ].map((event) => ({
    ...event,
    idempotencyKey: buildIdempotencyKey(event),
  }));

  console.table(normalized);
}

