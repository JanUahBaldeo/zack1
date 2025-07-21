# Mortgage Dashboard Backend

A comprehensive Node.js/Express backend API for the mortgage dashboard system with role-based access control, pipeline management, task tracking, and LeadConnector integration.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **Pipeline Management**: Complete loan lifecycle tracking
- **Task Management**: Categorized task system with priorities and due dates
- **Document Management**: File upload and document tracking
- **Communication Log**: Track all client interactions
- **Notifications**: Real-time notification system
- **Calendar/Appointments**: Scheduling system
- **Lead Integration**: LeadConnector API integration
- **Dashboard Analytics**: Performance metrics and reporting

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mortgage_dashboard"
JWT_SECRET="your-super-secret-jwt-key-here"
LEADCONNECTOR_API_KEY="your-leadconnector-api-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token

### Loans
- `GET /api/loans` - Get loans with filtering
- `POST /api/loans` - Create new loan
- `GET /api/loans/:id` - Get specific loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan
- `GET /api/loans/pipeline/stages` - Get pipeline stages

### Tasks
- `GET /api/tasks` - Get tasks with filtering
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/summary` - Get task summary
- `PUT /api/tasks/:id/complete` - Mark task complete

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/performance` - Get performance metrics
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/notifications` - Get notifications

### Leads (LeadConnector Integration)
- `GET /api/leads/external` - Get leads from LeadConnector
- `POST /api/leads/import/:contactId` - Import lead to create loan
- `POST /api/leads/sync/:loanId` - Sync loan data with LeadConnector
- `GET /api/leads/sources` - Get lead source analytics

## Database Schema

The system uses PostgreSQL with the following main entities:

- **Users**: Authentication and role management
- **Loans**: Core loan tracking with stages and status
- **Tasks**: Task management with categories and priorities  
- **Documents**: Document upload and tracking
- **Communications**: Client interaction logging
- **Notifications**: System notifications
- **Appointments**: Calendar and scheduling
- **StageHistory**: Pipeline stage tracking
- **LeadSources**: Lead source analytics

## Role-Based Access

- **LO (Loan Officer)**: Access to own loans and tasks
- **LOA (Loan Officer Assistant)**: Access to processing workflow
- **PRODUCTION_PARTNER**: Access to lead management and analytics
- **ADMIN**: Full system access

## LeadConnector Integration

The system integrates with LeadConnector API to:
- Import contacts as new leads
- Sync loan data back to contacts
- Track lead sources and conversion rates
- Search and filter external contacts

## Security Features

- JWT authentication with configurable expiration
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## Development

### Database Commands

```bash
# Reset database (careful!)
npm run prisma:reset

# Generate new migration
npx prisma migrate dev --name migration_name

# View database
npm run prisma:studio
```

### Testing

```bash
# Test API endpoints
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","primaryRole":"LO"}'
```

## Deployment

### Production Setup

1. Set `NODE_ENV=production` in environment
2. Use a secure JWT secret (32+ characters)
3. Configure proper database URL
4. Set up SSL certificates
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `LEADCONNECTOR_API_KEY` | LeadConnector API key | Required for lead features |

## API Documentation

For detailed API documentation with request/response examples, visit:
`http://localhost:3001/api-docs` (when running with Swagger)

## Support

For issues and questions:
1. Check the logs: `pm2 logs` (if using PM2)
2. Verify environment variables
3. Check database connectivity
4. Review API endpoint documentation

## License

Private - Mortgage Dashboard System
```

<figma type="work">
I'll create the final setup script for easy installation.