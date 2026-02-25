const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(email, password) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = { login };
