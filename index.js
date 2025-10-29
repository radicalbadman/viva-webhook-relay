const express = require('express');
const axios = require('axios');
const app = express();

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

// NEW: Accept the body as raw text to prevent crashing.
// We accept any content type by using '*/*'.
app.use(express.text({ type: '*/*' }));

const PORT = process.env.PORT || 10000;

// Route 1: Viva's GET request for verification (Stays the same)
app.get('/', (req, res) => {
  console.log('Received GET verification request.');
  res.status(200).json({ "Key": VIVA_VERIFICATION_KEY });
});

// Route 2: Viva's POST request with data (NEW ROBUST VERSION)
app.post('/', async (req, res) => {
  console.log('--- NEW POST REQUEST RECEIVED ---');
  
  // Log the headers to see what Content-Type we actually got
  console.log('Received Headers:', JSON.stringify(req.headers, null, 2));

  // 'req.body' is now just a string of plain text
  console.log('Received Raw Body Text:', req.body);

  let dataToForward;

  // Try to parse the raw text body as JSON
  try {
    dataToForward = JSON.parse(req.body);
  } catch (parseError) {
    console.error('ERROR: Could not parse incoming body as JSON.', parseError.message);
    // If it's not JSON, maybe it's form data? We'll just send the text.
    // But for Viva, it should be JSON. This is a bad sign.
    console.warn('Forwarding the raw text body to Make.com as a fallback.');
    dataToForward = { raw_text: req.body }; // Send as an object
  }

  // Check if we have something to forward
  if (!dataToForward) {
    console.warn('WARNING: Data to forward is empty after parsing.');
    return res.status(200).send('OK (but data was empty)');
  }

  console.log('Data parsed successfully. Forwarding to Make.com...');
  
  try {
    // Forward the parsed JSON object to Make.com
    await axios.post(MAKE_WEBHOOK_URL, dataToForward);
    
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
