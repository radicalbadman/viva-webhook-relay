const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.json());

// ✅ Use your hardcoded values (fine for now)
const VERIFICATION_KEY = "Ky95D2YTb14XKaQ6o91uJmPW3843VN";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/qzb8y2hqnnwdfuolu7p01g29ori9l5b5";

// ✅ Root endpoint — this is what Viva checks during verification
app.get("/", (req, res) => {
  res.status(200).send("Viva Webhook Relay is live");
});

// ✅ Optional: Viva may also ping /webhook with GET to verify
app.get("/webhook", (req, res) => {
  res.status(200).json({ Key: VERIFICATION_KEY });
});

// ✅ The actual forwarding logic
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

// ✅ Listen on Render’s assigned port (not 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay server is running on port ${PORT}`);
});
