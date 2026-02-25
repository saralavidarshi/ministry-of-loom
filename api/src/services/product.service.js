const pool = require("../db/pool");

async function getAllProducts() {
  const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return result.rows;
}

async function getProductById(id) {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
}

async function createProduct(data) {
  const { name, description, price, category, inventory_count, limited_edition, image_url } = data;

  const result = await pool.query(
    `INSERT INTO products (name, description, price, category, inventory_count, limited_edition, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [name, description, price, category, inventory_count, limited_edition, image_url]
  );

  return result.rows[0];
}

async function updateProduct(id, data) {
  const { name, description, price, category, inventory_count, limited_edition, image_url } = data;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, description=$2, price=$3, category=$4,
         inventory_count=$5, limited_edition=$6, image_url=$7
     WHERE id=$8
     RETURNING *`,
    [name, description, price, category, inventory_count, limited_edition, image_url, id]
  );

  return result.rows[0];
}

async function deleteProduct(id) {
  const r = await pool.query("DELETE FROM products WHERE id=$1", [id]);
  return r.rowCount;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
