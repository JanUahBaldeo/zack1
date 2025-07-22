const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB error:', err));

// Models
const User = require('./models/User');
const Loan = require('./models/Loan');
const Task = require('./models/Task');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const authenticate = require('./middleware/auth');
const loanRoutes = require('./routes/loans');
const taskRoutes = require('./routes/tasks');
const documentsRoutes = require('./routes/documents');
const notificationsRoutes = require('./routes/notifications');
const campaignsRoutes = require('./routes/campaigns');
const communicationsRoutes = require('./routes/communications');
const calendarRoutes = require('./routes/calendar');
const marketingRoutes = require('./routes/marketing');
const productionRoutes = require('./routes/production');

app.use('/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/loans', authenticate, loanRoutes);
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/communications', communicationsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/production', productionRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 