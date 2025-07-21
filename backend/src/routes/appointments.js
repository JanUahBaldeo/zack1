const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/appointments - Get appointments with filtering
router.get('/', [
  query('date').optional().isISO8601(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('category').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      date,
      startDate,
      endDate,
      category,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    // Date filtering
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      where.startTime = {
        gte: startOfDay,
        lt: endOfDay
      };
    } else if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (category) where.category = category;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { startTime: 'asc' },
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.appointment.count({ where })
    ]);

    res.json({
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/today - Get today's appointments
router.get('/today', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      orderBy: { startTime: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/upcoming', [
  query('days').optional().isInt({ min: 1, max: 30 }),
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const { days = 7, limit = 10 } = req.query;
    const userId = req.user.id;
    
    const now = new Date();
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        startTime: {
          gte: now,
          lte: futureDate
        }
      },
      orderBy: { startTime: 'asc' },
      take: parseInt(limit)
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/appointments - Create new appointment
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('category').trim().isLength({ min: 1 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      startTime,
      endTime,
      category,
      color = '#3b82f6'
    } = req.body;

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Check for conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        userId: req.user.id,
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } }
            ]
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } }
            ]
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(409).json({ 
        error: 'Time slot conflicts with existing appointment',
        conflictingAppointment: {
          id: conflictingAppointment.id,
          title: conflictingAppointment.title,
          startTime: conflictingAppointment.startTime,
          endTime: conflictingAppointment.endTime
        }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        category,
        color,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('category').optional().trim().isLength({ min: 1 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.params.id;
    const updates = req.body;

    // Check if appointment exists and user owns it
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (existingAppointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate time range if both times are provided
    if (updates.startTime && updates.endTime) {
      const start = new Date(updates.startTime);
      const end = new Date(updates.endTime);

      if (start >= end) {
        return res.status(400).json({ error: 'End time must be after start time' });
      }

      // Check for conflicts (excluding current appointment)
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          userId: req.user.id,
          id: { not: appointmentId },
          OR: [
            {
              AND: [
                { startTime: { lte: start } },
                { endTime: { gt: start } }
              ]
            },
            {
              AND: [
                { startTime: { lt: end } },
                { endTime: { gte: end } }
              ]
            },
            {
              AND: [
                { startTime: { gte: start } },
                { endTime: { lte: end } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        return res.status(409).json({ 
          error: 'Time slot conflicts with existing appointment',
          conflictingAppointment: {
            id: conflictingAppointment.id,
            title: conflictingAppointment.title,
            startTime: conflictingAppointment.startTime,
            endTime: conflictingAppointment.endTime
          }
        });
      }
    }

    // Convert date strings to Date objects
    const updateData = { ...updates };
    if (updateData.startTime) updateData.startTime = new Date(updateData.startTime);
    if (updateData.endTime) updateData.endTime = new Date(updateData.endTime);

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData
    });

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Check if appointment exists and user owns it
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.appointment.delete({
      where: { id: appointmentId }
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/calendar/:year/:month - Get calendar view
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Group appointments by date
    const appointmentsByDate = {};
    appointments.forEach(appointment => {
      const dateKey = appointment.startTime.toISOString().split('T')[0];
      if (!appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey] = [];
      }
      appointmentsByDate[dateKey].push(appointment);
    });

    res.json({
      year: parseInt(year),
      month: parseInt(month),
      appointments: appointmentsByDate,
      total: appointments.length
    });
  } catch (error) {
    console.error('Get calendar appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/categories - Get appointment categories
router.get('/categories', async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await prisma.appointment.groupBy({
      by: ['category'],
      where: { userId },
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get appointment categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;