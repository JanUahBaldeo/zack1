const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const leadService = require('../services/leadService');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/leads/external - Get leads from LeadConnector
router.get('/external', [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('query').optional().trim()
], requireRole(['LO', 'PRODUCTION_PARTNER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit = 50, offset = 0, query } = req.query;

    let result;
    if (query) {
      result = await leadService.searchContacts(query);
    } else {
      result = await leadService.getContacts({ limit, offset });
    }

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error
      });
    }

    res.json({
      contacts: result.contacts,
      total: result.data.total || result.contacts.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get external leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads/import/:contactId - Import lead from LeadConnector to create loan
router.post('/import/:contactId', [
  body('loanAmount').isDecimal({ decimal_digits: '0,2' }),
  body('targetCloseDate').isISO8601(),
  body('loanType').optional().isIn(['CONVENTIONAL', 'FHA', 'VA', 'USDA', 'JUMBO'])
], requireRole(['LO', 'LOA', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contactId } = req.params;
    const { loanAmount, targetCloseDate, loanType } = req.body;

    // First, get the contact from LeadConnector
    const contactResult = await leadService.getContacts({ id: contactId });
    
    if (!contactResult.success || !contactResult.contacts.length) {
      return res.status(404).json({ error: 'Contact not found in LeadConnector' });
    }

    const contact = contactResult.contacts[0];
    
    // Transform contact data to loan data
    const loanData = leadService.transformContactToLoan(contact);
    
    // Generate loan number
    const timestamp = Date.now().toString().slice(-6);
    const loanNumber = `LN-${new Date().getFullYear()}-${timestamp}`;

    // Create loan in database
    const loan = await prisma.$transaction(async (tx) => {
      const newLoan = await tx.loan.create({
        data: {
          loanNumber,
          ...loanData,
          loanAmount: parseFloat(loanAmount),
          targetCloseDate: new Date(targetCloseDate),
          loanType: loanType || loanData.loanType,
          loanOfficerId: req.user.id
        },
        include: {
          loanOfficer: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      // Create initial stage history
      await tx.stageHistory.create({
        data: {
          loanId: newLoan.id,
          stage: 'New Lead'
        }
      });

      // Create initial task
      await tx.task.create({
        data: {
          title: `Follow up with ${loanData.borrowerName}`,
          description: `Initial contact imported from LeadConnector`,
          category: 'Client Communication Touchpoints',
          type: 'Call',
          priority: 'HIGH',
          loanId: newLoan.id,
          userId: req.user.id,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due tomorrow
        }
      });

      return newLoan;
    });

    res.status(201).json({
      message: 'Lead imported successfully',
      loan,
      sourceContact: {
        id: contactId,
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        email: contact.email
      }
    });
  } catch (error) {
    console.error('Import lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads/sync - Sync contact data with LeadConnector
router.post('/sync/:loanId', requireRole(['LO', 'LOA', 'ADMIN']), async (req, res) => {
  try {
    const { loanId } = req.params;

    // Get loan details
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        loanOfficer: {
          select: { name: true, email: true }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check permissions
    if (req.user.primaryRole === 'LO' && loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Search for existing contact in LeadConnector
    const searchResult = await leadService.searchContacts(loan.borrowerEmail);
    
    const contactData = {
      firstName: loan.borrowerName.split(' ')[0] || '',
      lastName: loan.borrowerName.split(' ').slice(1).join(' ') || '',
      email: loan.borrowerEmail,
      phone: loan.borrowerPhone,
      address: loan.propertyAddress,
      tags: [loan.loanType, loan.currentStage],
      customFields: {
        loanNumber: loan.loanNumber,
        loanAmount: loan.loanAmount.toString(),
        targetCloseDate: loan.targetCloseDate.toISOString(),
        loanOfficer: loan.loanOfficer.name
      }
    };

    let result;
    if (searchResult.success && searchResult.contacts.length > 0) {
      // Update existing contact
      const existingContact = searchResult.contacts[0];
      result = await leadService.updateContact(existingContact.id, contactData);
    } else {
      // Create new contact
      result = await leadService.createContact(contactData);
    }

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error
      });
    }

    res.json({
      message: 'Contact synced successfully',
      contact: result.contact,
      action: searchResult.success && searchResult.contacts.length > 0 ? 'updated' : 'created'
    });
  } catch (error) {
    console.error('Sync contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leads/sources - Get lead source analytics
router.get('/sources', requireRole(['PRODUCTION_PARTNER', 'ADMIN']), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let daysBack = 30;
    switch (period) {
      case '7d': daysBack = 7; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
    }

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    // Get lead sources from database
    const leadSources = await prisma.leadSource.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        totalLeads: 'desc'
      }
    });

    // Get recent leads by source (this would need to be tracked when creating loans)
    const recentLeads = await prisma.loan.groupBy({
      by: ['currentStage'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    });

    // Calculate performance metrics
    const totalLeads = leadSources.reduce((sum, source) => sum + source.totalLeads, 0);
    const totalConverted = leadSources.reduce((sum, source) => sum + source.convertedLeads, 0);
    const averageConversion = totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0;

    res.json({
      period,
      summary: {
        totalLeads,
        totalConverted,
        averageConversion: parseFloat(averageConversion.toFixed(2))
      },
      sources: leadSources,
      recentActivity: recentLeads
    });
  } catch (error) {
    console.error('Get lead sources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads/sources - Create or update lead source
router.post('/sources', [
  body('name').trim().isLength({ min: 1 }),
  body('totalLeads').optional().isInt({ min: 0 }),
  body('convertedLeads').optional().isInt({ min: 0 })
], requireRole(['ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, totalLeads = 0, convertedLeads = 0 } = req.body;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const leadSource = await prisma.leadSource.upsert({
      where: { name },
      update: {
        totalLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate.toFixed(2))
      },
      create: {
        name,
        totalLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate.toFixed(2))
      }
    });

    res.json({
      message: 'Lead source updated successfully',
      leadSource
    });
  } catch (error) {
    console.error('Create/update lead source error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;