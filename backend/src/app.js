import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler.js';
import { createAuthController } from './controllers/authController.js';
import { createTransactionController } from './controllers/transactionController.js';
import { createDashboardController } from './controllers/dashboardController.js';
import { createInsightController } from './controllers/insightController.js';
import { createWebhookController } from './controllers/webhookController.js';
import { createAuthRoutes } from './routes/auth-routes.js';
import { createTransactionRoutes } from './routes/transaction-routes.js';
import { createDashboardRoutes } from './routes/dashboard-routes.js';
import { createInsightRoutes } from './routes/insight-routes.js';
import { createWebhookRoutes } from './routes/webhook-routes.js';
import { createAuthService } from './services/authService.js';
import { createTransactionService } from './services/transactionService.js';
import { createDashboardService } from './services/dashboardService.js';
import { createInsightService } from './services/insightService.js';
import { createTelegramService } from './services/telegramService.js';
import { createDiscordService } from './services/discordService.js';
import { createWebhookService } from './services/webhookService.js';
import { TransactionModel } from './models/Transaction.js';
import { UserModel } from './models/User.js';
import { InsightModel } from './models/Insight.js';
import { WebhookConnectionModel } from './models/WebhookConnection.js';
import { PendingTokenModel } from './models/PendingToken.js';
import { env } from './config/env.js';

export function createApp() {
  const authService = createAuthService({ userModel: UserModel, jwtSecret: env.JWT_SECRET });
  const transactionService = createTransactionService({ transactionModel: TransactionModel });
  const dashboardService = createDashboardService({ transactionModel: TransactionModel });
  const insightService = createInsightService({
    transactionModel: TransactionModel,
    insightModel: InsightModel
  });

  const telegramService = createTelegramService({ botToken: env.TELEGRAM_BOT_TOKEN });
  const discordService  = createDiscordService({
    botToken: env.DISCORD_BOT_TOKEN,
    publicKey: env.DISCORD_PUBLIC_KEY,
    applicationId: env.DISCORD_APPLICATION_ID,
  });
  const webhookService = createWebhookService({
    webhookConnectionModel: WebhookConnectionModel,
    pendingTokenModel: PendingTokenModel,
    transactionModel: TransactionModel,
  });

  const authController        = createAuthController({ authService });
  const transactionController = createTransactionController({ transactionService });
  const dashboardController   = createDashboardController({ dashboardService });
  const insightController     = createInsightController({ insightService });
  const webhookController     = createWebhookController({ webhookService, telegramService, discordService });

  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  // Capture raw body before JSON parsing — required for Discord signature verification
  app.use(express.json({
    verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); }
  }));
  app.use(morgan('dev'));

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/transactions', createTransactionRoutes(transactionController));
  app.use('/api/dashboard', createDashboardRoutes(dashboardController));
  app.use('/api/insights', createInsightRoutes(insightController));
  app.use('/api/webhooks', createWebhookRoutes(webhookController));
  app.use(errorHandler);

  return app;
}
