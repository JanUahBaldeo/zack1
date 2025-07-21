# Troubleshooting Guide

## Backend Issues

### "Route not found" when accessing /api

**Problem**: The API endpoints return "Route not found" error.

**Solutions**:

1. **Check if server is running properly**:
   ```bash
   cd backend
   npm start
   ```
   Look for: "🚀 Server running on port 3001"

2. **Test basic endpoints**:
   - Health check: http://localhost:3001/health
   - API info: http://localhost:3001/api
   - Auth test: http://localhost:3001/api/auth/test

3. **Run API test script**:
   ```bash
   cd backend
   npm run test-api
   ```

4. **Check environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your settings
   ```

### Database Connection Issues

**Problem**: Database errors when trying to use API endpoints.

**Solutions**:

1. **Set up database URL in .env**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mortgage_dashboard"
   ```

2. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

3. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

### Missing Dependencies

**Problem**: Module not found errors.

**Solutions**:

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Frontend Issues

### TypeScript vs JSX Errors

**Problem**: TypeScript errors in JSX files.

**Solutions**:

1. **Make sure you're using App.jsx**:
   - Main file should be App.jsx (not App.tsx)
   - Check imports use .jsx extensions where needed

2. **Clear build cache**:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

### Component Import Errors

**Problem**: Cannot find component modules.

**Solutions**:

1. **Check file structure**:
   ```
   components/
   ├── Header.jsx
   ├── dashboards/
   │   ├── LODashboard.jsx
   │   ├── LOADashboard.jsx
   │   └── ProductionPartnerDashboard.jsx
   ```

2. **Use explicit imports**:
   ```javascript
   import { Header } from './components/Header.jsx'
   ```

## Common Solutions

### Complete Reset

If everything is broken:

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts

**Problem**: Port already in use.

**Solutions**:

1. **Kill existing processes**:
   ```bash
   # Find process using port 3001
   lsof -ti:3001
   # Kill the process
   kill -9 <PID>
   ```

2. **Use different ports**:
   - Frontend: Change in package.json dev script
   - Backend: Change PORT in .env

### VS Code Setup

**Recommended Extensions**:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma (for backend)

**Settings**:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "javascript.preferences.includePackageJsonAutoImports": "off"
}
```

## Testing Everything Works

### Quick Test Commands

```bash
# 1. Test backend
cd backend
npm run test-api

# 2. Test frontend
npm run dev

# 3. Test database (if configured)
cd backend
npm run prisma:studio
```

### Manual API Tests

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/api

# Auth test
curl http://localhost:3001/api/auth/test
```

## Getting Help

1. **Check console logs** for specific error messages
2. **Verify all environment variables** are set correctly
3. **Make sure both frontend and backend are running**
4. **Check the network tab** in browser dev tools for failed requests
5. **Look at the terminal output** for both processes

## Success Indicators

✅ Backend running on port 3001
✅ Frontend running on port 3000
✅ Health check returns "OK"
✅ API info returns endpoint list
✅ Dashboard loads without errors
✅ Navigation between dashboards works