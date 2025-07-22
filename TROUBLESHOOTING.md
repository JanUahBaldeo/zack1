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

---

# 🚀 Deploy Backend to Render

### 1. **Push Your Code to GitHub**
- If you haven’t already, create a GitHub repository and push your project (especially the `backend/` folder).

### 2. **Create a Render Account**
- Go to [https://render.com/](https://render.com/) and sign up (free tier is fine).

### 3. **Create a New Web Service**
- Click **“New +”** → **“Web Service”**.
- Connect your GitHub account and select your repo.

### 4. **Configure the Service**
- **Root Directory:** Set to `backend` (if your backend is in a subfolder).
- **Build Command:** (leave blank for Node.js)
- **Start Command:**  
  ```
  node app.js
  ```
- **Environment:** Node

### 5. **Set Environment Variables**
- In the Render dashboard, go to your service’s **Environment** tab.
- Add:
  - `MONGODB_URI` (your Atlas connection string)
  - `JWT_SECRET` (choose a strong secret)
- Example:
  ```
  MONGODB_URI=mongodb+srv://zack:12345@cluster1.bpq7n1a.mongodb.net/dashboard_system?retryWrites=true&w=majority&appName=Cluster1
  JWT_SECRET=your_jwt_secret_here
  ```

### 6. **Deploy**
- Click **“Create Web Service”**.
- Wait for the build and deploy to finish.
- You’ll get a public URL like `https://your-app.onrender.com`.

---

# 🚀 Deploy Frontend to Vercel

### 1. **Push Your Frontend to GitHub**
- If your frontend is in a subfolder (e.g., `/frontend`), push that folder to GitHub, or push the whole project.

### 2. **Create a Vercel Account**
- Go to [https://vercel.com/](https://vercel.com/) and sign up.

### 3. **Import Your Project**
- Click **“Add New Project”** and import your GitHub repo.
- If your frontend is in a subfolder, set the **Root Directory** to that folder.

### 4. **Set Environment Variables**
- In the Vercel dashboard, go to **Settings > Environment Variables**.
- Add:
  - `REACT_APP_API_URL` (set this to your Render backend URL, e.g., `https://your-app.onrender.com`)

### 5. **Deploy**
- Click **“Deploy”**.
- Vercel will build and deploy your frontend.
- You’ll get a public URL like `https://your-frontend.vercel.app`.

---

# 📝 **How to Test**

1. **Open your Vercel frontend URL** in your browser.
2. **Login/Register** (if you have a registration endpoint, or add a user directly in MongoDB Atlas).
3. **Your frontend will make API calls to your Render backend** using the public URL.
4. **Check both dashboards** (Render and Vercel) for logs and errors if something doesn’t work.

---

# ⚠️ **Tips & Troubleshooting**

- **CORS:** Your backend should have CORS enabled (already set up in your code).
- **API URL:** Make sure your frontend uses the Render backend URL, not `localhost`.
- **MongoDB Atlas:** Your Render backend must be able to connect to Atlas (Atlas IP whitelist: 0.0.0.0/0 for public, or Render’s IPs).
- **JWT:** Always send the JWT token in the `Authorization` header for protected routes.

---

## Need help with any step?  
Let me know if you want:
- Example `.env` files for Render/Vercel
- Help with GitHub setup
- Troubleshooting deployment errors

Just tell me where you get stuck or what you want to see next!