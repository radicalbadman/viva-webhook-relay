const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- --- --- --- --- --- --- --- ---
// --- 1. PASTE YOUR KEY FROM PART 1 HERE ---
// --- --- --- --- --- --- --- --- ---
const VIVA_VERIFICATION_KEY = "E35C5F2B3DAFDB693E46C4B6A5394F159F79A95C";

// --- --- --- --- --- --- --- --- ---
// --- 2. PASTE YOUR MAKE.COM URL HERE ---
// --- --- --- --- --- --- --- --- ---
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/62o56iqwkyrst2td6yd6w2ow1usoyod4";

// --- --- --- --- --- --- --- --- ---
// --- DO NOT EDIT BELOW THIS LINE ---
// --- --- --- --- --- --- --- --- ---

const PORT = process.env.PORT || 10000;

// Route 1: Viva's GET request for verification
app.get('/', (req, res) => {
  console.log('Received GET verification request.');
  res.status(200).json({ "Key": VIVA_VERIFICATION_KEY });
});

// Route 2: Viva's POST request with data
app.post('/', async (req, res) => {
  console.log('Received POST data, forwarding to Make.com...');
  try {
    await axios.post(MAKE_WEBHOOK_URL, req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error forwarding to Make.com:', error.message);
    res.status(500).send('Error.');
  }
});

app.listen(PORT, () => {
  console.log(`Relay server listening on port ${PORT}`);
});
