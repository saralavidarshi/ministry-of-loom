const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log("Migrations completed");
  process.exit();
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});
