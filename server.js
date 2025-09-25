import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.urlencoded({ extended: true })); // <-- handle x-www-form-urlencoded
app.use(express.json()); // <-- handle JSON

const webhook = process.env.DISCORD_WEBHOOK;

app.get("/", (req, res) => {
  res.send("Relay is running ✅");
});

app.post("/relay", async (req, res) => {
  // works for both JSON and urlencoded
  const log = req.body.log || "No log received";

  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "```" + log + "```" })
    });

    if (!r.ok) {
      console.error("Discord error:", await r.text());
      return res.status(500).send("Discord relay failed");
    }

    res.send("OK");
  } catch (err) {
    console.error("Relay error:", err);
    res.status(500).send("Relay server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Relay running on port " + PORT));
