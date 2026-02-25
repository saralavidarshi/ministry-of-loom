const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createProduct,
  updateProduct,
  deleteProduct
} = require("../services/product.service");

// Simple validation (keep it minimal for demo)
function validateProduct(req, res, next) {
  const { name, description, price, category, inventory_count } = req.body;

  if (!name || !description || price === undefined || !category || inventory_count === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (Number(price) <= 0) return res.status(400).json({ error: "price must be > 0" });
  if (Number(inventory_count) < 0) return res.status(400).json({ error: "inventory_count must be >= 0" });

  next();
}

// ADMIN only
router.post(
  "/admin/products",
  authenticate,
  authorize("ADMIN"),
  validateProduct,
  async (req, res) => {
    try {
      const product = await createProduct(req.body);
      res.status(201).json({ product });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

router.put(
  "/admin/products/:id",
  authenticate,
  authorize("ADMIN"),
  validateProduct,
  async (req, res) => {
    try {
      const product = await updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ error: "Not found" });
      res.json({ product });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

router.delete(
  "/admin/products/:id",
  authenticate,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const count=await deleteProduct(req.params.id);
      if (!count) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

module.exports = router;
