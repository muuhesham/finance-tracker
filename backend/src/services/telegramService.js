export function createTelegramService({ botToken }) {
  const BASE_URL = `https://api.telegram.org/bot${botToken}`;

  return {
    async sendMessage(chatId, text) {
      if (!botToken) return;
      try {
        await fetch(`${BASE_URL}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        });
      } catch {
        // Non-critical — best effort delivery
      }
    },

    async setWebhook(webhookUrl) {
      if (!botToken) return { ok: false, description: 'TELEGRAM_BOT_TOKEN not configured' };
      const res = await fetch(`${BASE_URL}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl }),
      });
      return res.json();
    },

    async getWebhookInfo() {
      if (!botToken) return null;
      const res = await fetch(`${BASE_URL}/getWebhookInfo`);
      return res.json();
    },
  };
}
