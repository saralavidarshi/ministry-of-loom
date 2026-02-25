const pool = require("../db/pool");
const bcrypt = require("bcrypt");

async function resetDatabase() {
  await pool.query("TRUNCATE users, products RESTART IDENTITY CASCADE");
}

async function seedDatabase() {
  const adminPassword = await bcrypt.hash("Admin#123", 10);
  const userPassword = await bcrypt.hash("Cust#123", 10);

  await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES
     ('admin@demo.com', $1, 'ADMIN'),
     ('customer@demo.com', $2, 'CUSTOMER')`,
    [adminPassword, userPassword]
  );

  await pool.query(
    `INSERT INTO products (name, description, price, category, inventory_count, limited_edition)
     VALUES
     ('Silk Batik Blazer', 'Handcrafted luxury batik', 299.99, 'Batik', 10, true),
     ('Linen Heritage Dress', 'Premium European linen', 199.99, 'Linen', 15, false),
     ('Block Print Saree', 'Traditional block printed elegance', 249.99, 'Block Print', 5, true)`
  );
}

module.exports = { resetDatabase, seedDatabase };
