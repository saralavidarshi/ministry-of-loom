const pool = require("../db/pool");

// expects req.user to exist (from your JWT middleware)
async function createOrder(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }

  // basic validation
  for (const it of items) {
    if (!it?.product_id || !Number.isInteger(it?.qty) || it.qty <= 0) {
      return res.status(400).json({ error: "Invalid items payload" });
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productIds = items.map(i => i.product_id);

    // Lock product rows to prevent race conditions (overselling)
    const productsRes = await client.query(
      `SELECT id, name, price, inventory_count
       FROM products
       WHERE id = ANY($1::uuid[])
       FOR UPDATE`,
      [productIds]
    );

    const products = new Map(productsRes.rows.map(p => [p.id, p]));

    // Validate all products exist + enough inventory
    let total = 0;

    for (const it of items) {
      const p = products.get(it.product_id);
      if (!p) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: `Product not found: ${it.product_id}` });
      }
      if (it.qty > p.inventory_count) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: `Insufficient stock for: ${p.name}` });
      }
    }

    // Create order row first (total updated after items calc)
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, status, currency, total_amount)
       VALUES ($1, 'PENDING', 'USD', 0)
       RETURNING id, user_id, status, currency, total_amount, created_at`,
      [userId]
    );

    const order = orderRes.rows[0];

    // Insert order items + update inventory
    for (const it of items) {
      const p = products.get(it.product_id);
      const lineTotal = Number(p.price) * it.qty;
      total += lineTotal;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, qty, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, p.id, p.name, p.price, it.qty, lineTotal]
      );

      await client.query(
        `UPDATE products
         SET inventory_count = inventory_count - $1
         WHERE id = $2`,
        [it.qty, p.id]
      );
    }

    // Update order total
    const updatedOrderRes = await client.query(
      `UPDATE orders
       SET total_amount = $1
       WHERE id = $2
       RETURNING id, user_id, status, currency, total_amount, created_at`,
      [total.toFixed(2), order.id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      order: updatedOrderRes.rows[0],
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
}

async function getMyOrders(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const ordersRes = await pool.query(
      `SELECT id, status, currency, total_amount, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    // You can also include items (optional)
    return res.json({ items: ordersRes.rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load orders" });
  }
}

module.exports = { createOrder, getMyOrders };