const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Route to directly fetch a contact from LeadConnector by ID
 * This route bypasses the normal authentication and uses a direct API token
 */
router.get('/direct/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    
    // Use the provided token directly instead of from environment variables
    const token = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
    
    const response = await axios.get(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Version': '2021-07-28', // Adding the Version header that was missing
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Direct LeadConnector API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to fetch contact',
      message: error.message
    });
  }
});

module.exports = router;