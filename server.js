const express = require("express");
const path = require("path");
const cors = require("cors");
const { initDb, getMoods, addMood, getResources, addSupport } = require("./src/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get("/api/moods", async (_req, res) => {
  try {
    const moods = await getMoods();
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

app.post("/api/moods", async (req, res) => {
  try {
    const { date, level, notes } = req.body;
    if (!date || !level) {
      return res.status(400).json({ error: "date and level are required" });
    }
    await addMood({ date, level, notes: notes || "" });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save mood" });
  }
});

app.get("/api/resources", async (_req, res) => {
  try {
    const resources = await getResources();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.post("/api/support", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "title and description are required" });
    }
    await addSupport({ title, description });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save support reflection" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MindAid server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });


