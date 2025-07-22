const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const LEADCONNECTOR_URL = 'https://services.leadconnectorhq.com/contacts/d8rv2Jecwbis0GSlZdVc';
const LEADCONNECTOR_TOKEN = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running.' });
});

// Proxy to LeadConnector API
app.get('/contacts/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const response = await axios.get(`${LEADCONNECTOR_URL.replace(/\/contacts\/[^/]+$/, '')}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${LEADCONNECTOR_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 