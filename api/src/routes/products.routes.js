const router = require("express").Router();
const {
  getAllProducts,
  getProductById,
} = require("../services/product.service");

router.get("/products", async (req, res) => {
  try {
    const items = await getAllProducts();
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
