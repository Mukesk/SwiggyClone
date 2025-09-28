# BiteMe App - Render Deployment Guide

Your BiteMe food delivery app is ready for deployment on Render! Follow this guide to deploy both your backend API and frontend application.

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account if not connected
   - Choose the repository: `Mukesk/SwiggyClone`

3. **Configure Backend Service**
   - **Name**: `biteme-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Set Environment Variables**
   In the Environment section, add these variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://biteme-frontend.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete (5-10 minutes)
   - Note the backend URL (e.g., `https://biteme-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Create Another Web Service**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository: `Mukesk/SwiggyClone`

2. **Configure Frontend Service**
   - **Name**: `biteme-frontend`
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
   (Replace with the actual backend URL from Step 1)

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build completion

## 🔧 Important Configuration Notes

### Backend Configuration
- **Database**: You'll need a MongoDB connection string (consider MongoDB Atlas free tier)
- **JWT Secret**: Generate a secure random string for token signing
- **CORS**: Already configured to work with the frontend URL
- **Rate Limiting**: Production-ready rate limiting is already implemented

### Frontend Configuration
- **API URL**: Automatically uses `VITE_API_BASE_URL` environment variable
- **Build**: Uses Vite build system optimized for production
- **Static Files**: Deployed to Render's CDN for fast loading

## 🌐 Environment Variables You Need

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biteme
JWT_SECRET=your_very_secure_random_string_here
FRONTEND_URL=https://your-frontend-url.onrender.com
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key  # If using Stripe
```

### Frontend
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## 🔍 Testing Your Deployment

1. **Backend Health Check**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Frontend**
   - Visit your frontend URL
   - Test user registration/login
   - Test adding items to cart
   - Verify all API calls work

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs for specific errors
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Calls Fail**
   - Check CORS configuration
   - Verify environment variables are set correctly
   - Check backend logs for errors

3. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure database credentials are valid

### Free Tier Limitations:
- Services may sleep after 15 minutes of inactivity
- Limited to 750 hours per month per service
- Build times may be slower

## 🎉 After Deployment

Your BiteMe app will be live at:
- **Frontend**: `https://biteme-frontend.onrender.com`
- **Backend API**: `https://biteme-backend.onrender.com`

### Next Steps:
1. Set up a custom domain (optional)
2. Configure monitoring and alerts
3. Set up automated deployments on code push
4. Consider upgrading to paid plans for production use

## 📱 Features Deployed

Your deployed app includes:
- ✅ User authentication (login/signup)
- ✅ Product catalog with images
- ✅ Shopping cart functionality
- ✅ Responsive mobile-first design
- ✅ Toast notifications
- ✅ Secure API endpoints
- ✅ Rate limiting and security headers
- ✅ Production-optimized build

Enjoy your deployed BiteMe food delivery app! 🍔🚀