

import express from "express";
import 'dotenv/config';
import crypto from 'crypto';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'express-async-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';


import connectDB from './config/database.js';
import { globalLimiter, authLimiter, adminLimiter, apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import discountRoutes from './routes/discounts.js';
import reviewRoutes from './routes/reviews.js';
// Shiprocket tracking via cron job (jobs/shiprocketTrackingCron.js)
import './jobs/shiprocketTrackingCron.js';
import './cron.js';



const app = express();
let server;


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Configure Helmet security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for PayU integration
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


// Validate critical environment variables in production
if (process.env.NODE_ENV === 'production') {
  // Critical variables that MUST be set
  const criticalVars = ['MONGO_URI', 'PAYU_MERCHANT_KEY', 'PAYU_MERCHANT_SALT'];
  const missing = criticalVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`CRITICAL: Missing required environment variables in production: ${missing.join(', ')}`);
  }

  // Warn about URLs but don't fail (can be set after initial deployment)
  if (!process.env.FRONTEND_URL) {
    console.warn('WARNING: FRONTEND_URL not set. CORS and payment redirects may not work correctly.');
    console.warn('Set this to your frontend domain after deployment.');
  }
  if (!process.env.BACKEND_URL) {
    console.warn('WARNING: BACKEND_URL not set. PayU payment callbacks may not work correctly.');
    console.warn('Set this to your backend domain after deployment.');
  }
}

// CORS configuration
const FRONT = process.env.FRONTEND_URL || 'http://localhost:5173';

// Build the set of allowed origins robustly:
// In production we accept the exact FRONTEND_URL *and* its www/non-www counterpart.
// In development we also accept the common Vite ports.
const buildAllowedOrigins = () => {
  const origins = new Set();

  // Always allow localhost ports for local dev
  origins.add('http://localhost:5173');
  origins.add('http://localhost:5174');
  origins.add('http://localhost:3000');

  // Hardcoded production domain — fallback if FRONTEND_URL env var is not set
  origins.add('https://thevelvettails.com');
  origins.add('https://www.thevelvettails.com');

  if (FRONT) {
    origins.add(FRONT);
    // Also allow www <-> non-www sibling of whatever FRONTEND_URL is set to
    try {
      const u = new URL(FRONT);
      if (u.hostname.startsWith('www.')) {
        origins.add(`${u.protocol}//${u.hostname.slice(4)}${u.port ? ':' + u.port : ''}`);
      } else {
        origins.add(`${u.protocol}//www.${u.hostname}${u.port ? ':' + u.port : ''}`);
      }
    } catch (_) { /* ignore malformed URL */ }
  }

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no Origin header, e.g. curl, mobile apps)
    // and any explicitly allowed browser origin.
    // IMPORTANT: use callback(null, false) NOT callback(new Error(...)) for blocked
    // origins — throwing into the callback propagates to express-async-errors and
    // causes a 405 instead of a proper CORS rejection.
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);  // ← false, not new Error() — keeps Express happy
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Request-ID'],
  optionsSuccessStatus: 200  // IE11 / older browser compatibility
};

app.use(cors(corsOptions));
// Explicitly handle OPTIONS preflight for every route before any other middleware
app.options('*', cors(corsOptions));


app.use(express.static('public'));

// Add request ID tracking for better debugging
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Always enable trust proxy - needed for Render and other PaaS deployments
app.set('trust proxy', 1);



// Apply rate limiters
app.use(globalLimiter);  // Global rate limit for all routes

// Apply specific rate limiters to route groups
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/discounts', apiLimiter, discountRoutes); // Public discounts endpoint
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

app.get('/api/health', async (req, res) => {
  // Check which critical env vars are missing (report keys only, never values)
  const requiredVars = [
    'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET',
    'MONGO_URI', 'FRONTEND_URL', 'BACKEND_URL',
    'EMAIL_USER', 'EMAIL_PASS',
  ];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  const checks = {
    mongodb: mongoose.connection.readyState === 1,
    jwtSecrets: !!process.env.JWT_ACCESS_SECRET && !!process.env.JWT_REFRESH_SECRET,
    email: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS,
  };

  const allHealthy = Object.values(checks).every(v => v === true) && missingVars.length === 0;

  const health = {
    status: allHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || '⚠ NOT SET (defaults to development)',
    mongodb: checks.mongodb ? 'connected' : '❌ disconnected',
    jwtSecrets: checks.jwtSecrets ? 'set' : '❌ missing — server will crash on auth routes',
    email: checks.email ? 'configured' : '⚠ not configured — email verification will fail',
    ...(missingVars.length > 0 && { missingEnvVars: missingVars }),
  };

  res.status(allHealthy ? 200 : 503).json(health);
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  // Log error with request ID
  console.error(`[${req.id || 'unknown'}] Error:`, process.env.NODE_ENV === 'development' ? err : err.message);

  const status = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? (status < 500 ? err.message : 'Internal server error')
    : err.message;

  res.status(status).json({
    error: message,
    requestId: req.id
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });






// Process error handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

const gracefulShutdown = async (signal) => {
  console.log(`\n Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log('✓ HTTP server closed');
    });
  }

  try {
    await mongoose.connection.close(false);
    console.log('✓ MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

