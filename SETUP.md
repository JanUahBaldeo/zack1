# Mortgage Dashboard Setup Guide

Quick setup guide to get your mortgage dashboard running in VS Code.

## Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm run setup
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mortgage_dashboard"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

4. **Database Setup**
   ```bash
   npm run prisma:migrate
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3001`

## Quick Test

1. **Health Check**
   Visit: `http://localhost:3001/health`

2. **Register User**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User",
       "primaryRole": "LO"
     }'
   ```

## VS Code Setup

1. **Install Recommended Extensions**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prisma (for backend)

2. **File Structure**
   ```
   /                          # Frontend (React)
   ├── components/           # React components
   ├── styles/              # CSS styles
   └── App.jsx              # Main app file
   
   /backend/                # Backend (Node.js)
   ├── src/                # Source code
   ├── prisma/             # Database schema
   └── package.json        # Dependencies
   ```

## Troubleshooting

### Common Issues

1. **Module Not Found Errors**
   - Make sure you're in the correct directory
   - Run `npm install` in both root and backend directories

2. **Database Connection Issues**
   - Check your DATABASE_URL in .env
   - Make sure PostgreSQL is running

3. **Port Already in Use**
   - Frontend: Change port in package.json dev script
   - Backend: Change PORT in .env file

### Reset Everything

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:reset
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production

### Backend
- `npm run dev` - Start with auto-reload
- `npm start` - Start production server
- `npm run prisma:studio` - Open database browser

## API Documentation

Once running, the API provides these endpoints:
- `/api/auth/*` - Authentication
- `/api/loans/*` - Loan management
- `/api/tasks/*` - Task management
- `/api/dashboard/*` - Dashboard data
- `/api/leads/*` - Lead management

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Make sure both frontend and backend are running
4. Check the network tab in browser dev tools