const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "..", "mindaid.db");

let db;

function initDb() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);

      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            level INTEGER NOT NULL,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`
        );

        db.run(
          `CREATE TABLE IF NOT EXISTS support_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`
        );

        db.run(
          `CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            category TEXT NOT NULL,
            length INTEGER,
            type TEXT
          )`,
          (createErr) => {
            if (createErr) return reject(createErr);

            db.get("SELECT COUNT(*) AS count FROM resources", (countErr, row) => {
              if (countErr) return reject(countErr);
              if (row.count === 0) {
                const stmt = db.prepare(
                  "INSERT INTO resources (title, summary, category, length, type) VALUES (?, ?, ?, ?, ?)"
                );
                const seed = [
                  [
                    "Understanding Anxiety in 5 Minutes",
                    "A short guide to what anxiety is, why it shows up, and how to respond with curiosity instead of criticism.",
                    "Anxiety",
                    5,
                    "Read",
                  ],
                  [
                    "Micro Habits for Better Sleep",
                    "Tiny, realistic changes that can improve sleep quality and help regulate your mood.",
                    "Sleep",
                    7,
                    "Read",
                  ],
                  [
                    "How to Create a Calm-Down Plan",
                    "A simple step-by-step template to prepare for moments when emotions feel too intense.",
                    "Coping Skills",
                    6,
                    "Read",
                  ],
                  [
                    "Cognitive Distortions 101",
                    "Learn common thinking traps (like all-or-nothing thinking) and how to gently challenge them.",
                    "Thinking Patterns",
                    8,
                    "Read",
                  ],
                  [
                    "Checking In With Yourself",
                    "Questions to ask yourself during a rough day to better understand what you need.",
                    "Self-Reflection",
                    4,
                    "Read",
                  ],
                  [
                    "Supporting a Friend Who’s Struggling",
                    "Practical, non-clinical ways to show up for someone dealing with emotional pain.",
                    "Relationships",
                    9,
                    "Read",
                  ],
                ];
                seed.forEach((rowValues) => stmt.run(rowValues));
                stmt.finalize((finalizeErr) => {
                  if (finalizeErr) return reject(finalizeErr);
                  resolve();
                });
              } else {
                resolve();
              }
            });
          }
        );
      });
    });
  });
}

function getMoods() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, date, level, notes FROM moods ORDER BY date DESC, id DESC LIMIT 20",
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function addMood({ date, level, notes }) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO moods (date, level, notes) VALUES (?, ?, ?)",
      [date, level, notes],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function getResources() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, title, summary, category, length, type FROM resources ORDER BY id ASC",
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function addSupport({ title, description }) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO support_requests (title, description) VALUES (?, ?)",
      [title, description],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

module.exports = {
  initDb,
  getMoods,
  addMood,
  getResources,
  addSupport,
};


