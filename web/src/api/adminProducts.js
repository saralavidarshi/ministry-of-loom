import { http } from "./http";

export const adminCreateProduct = async (payload) => {
  const res = await http.post("/admin/products", payload);
  return res.data.product;
};

export const adminUpdateProduct = async (id, payload) => {
  const res = await http.put(`/admin/products/${id}`, payload);
  return res.data.product;
};

export const adminDeleteProduct = async (id) => {
  const res = await http.delete(`/admin/products/${id}`);
  return res.data;
};



