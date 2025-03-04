# RealPix Deployment Guide

This guide will walk you through deploying your RealPix Image Generator application to production. We'll cover deploying both the frontend and backend components.

## Deployment Options

### Option 1: Netlify for Frontend + Render for Backend (Recommended)

This approach is ideal for most users as it provides:
- Free tier options for both services
- Easy setup and configuration
- Automatic deployments from Git repositories
- Custom domain support

### Option 2: Vercel for Frontend + Railway for Backend

Another excellent option with similar benefits to Option 1.

### Option 3: Self-hosted VPS (Digital Ocean, AWS EC2, etc.)

For more control but requires more technical knowledge.

## Preparing Your Application for Deployment

Before deploying, let's make a few adjustments to ensure your application works correctly in production.

### 1. Environment Variables Configuration

Create a `.env.production` file for production-specific environment variables:

```
# Production environment variables
NODE_ENV=production
VITE_API_URL=https://your-backend-url.com/api
```

### 2. Update API URL Configuration

Let's modify the frontend to use environment variables for the API URL:

```javascript
// Create a new file: src/config.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default {
  API_URL
};
```

Then update your App.tsx to use this configuration.

## Frontend Deployment (Netlify)

1. **Build Configuration**:
   - Create a `netlify.toml` file in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy to Netlify**:
   - Sign up for a Netlify account
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Netlify dashboard
   - Deploy your site

## Backend Deployment (Render)

1. **Prepare Backend for Production**:
   - Create a `Procfile` in your project root:
   ```
   web: node server/index.js
   ```

2. **Deploy to Render**:
   - Sign up for a Render account
   - Create a new Web Service
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm install`
     - Start command: `node server/index.js`
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `PORT`: 10000 (Render uses this port by default)
     - `CLIENT_URL`: Your Netlify frontend URL
   - Deploy your service

## Securing Your Application

### 1. API Key Security

Never expose your OpenAI API key in the frontend code. Always keep it on the server side.

### 2. CORS Configuration

Update your CORS configuration in server/index.js to only allow requests from your production frontend domain:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-netlify-app.netlify.app',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### 3. Rate Limiting

Consider adding rate limiting to prevent abuse of your API:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to image generation endpoint
app.use('/api/generate-image', limiter);
```

## Custom Domain Setup

### 1. Netlify Custom Domain
1. Purchase a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In Netlify dashboard, go to Site settings > Domain management
3. Add your custom domain
4. Update DNS settings at your registrar to point to Netlify's nameservers

### 2. Render Custom Domain
1. In Render dashboard, go to your service settings
2. Add a custom domain
3. Configure DNS settings as instructed by Render

## Monitoring and Analytics

Consider adding:
1. Google Analytics for user behavior tracking
2. Sentry.io for error monitoring
3. Uptime monitoring with UptimeRobot or similar service

## Continuous Deployment

Both Netlify and Render support automatic deployments when you push to your Git repository. Configure branch deployments for staging/production environments.

## Cost Optimization

- Netlify: Free tier includes 100GB bandwidth/month
- Render: Free tier has limitations but works for small projects
- OpenAI API: Pay-as-you-go pricing, consider implementing usage limits

## Scaling Considerations

As your application grows:
1. Implement caching for generated images
2. Consider using a CDN for image delivery
3. Implement database storage for user accounts and saved images
4. Add authentication to allow users to save their generated images