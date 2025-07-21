const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/notifications - Get user notifications
router.get('/', [
  query('unread').optional().isBoolean(),
  query('type').optional().isIn(['INFO', 'WARNING', 'ERROR', 'SUCCESS']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      unread,
      type,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    if (unread === 'true') where.isRead = false;
    if (type) where.type = type;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: req.user.id, isRead: false }
      })
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/notifications - Create notification (admin only)
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('type').isIn(['INFO', 'WARNING', 'ERROR', 'SUCCESS']),
  body('userId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, type, userId } = req.body;

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId
      }
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/notifications/broadcast - Broadcast notification to multiple users
router.post('/broadcast', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('type').isIn(['INFO', 'WARNING', 'ERROR', 'SUCCESS']),
  body('userIds').optional().isArray(),
  body('roles').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, type, userIds, roles } = req.body;

    let targetUsers = [];

    if (userIds && userIds.length > 0) {
      // Send to specific users
      targetUsers = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          isActive: true
        },
        select: { id: true }
      });
    } else if (roles && roles.length > 0) {
      // Send to users with specific roles
      targetUsers = await prisma.user.findMany({
        where: {
          OR: [
            { primaryRole: { in: roles } },
            { permissions: { hasSome: roles } }
          ],
          isActive: true
        },
        select: { id: true }
      });
    } else {
      // Send to all active users
      targetUsers = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true }
      });
    }

    // Create notifications for all target users
    const notifications = await prisma.notification.createMany({
      data: targetUsers.map(user => ({
        title,
        message,
        type,
        userId: user.id
      }))
    });

    res.status(201).json({
      message: `Notification sent to ${targetUsers.length} users`,
      count: targetUsers.length
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    res.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({
      message: 'All notifications marked as read',
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/notifications/clear-read - Clear all read notifications
router.delete('/clear-read', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true
      }
    });

    res.json({
      message: 'Read notifications cleared',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Clear read notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/notifications/summary - Get notification summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      total,
      unread,
      byType,
      recent
    ] = await Promise.all([
      // Total notifications
      prisma.notification.count({
        where: { userId }
      }),

      // Unread count
      prisma.notification.count({
        where: { userId, isRead: false }
      }),

      // By type
      prisma.notification.groupBy({
        by: ['type'],
        where: { userId, isRead: false },
        _count: { id: true }
      }),

      // Recent unread notifications
      prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    res.json({
      summary: {
        total,
        unread
      },
      breakdown: {
        byType
      },
      recent
    });
  } catch (error) {
    console.error('Get notification summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;