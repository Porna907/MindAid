const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "mindaid.db");
const table = process.argv[2]; // optional: moods | support_requests | resources

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Could not open database:", err.message);
    process.exit(1);
  }
});

function listTables() {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name ASC",
    (err, rows) => {
      if (err) {
        console.error("Failed to list tables:", err.message);
        return db.close();
      }
      console.log("Tables:");
      rows.forEach((r) => console.log("- " + r.name));
      db.close();
    }
  );
}

function showRows(target) {
  const allowed = ["moods", "support_requests", "resources"];
  if (!allowed.includes(target)) {
    console.error(
      `Unknown table "${target}". Use one of: ${allowed.join(", ")}`
    );
    return db.close();
  }

  db.all(`SELECT * FROM ${target} ORDER BY id DESC LIMIT 20`, (err, rows) => {
    if (err) {
      console.error("Query failed:", err.message);
      return db.close();
    }
    console.log(`Latest rows from "${target}":`);
    console.table(rows);
    db.close();
  });
}

if (table) {
  showRows(table);
} else {
  listTables();
}


