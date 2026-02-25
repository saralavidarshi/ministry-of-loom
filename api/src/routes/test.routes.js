const router = require("express").Router();
const { resetDatabase, seedDatabase } = require("../services/seed.services");

function validateToken(req, res, next) {
  if (req.headers["x-seed-token"] !== process.env.TEST_SEED_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/api/test/reset", validateToken, async (req, res) => {
  await resetDatabase();
  res.json({ success: true });
});

router.post("/api/test/seed", validateToken, async (req, res) => {
  await seedDatabase();
  res.json({ success: true });
});

module.exports = router;
