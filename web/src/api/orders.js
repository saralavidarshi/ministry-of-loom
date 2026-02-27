import { http } from "./http";

export async function createOrder(items) {
  const res = await http.post("/orders", { items });
  return res.data.order;
}

export async function getMyOrders() {
  const res = await http.get("/orders/me");
  return res.data.items;
}