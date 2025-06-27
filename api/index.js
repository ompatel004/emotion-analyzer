// backend/server.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- Middleware ---
// Enable CORS so your React app on localhost:3000 can talk to this server
app.use(cors()); 
// Enable Express to parse JSON in request bodies
app.use(express.json());

// --- The API Route ---
app.post('/api/analyze', async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res.status(400).json({ error: 'Sentence is required.' });
  }


  try {
    // Make the POST request to your deployed Python API
    const apiResponse = await axios.post(
      process.env.PYTHON_API_URL, 
      {
        sentence: sentence // The data payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Uncomment the line below if you secured your API with a key
          // 'X-API-Key': process.env.PYTHON_API_KEY 
        }
      }
    );

    // Send the response from the Python API back to the user
    res.json(apiResponse.data);

  } catch (error) {
    console.error('Error calling Python API:', error.message);
    res.status(500).json({ error: 'There was an error communicating with the analysis service.' });
  }
});

// ADD THIS LINE TO THE END of api/index.js
module.exports = app;