const axios = require('axios');

class LeadService {
  constructor() {
    this.baseURL = process.env.LEADCONNECTOR_API_URL;
    this.apiKey = process.env.LEADCONNECTOR_API_KEY;
  }

  async getContacts(params = {}) {
    try {
      const response = await axios.get(this.baseURL, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          limit: 50,
          ...params
        }
      });

      return {
        success: true,
        data: response.data,
        contacts: response.data.contacts || []
      };
    } catch (error) {
      console.error('LeadConnector API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch contacts',
        statusCode: error.response?.status
      };
    }
  }

  async createContact(contactData) {
    try {
      const response = await axios.post(this.baseURL, contactData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        contact: response.data.contact
      };
    } catch (error) {
      console.error('LeadConnector Create Contact Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create contact',
        statusCode: error.response?.status
      };
    }
  }

  async updateContact(contactId, updateData) {
    try {
      const response = await axios.put(`${this.baseURL}/${contactId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        contact: response.data.contact
      };
    } catch (error) {
      console.error('LeadConnector Update Contact Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update contact',
        statusCode: error.response?.status
      };
    }
  }

  async searchContacts(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          query,
          limit: 50
        }
      });

      return {
        success: true,
        data: response.data,
        contacts: response.data.contacts || []
      };
    } catch (error) {
      console.error('LeadConnector Search Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search contacts',
        statusCode: error.response?.status
      };
    }
  }

  // Transform LeadConnector contact to our loan format
  transformContactToLoan(contact) {
    return {
      borrowerName: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
      borrowerEmail: contact.email,
      borrowerPhone: contact.phone,
      propertyAddress: contact.address || '',
      loanType: this.determineLoanType(contact),
      currentStage: 'New Lead'
    };
  }

  // Determine loan type based on contact data
  determineLoanType(contact) {
    // This would be customized based on your LeadConnector setup
    const tags = contact.tags || [];
    
    if (tags.includes('FHA')) return 'FHA';
    if (tags.includes('VA')) return 'VA';
    if (tags.includes('USDA')) return 'USDA';
    if (tags.includes('Jumbo')) return 'JUMBO';
    
    return 'CONVENTIONAL'; // Default
  }
}

module.exports = new LeadService();