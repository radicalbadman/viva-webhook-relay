const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.json());

// ✅ Hardcoded values (fine for now)
const VERIFICATION_KEY = "Ky95D2YTb14XKaQ6o91uJmPW3843VN";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/qzb8y2hqnnwdfuolu7p01g29ori9l5b5";

// ✅ Root endpoint — for quick server check
app.get("/", (req, res) => {
  res.status(200).send("Viva Webhook Relay is live");
});

// ✅ Viva verification endpoint — plain text OK response (no JSON)
app.get("/webhook", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Forward Viva POST notifications to Make.com
app.post("/webhook", async (req, res) => {
  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    res.status(200).send("Forwarded to Make.com");
  } catch (err) {
    console.error("Forwarding failed:", err);
    res.status(500).send("Forwarding error");
  }
});

// ✅ Use Render’s assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay server is running on port ${PORT}`);
});
