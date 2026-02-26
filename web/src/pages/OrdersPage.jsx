import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getMyOrders();
      setOrders(data);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.status}</td>
              <td>${o.total_amount}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}