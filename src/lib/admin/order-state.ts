import type { OrderStatus } from "./types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  requested: ["confirmed", "cancelled"], confirmed: ["in_progress", "shipped", "cancelled"],
  in_progress: ["shipped", "cancelled"], shipped: ["delivered", "cancelled"], delivered: [], cancelled: [],
};
export function stockEffect(from: OrderStatus, to: OrderStatus) {
  if (from === to) return 0;
  if (!transitions[from]?.includes(to)) throw new Error(`Cannot change ${from.replaceAll("_", " ")} to ${to.replaceAll("_", " ")}.`);
  if (from === "requested" && to === "confirmed") return -1;
  if (from !== "requested" && to === "cancelled") return 1;
  return 0;
}
