# MindAid

MindAid is a simple mental-wellbeing web app with:

- **Mood Tracker**: log your daily mood with notes and review recent entries.
- **Mental First Aid Support**: grounding tips plus a space to write and store reflections.
- **Learning Resources**: short, practical articles seeded into a small database.

> **Note:** MindAid is an educational tool and **not a substitute for professional care or emergency support**.

## Tech stack

- **Frontend**: HTML, CSS, vanilla JavaScript (no framework).
- **Backend**: Node.js + Express.
- **Database**: SQLite (file-based, via `sqlite3` npm package).

## Getting started

1. **Install Node.js** (if you don't already have it)  
   Recommended: the latest LTS version from the official Node.js website.

2. **Install dependencies**

   ```bash
   cd "/Users/eshad/Pictures/porna web project"
   npm install
   ```

3. **Run the backend + serve the frontend**

   ```bash
   npm start
   ```

   This will:

   - create a `mindaid.db` SQLite database file in the project root (if it doesn't exist),
   - apply migrations and seed default learning resources,
   - start the Express server on `http://localhost:4000`.

4. **Open the app**

   Open this URL in your browser:

   ```text
   http://localhost:4000
   ```

   The frontend (`index.html`, `styles.css`, `app.js`) is served as static files from the project root.

## API overview

The frontend talks to the backend using JSON over HTTP at `http://localhost:4000/api`.

- **GET `/api/moods`**  
  Returns the latest mood entries (up to 20).

- **POST `/api/moods`**  
  Body:

  ```json
  {
    "date": "2025-12-15",
    "level": 3,
    "notes": "Optional text"
  }
  ```

- **GET `/api/resources`**  
  Returns seeded learning resources from the `resources` table.

- **POST `/api/support`**  
  Body:

  ```json
  {
    "title": "Short title",
    "description": "What you're going through"
  }
  ```

## Project structure

- `index.html` – main page and layout.
- `styles.css` – visual design and responsive layout.
- `app.js` – frontend logic and API calls.
- `server.js` – Express server + API routes.
- `src/db.js` – SQLite connection, migrations, and queries.
- `mindaid.db` – SQLite database file (auto-created).


