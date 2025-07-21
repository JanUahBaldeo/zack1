const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// GET /api/documents - Get documents with filtering
router.get('/', [
  query('loanId').optional().isUUID(),
  query('status').optional().isIn(['REQUIRED', 'PENDING', 'RECEIVED', 'REVIEWED', 'APPROVED']),
  query('type').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      loanId,
      status,
      type,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (loanId) where.loanId = loanId;
    if (status) where.status = status;
    if (type) where.type = type;

    // Filter by user's loans if not admin
    if (req.user.primaryRole === 'LO') {
      where.loan = {
        loanOfficerId: req.user.id
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          loan: {
            select: {
              id: true,
              loanNumber: true,
              borrowerName: true,
              loanOfficer: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.document.count({ where })
    ]);

    res.json({
      documents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/documents - Create new document requirement
router.post('/', [
  body('name').trim().isLength({ min: 1 }),
  body('type').trim().isLength({ min: 1 }),
  body('loanId').isUUID(),
  body('dueDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, loanId, dueDate } = req.body;

    // Verify loan exists and user has access
    const loan = await prisma.loan.findUnique({
      where: { id: loanId }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (req.user.primaryRole === 'LO' && loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        loanId,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Document requirement created successfully',
      document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/documents/:id/upload - Upload document file
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const documentId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if document exists and user has access
    const existingDoc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        loan: true
      }
    });

    if (!existingDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (req.user.primaryRole === 'LO' && existingDoc.loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update document with file path
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        filePath: req.file.path,
        status: 'RECEIVED',
        uploadedAt: new Date()
      },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/documents/:id - Update document status
router.put('/:id', [
  body('status').optional().isIn(['REQUIRED', 'PENDING', 'RECEIVED', 'REVIEWED', 'APPROVED']),
  body('name').optional().trim().isLength({ min: 1 }),
  body('type').optional().trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const documentId = req.params.id;
    const updates = req.body;

    // Check if document exists and user has access
    const existingDoc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        loan: true
      }
    });

    if (!existingDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (req.user.primaryRole === 'LO' && existingDoc.loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: updates,
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;

    // Check if document exists and user has access
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        loan: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (req.user.primaryRole === 'LO' && document.loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file if exists
    if (document.filePath) {
      try {
        await fs.unlink(document.filePath);
      } catch (fileError) {
        console.warn('Could not delete file:', fileError);
      }
    }

    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/documents/:id/download - Download document file
router.get('/:id/download', async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        loan: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (req.user.primaryRole === 'LO' && document.loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!document.filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists
    try {
      await fs.access(document.filePath);
      res.download(document.filePath, document.name);
    } catch (error) {
      res.status(404).json({ error: 'File not found on server' });
    }
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;