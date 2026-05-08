import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { JWT_SECRET, CLIENT_URL } from './config/env.js';
import { errorHandler } from './middleware/global-error-handler.js';

//!CONTROLLERS
import { createAuthController } from './controllers/authController.js';
import { createTransactionController } from './controllers/transactionController.js';
import { createDashboardController } from './controllers/dashboardController.js';
import { createInsightController } from './controllers/insightController.js';

//!ROUTES
import { createAuthRoutes } from './routes/auth-routes.js';
import { createTransactionRoutes } from './routes/transaction-routes.js';
import { createDashboardRoutes } from './routes/dashboard-routes.js';
import { createInsightRoutes } from './routes/insight-routes.js';

//!SERVICES
import { createAuthService } from './services/authService.js';
import { createTransactionService } from './services/transactionService.js';
import { createDashboardService } from './services/dashboardService.js';
import { createInsightService } from './services/insightService.js';

//!MODELS
import { TransactionModel } from './models/Transaction.js';
import { UserModel } from './models/User.js';
import { InsightModel } from './models/Insight.js';



export function createApp() {
  const authService = createAuthService({ userModel: UserModel, jwtSecret: JWT_SECRET });
  const transactionService = createTransactionService({ transactionModel: TransactionModel });
  const dashboardService = createDashboardService({ transactionModel: TransactionModel });
  const insightService = createInsightService({ transactionModel: TransactionModel, insightModel: InsightModel} );

  const authController = createAuthController({ authService });
  const transactionController = createTransactionController({ transactionService });
  const dashboardController = createDashboardController({ dashboardService });
  const insightController = createInsightController({ insightService });
  const app = express();

  app.use(cors({origin: true, credentials: true}));
  app.use(express.json());
  app.use(morgan('dev'));

  // API ROUTES
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/transactions', createTransactionRoutes(transactionController));
  app.use('/api/dashboard', createDashboardRoutes(dashboardController));
  app.use('/api/insights', createInsightRoutes(insightController));

  // GLOBAL ERROR HANDLER
  app.use(errorHandler);

  return app;
}
