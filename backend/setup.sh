#!/bin/bash

# Mortgage Dashboard Backend Setup Script

echo "🏠 Setting up Mortgage Dashboard Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    echo "   Required: DATABASE_URL, JWT_SECRET, LEADCONNECTOR_API_KEY"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env || grep -q "DATABASE_URL=\"\"" .env; then
    echo "❌ DATABASE_URL is not configured in .env file"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Create initial admin user (optional)
read -p "Create initial admin user? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Admin email: " admin_email
    read -s -p "Admin password: " admin_password
    echo
    
    # This would require a separate script to create the user
    echo "📝 Note: Please use the API to create the admin user:"
    echo "   POST /api/auth/register"
    echo "   Body: {\"email\":\"$admin_email\",\"password\":\"$admin_password\",\"name\":\"Admin User\",\"primaryRole\":\"ADMIN\"}"
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📊 To view the database:"
echo "   npm run prisma:studio"
echo ""
echo "🔍 API will be available at: http://localhost:3001"
echo "🏥 Health check: http://localhost:3001/health"