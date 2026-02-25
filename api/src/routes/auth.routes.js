const router = require("express").Router();
const { login } = require("../services/auth.service");

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);

    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
