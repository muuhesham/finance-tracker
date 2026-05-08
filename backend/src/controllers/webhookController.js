import { asyncHandler, AppError } from '../utils/errors.js';

export function createWebhookController({ webhookService, telegramService, discordService }) {
  return {
    // GET /api/webhooks/connections  (protected)
    getConnections: asyncHandler(async (req, res) => {
      const connections = await webhookService.getConnections(req.user.sub);
      res.json(connections);
    }),

    // POST /api/webhooks/token  (protected)
    // Body: { platform: 'telegram' | 'discord' }
    generateToken: asyncHandler(async (req, res) => {
      const { platform } = req.body;
      if (!['telegram', 'discord'].includes(platform)) {
        throw new AppError('platform must be "telegram" or "discord"', 400);
      }
      const token = await webhookService.createConnectToken(req.user.sub, platform);
      res.json({ token, platform, expiresInMinutes: 15 });
    }),

    // DELETE /api/webhooks/connections/:platform  (protected)
    disconnectPlatform: asyncHandler(async (req, res) => {
      const { platform } = req.params;
      if (!['telegram', 'discord'].includes(platform)) {
        throw new AppError('Invalid platform', 400);
      }
      await webhookService.disconnect(req.user.sub, platform);
      res.status(204).send();
    }),

    // POST /api/webhooks/setup/telegram  (protected)
    // Body: { webhookUrl: 'https://yourdomain.com/api/webhooks/telegram' }
    setupTelegramWebhook: asyncHandler(async (req, res) => {
      const { webhookUrl } = req.body;
      if (!webhookUrl) throw new AppError('webhookUrl is required', 400);
      const result = await telegramService.setWebhook(webhookUrl);
      res.json(result);
    }),

    // POST /api/webhooks/setup/discord  (protected)
    // Registers slash commands with Discord API
    registerDiscordCommands: asyncHandler(async (_req, res) => {
      const result = await discordService.registerCommands();
      res.json({ ok: true, result });
    }),

    // POST /api/webhooks/telegram  (public — called by Telegram)
    handleTelegram: asyncHandler(async (req, res) => {
      // Always respond 200 immediately so Telegram doesn't retry
      res.status(200).json({ ok: true });

      try {
        const parsed = webhookService.parseTelegramUpdate(req.body);
        if (!parsed) return;

        const { chatId, username, command, args } = parsed;
        const reply = await webhookService.handleCommand('telegram', chatId, username, command, args);
        if (reply) await telegramService.sendMessage(chatId, reply);
      } catch (err) {
        console.error('[Telegram webhook]', err.message);
      }
    }),

    // POST /api/webhooks/discord  (public — called by Discord)
    handleDiscord: asyncHandler(async (req, res) => {
      const signature = req.headers['x-signature-ed25519'];
      const timestamp  = req.headers['x-signature-timestamp'];
      const rawBody    = req.rawBody;

      if (!signature || !timestamp || !rawBody) {
        return res.status(401).json({ error: 'Missing signature headers' });
      }

      const valid = await discordService.verifySignature(rawBody, signature, timestamp);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid request signature' });
      }

      const { type } = req.body;

      // Type 1 = Discord PING (required during endpoint setup in developer portal)
      if (type === 1) {
        return res.json({ type: 1 });
      }

      // Type 2 = Slash command interaction
      if (type === 2) {
        const parsed = webhookService.parseDiscordInteraction(req.body);
        if (!parsed) {
          return res.json({ type: 4, data: { content: '❌ Could not parse the interaction.' } });
        }

        const { chatId, username, command, args } = parsed;
        const reply = await webhookService.handleCommand('discord', chatId, username, command, args);

        // Response type 4 = CHANNEL_MESSAGE_WITH_SOURCE (reply visible to everyone in channel)
        return res.json({ type: 4, data: { content: reply || '✅ Done.' } });
      }

      res.status(400).json({ error: 'Unknown interaction type' });
    }),
  };
}
