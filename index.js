const express = require('express');
const axios = require('axios');
const app = express();

// This line allows the app to read JSON data
app.use(express.json());

// --- --- --- --- --- --- --- --- ---
// --- 1. PASTE YOUR VIVA KEY HERE ---
// --- --- --- --- --- --- --- --- ---
const VIVA_VERIFICATION_KEY = "E35C5F2B3DAFDB693E46C4B6A5394F159F79A95C";

// --- --- --- --- --- --- --- --- ---
// --- 2. PASTE YOUR MAKE.COM URL HERE ---
// --- --- --- --- --- --- --- --- ---
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/62o56iqwkyrst2td6yd6w2ow1usoyod4";


// --- --- --- --- --- --- --- --- ---
// --- DO NOT EDIT BELOW THIS LINE ---
// --- --- --- --- --- --- --- --- ---

// Render provides a port, but we default to 10000
const PORT = process.env.PORT || 10000;

// Route 1: Viva's GET request for verification
app.get('/', (req, res) => {
  console.log('Received GET verification request.');
  res.status(200).json({ "Key": VIVA_VERIFICATION_KEY });
});

// Route 2: Viva's POST request with data (WITH BETTER LOGGING)
app.post('/', async (req, res) => {
  console.log('--- NEW POST REQUEST RECEIVED ---');

  // Log the headers to see what Content-Type Viva is sending
  console.log('Received Headers:', JSON.stringify(req.headers, null, 2));

  // Log the body that was parsed by express.json()
  console.log('Received Parsed Body:', JSON.stringify(req.body, null, 2));

  // Check if the body is actually empty
  if (!req.body || Object.keys(req.body).length === 0) {
    console.warn('WARNING: req.body is empty!');
    // Even if empty, we must respond to Viva
    return res.status(200).send('OK (but body was empty)');
  }

  console.log('Data looks good. Forwarding to Make.com...');
  try {
    // The forward request
    await axios.post(MAKE_WEBHOOK_URL, req.body);
    
    // The success response to Viva
    res.status(200).send('OK');
    console.log('Forwarding to Make.com was successful.');

  } catch (error) {
    console.error('Error forwarding to Make.com:', error.message);
    res.status(500).send('Error.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Relay server listening on port ${PORT}`);
});
