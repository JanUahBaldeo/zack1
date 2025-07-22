const axios = require('axios');

async function testDirectLeadConnectorAPI() {
  const contactId = 'd8rv2Jecwbis0GSlZdVc';
  const token = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
  
  try {
    console.log('Testing direct API call to LeadConnector...');
    
    // Test direct call to LeadConnector API
    const directResponse = await axios.get(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Version': '2021-07-28', // Adding the Version header that was missing
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Direct API call successful!');
    console.log(JSON.stringify(directResponse.data, null, 2));
    
    // Test our new endpoint (assuming server is running)
    console.log('\nTesting our new endpoint...');
    const ourEndpointResponse = await axios.get(`http://localhost:3003/api/leads-direct/direct/${contactId}`);
    
    console.log('Our endpoint call successful!');
    console.log(JSON.stringify(ourEndpointResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testDirectLeadConnectorAPI();