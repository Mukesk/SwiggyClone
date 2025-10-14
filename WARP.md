# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

BiteMe is a full-stack food delivery application built with Node.js/Express backends and React frontends. It features a customer-facing application and a separate admin panel for food item management.

## Architecture

### Multi-Service Structure
- **`/backend`** - Customer API server (Node.js/Express, MongoDB)
- **`/admin`** - Admin API server (Node.js/Express, MongoDB)
- **`/frontend`** - Customer React application (Vite, React 19, TailwindCSS)
- **`/admin/frontend`** - Admin React application (Vite, React 19, TailwindCSS)

### Technology Stack
- **Backend**: Node.js, Express.js, MongoDB with Mongoose, JWT authentication, bcrypt, Stripe payments, Cloudinary (admin)
- **Frontend**: React 19, React Router v7, TanStack Query, Axios, TailwindCSS, DaisyUI, Styled Components
- **Development**: Vite, ESLint, Nodemon

### Data Models
- **User**: Authentication, profile info, shopping cart (embedded)
- **Item**: Food items with pricing, descriptions, ratings, hotel info, categories

### API Structure
- **Authentication**: `/api/auth` - login, signup, user profile endpoints
- **Items**: `/api/items` - food item CRUD operations  
- **Payments**: `/api/payment` - Stripe integration for payment processing

## Development Commands

### Backend Services
```bash
# Start customer API server (port 3000)
cd backend
npm run dev

# Start admin API server
cd admin  
npm run dev
```

### Frontend Applications
```bash
# Start customer frontend (port 5173)
cd frontend
npm run dev

# Start admin frontend
cd admin/frontend
npm run dev
```

### Build Commands
```bash
# Build customer frontend for production
cd frontend
npm run build

# Build admin frontend for production  
cd admin/frontend
npm run build
```

### Code Quality
```bash
# Lint frontend code
cd frontend
npm run lint

# Lint admin frontend code
cd admin/frontend  
npm run lint
```

## Key Development Patterns

### API Integration
- All services use TanStack Query for server state management
- Axios configured with credentials for cookie-based authentication
- Base URLs configured in `constant/baseUrl.js` files

### Authentication Flow
- JWT tokens stored in HTTP-only cookies
- Protected routes redirect unauthenticated users to `/login`
- User context managed through TanStack Query's `authUser` query

### CORS Configuration
- Both backends configured for `http://localhost:5173` (frontend dev server)
- Credentials enabled for cookie-based auth

### Database Connection
- MongoDB connection handled in `db/dbconnect.js` files
- Environment variables for connection strings (`.env` files)

## Environment Setup

Each service requires its own `.env` file:
- `backend/.env` - MongoDB connection, JWT secrets, Stripe keys
- `admin/.env` - MongoDB connection, JWT secrets, Cloudinary config  

## Payment Integration

The customer backend integrates Stripe for payment processing with success/failure redirect routes configured in the frontend routing.

## Security Features

### Authentication & Authorization
- JWT tokens stored in HTTP-only cookies for security
- Password hashing with bcrypt (salt rounds: 10)
- Rate limiting on authentication endpoints (5 requests per 15 minutes)
- Input validation with express-validator
- Protected routes with middleware authentication checks

### Security Headers
- Helmet.js for security headers
- CORS configuration with specific origins
- X-Frame-Options, X-Content-Type-Options, X-XSS-Protection headers
- HSTS in production environment

### Data Validation
- Comprehensive input validation for all API endpoints
- Password complexity requirements (min 8 chars, mixed case, numbers, symbols)
- Username and field length restrictions
- File upload size limitations

## Performance Optimizations

### Database
- MongoDB indexes on frequently queried fields (username, category, price, rating)
- Text search index for item search functionality
- Connection pooling and proper query optimization

### Frontend
- TanStack Query for efficient data fetching and caching (5-minute stale time)
- Lazy loading for better initial load performance
- Image optimization and compression
- Error boundaries for graceful error handling

### Backend
- Compression middleware for API responses
- Request size limits (10MB)
- Response caching headers

## Production Deployment

### Docker Setup
```bash
# Build and deploy with Docker Compose
./deploy.sh

# Or manually:
docker-compose --env-file .env.production up -d
```

### Environment Configuration
- Separate environment files for development and production
- Template files provided (.env.example)
- Secure secret management

### Services Architecture
- **Backend API**: Node.js/Express (Port 3000)
- **Admin API**: Node.js/Express (Port 8000) 
- **Customer Frontend**: React/Nginx (Port 80)
- **Admin Frontend**: React/Nginx (Port 8080)
- **Database**: MongoDB (Port 27017)
- **Cache**: Redis (Port 6379)
- **Reverse Proxy**: Nginx (Port 443)

### Health Monitoring
- Health check endpoints for all services
- Docker health checks with automatic restarts
- Comprehensive logging to mounted volumes

## Code Quality Improvements

### Error Handling
- Global error handlers in all services
- Comprehensive error boundaries in React
- Proper HTTP status codes and error messages
- Development vs production error detail levels

### Security Fixes Applied
- ❌ **FIXED**: Password exposure in API responses
- ❌ **FIXED**: Weak JWT secret (now requires 32+ characters)
- ❌ **FIXED**: Missing authentication on admin routes
- ❌ **FIXED**: Exposed environment variables (now gitignored)
- ❌ **FIXED**: Vulnerable dependencies (npm audit fix applied)

### Performance Improvements Applied
- ✅ Database indexing for optimal query performance
- ✅ Response compression and caching
- ✅ Frontend bundle optimization
- ✅ Lazy loading and code splitting
- ✅ Error boundaries and loading states

## Monitoring & Logging

### Application Monitoring
```bash
# View service logs
docker-compose logs -f backend
docker-compose logs -f admin
docker-compose logs -f frontend

# Check service health
curl http://localhost:3000/health
curl http://localhost:8000/health
```

### Database Monitoring
```bash
# Initialize database indexes
node backend/db/initializeDb.js

# Monitor MongoDB
docker-compose exec mongodb mongo --eval "db.stats()"
```
