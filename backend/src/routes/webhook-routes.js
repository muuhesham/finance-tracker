import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export function createWebhookRoutes(webhookController) {
  const router = Router();

  // ── Protected (require valid JWT) ────────────────────────────────────────────
  router.get('/connections', authenticate, webhookController.getConnections);
  router.post('/token', authenticate, webhookController.generateToken);
  router.delete('/connections/:platform', authenticate, webhookController.disconnectPlatform);
  router.post('/setup/telegram', authenticate, webhookController.setupTelegramWebhook);
  router.post('/setup/discord', authenticate, webhookController.registerDiscordCommands);

  // ── Public (called by Telegram / Discord) ────────────────────────────────────
  router.post('/telegram', webhookController.handleTelegram);
  router.post('/discord', webhookController.handleDiscord);

  return router;
}
