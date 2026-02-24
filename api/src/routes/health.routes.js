const router = require("express").Router();
const pool = require("../db/pool");

router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "OK", db: "OK" });
  } catch (e) {
    res.status(500).json({ status: "ERROR", db: "ERROR", message: e.message });
  }
});

router.get("/version", (req, res) => {
  res.json({ version: process.env.APP_VERSION || "dev" });
});

module.exports = router;
