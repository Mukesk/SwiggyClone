# Production Environment Variables

## Backend Service Environment Variables

Set these in your `swiggyclone-backend-y2gx` service on Render:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secure_jwt_secret_key_here
FRONTEND_URL=https://swiggyclone-9rhm.onrender.com
MONGO_URI=your_mongodb_connection_string
```

## Frontend Service Environment Variables

Set these in your `swiggyclone-9rhm` service on Render:

```env
VITE_API_BASE_URL=https://swiggyclone-backend-y2gx.onrender.com
NODE_ENV=production
```

## Important Notes:

### Cookie Authentication Fix:
- Updated `sameSite` policy to `"none"` for cross-origin cookies
- Added fallback for JWT secret environment variable
- Fixed CORS to allow credentials properly

### Authentication Flow:
1. User logs in → Backend sets httpOnly cookie with JWT token
2. Frontend makes requests with `withCredentials: true`
3. Backend validates JWT from cookie
4. User stays authenticated across page refreshes

### CORS Configuration:
- Allows credentials (cookies)
- Supports multiple origins for flexibility
- Includes proper headers for authentication