const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Check if .env file exists
const envFile = path.join(__dirname, '.env');
if (!fs.existsSync(envFile)) {
  console.log('⚠️  .env file not found. Please copy .env.example to .env and configure your environment variables.');
  process.exit(1);
}

// Start the server
console.log('🚀 Starting Mortgage Dashboard Backend...');
require('./src/server');