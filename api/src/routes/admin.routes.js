const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get(
  "/admin/protected",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

module.exports = router;
