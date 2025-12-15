const API_BASE = "http://localhost:4000/api";

function $(selector) {
  return document.querySelector(selector);
}

function createEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

async function loadMoods() {
  const list = $("#mood-list");
  const empty = $("#mood-empty");
  list.innerHTML = "";
  empty.style.display = "none";

  try {
    const moods = await fetchJSON(`${API_BASE}/moods`);
    if (!moods.length) {
      empty.style.display = "block";
      return;
    }
    moods.forEach((mood) => {
      const li = createEl("li", "mood-item");
      const left = createEl("div", "mood-meta");
      const right = createEl("div", "mood-score");

      const date = createEl("div", "mood-date");
      date.textContent = formatDate(mood.date);
      left.appendChild(date);

      if (mood.notes) {
        const notes = createEl("div", "mood-notes");
        notes.textContent = mood.notes;
        left.appendChild(notes);
      }

      right.textContent = `Mood: ${mood.level}/5`;

      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
  } catch (err) {
    empty.textContent = "Unable to load moods. Is the server running?";
    empty.style.display = "block";
  }
}

async function loadFirstAidTips() {
  const container = $("#first-aid-tips");
  container.innerHTML = "";
  const tips = [
    {
      title: "5–4–3–2–1 grounding",
      body: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to bring yourself back to the present.",
    },
    {
      title: "Box breathing",
      body: "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat this cycle 4 times to calm your nervous system.",
    },
    {
      title: "Name the feeling",
      body: "Simply putting your emotions into words (“I feel anxious and tired”) can reduce their intensity and help you regain clarity.",
    },
  ];
  tips.forEach((tip) => {
    const wrap = createEl("div", "tip");
    const title = createEl("div", "tip-title");
    const body = createEl("div", "tip-body");
    title.textContent = tip.title;
    body.textContent = tip.body;
    wrap.appendChild(title);
    wrap.appendChild(body);
    container.appendChild(wrap);
  });
}

async function loadResources() {
  const grid = $("#resources-grid");
  grid.innerHTML = "";
  try {
    const resources = await fetchJSON(`${API_BASE}/resources`);
    resources.forEach((resItem) => {
      const card = createEl("article", "resource-card");
      const tag = createEl("span", "resource-tag");
      tag.textContent = resItem.category;
      const title = createEl("div", "resource-title");
      title.textContent = resItem.title;
      const summary = createEl("div", "resource-summary");
      summary.textContent = resItem.summary;
      const meta = createEl("div", "resource-meta");
      meta.textContent = resItem.length
        ? `${resItem.length} min • ${resItem.type || "Read"}`
        : resItem.type || "";

      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(summary);
      if (meta.textContent) card.appendChild(meta);
      grid.appendChild(card);
    });
  } catch (err) {
    const msg = createEl("div", "empty-state");
    msg.textContent = "Unable to load resources. Is the server running?";
    grid.appendChild(msg);
  }
}

function setupMoodForm() {
  const form = $("#mood-form");
  const dateInput = $("#mood-date");
  dateInput.valueAsNumber = Date.now() - new Date().getTimezoneOffset() * 60000;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      date: dateInput.value,
      level: Number($("#mood-level").value),
      notes: $("#mood-notes").value.trim(),
    };
    try {
      await fetchJSON(`${API_BASE}/moods`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      $("#mood-notes").value = "";
      await loadMoods();
    } catch (err) {
      alert("Unable to save mood. Please ensure the server is running.");
      console.error(err);
    }
  });
}

function setupSupportForm() {
  const form = $("#support-form");
  const status = $("#support-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "status-text";

    const payload = {
      title: $("#support-title").value.trim(),
      description: $("#support-description").value.trim(),
    };
    if (!payload.title || !payload.description) return;

    try {
      await fetchJSON(`${API_BASE}/support`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      $("#support-title").value = "";
      $("#support-description").value = "";
      status.textContent = "Reflection saved.";
      status.classList.add("status-text--success");
    } catch (err) {
      status.textContent = "Could not save. Check that the server is running.";
      status.classList.add("status-text--error");
    }
  });
}

function setupScroll() {
  const btn = $("#get-started-btn");
  btn.addEventListener("click", () => {
    document.querySelector("#mood-tracker").scrollIntoView({
      behavior: "smooth",
    });
  });
}

function setYear() {
  $("#year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMoodForm();
  setupSupportForm();
  setupScroll();
  loadFirstAidTips();
  loadMoods();
  loadResources();
  setYear();
});


