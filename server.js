const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post("/chat", async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.map((b) => b.text).join("") || "";
    res.json({ reply });
  } catch (err) {
    console.error("Greška:", err);
    res.status(500).json({ error: "Greška na serveru" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Pazi chatbot server radi!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
