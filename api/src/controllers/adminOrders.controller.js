const pool = require("../db/pool");

async function listOrders(req, res) {
  try {
    const r = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.currency, o.created_at, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    res.json({ items: r.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load orders" });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["PENDING","PAID","CANCELLED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const r = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: "Order not found" });
    res.json({ order: r.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update order" });
  }
}

module.exports = { listOrders, updateOrderStatus };