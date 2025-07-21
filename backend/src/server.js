const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const taskRoutes = require('./routes/tasks');
const documentRoutes = require('./routes/documents');
const communicationRoutes = require('./routes/communications');
const notificationRoutes = require('./routes/notifications');
const appointmentRoutes = require('./routes/appointments');
const dashboardRoutes = require('./routes/dashboard');
const leadRoutes = require('./routes/leads');

const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Mortgage Dashboard API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      loans: '/api/loans',
      tasks: '/api/tasks',
      documents: '/api/documents',
      communications: '/api/communications',
      notifications: '/api/notifications',
      appointments: '/api/appointments',
      dashboard: '/api/dashboard',
      leads: '/api/leads'
    },
    docs: 'Visit /health for server status'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/loans', authMiddleware, loanRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/communications', authMiddleware, communicationRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/leads', authMiddleware, leadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      '/health',
      '/api',
      '/api/auth/*',
      '/api/users/*',
      '/api/loans/*',
      '/api/tasks/*',
      '/api/documents/*',
      '/api/communications/*',
      '/api/notifications/*',
      '/api/appointments/*',
      '/api/dashboard/*',
      '/api/leads/*'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;