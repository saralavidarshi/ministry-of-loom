import { http } from "./http";

export const fetchProducts = async () => {
  const res = await http.get("/products");
  return res.data.items;
};
