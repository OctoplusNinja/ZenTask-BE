// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
// import cookieParser from 'cookie-parser';
// import { tenantResolver } from './middleware/tenantResolver.js';
// import { authMiddleware } from './middleware/auth.js';
// import { errorHandler } from './middleware/errorHandler.js';
// import { prisma } from './config/db.js';

// Import Routes
// import tenantRoutes from './modules/tenants/tenants.routes.js';
// import projectRoutes from './modules/projects/projects.routes.js';
// import taskRoutes from './modules/tasks/tasks.routes.js';
// import userRoutes from './modules/users/users.routes.js';

// Initialize Express App
const app = express();

// 🔧 Basic Middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// 🌍 Tenant Resolver
// Extracts subdomain (e.g., acme.tasky.com → acme) and loads tenant info
// app.use(tenantResolver);

// 🔐 Authentication (JWT)
// app.use(authMiddleware);

// 🧩 API Routes
// app.use('/api/tenants', tenantRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);

// 🏥 Health Check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', tenant: req.tenant?.slug || 'public' });
// });

// ❌ 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ⚠️ Global Error Handler
// app.use(errorHandler);

// 💾 Graceful Shutdown Handling
// process.on('SIGTERM', async () => {
//   console.log('SIGTERM received: closing DB connection');
//   await prisma.$disconnect();
//   process.exit(0);
// });

export default app;
