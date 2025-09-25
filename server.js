import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔑 Environment variable set in Render dashboard
const webhook = process.env.DISCORD_WEBHOOK;

if (!webhook) {
  console.error("❌ Missing DISCORD_WEBHOOK env variable");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Relay is running ✅");
});

app.post("/relay", async (req, res) => {
  const { event, log } = req.body;

  // Format Discord message
  const content = event
    ? `**${event.toUpperCase()} LOG**\n\`\`\`${log}\`\`\``
    : `\`\`\`${log || "No log received"}\`\`\``;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Discord relay failed:", err);
    res.status(500).json({ status: "error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Relay running on http://localhost:${PORT}`)
);
