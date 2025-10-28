const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(bodyParser.json());

// 👇 Hardcoded values (normally you'd use .env)
const VERIFICATION_KEY = "Ky95D2YTb14XKaQ6o91uJmPW3843VN";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/qzb8y2hqnnwdfuolu7p01g29ori9l5b5";

app.get("/webhook", (req, res) => {
  res.json({ Key: VERIFICATION_KEY });
});

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

app.listen(3000, () => {
  console.log("Relay server is running on port 3000");
});
