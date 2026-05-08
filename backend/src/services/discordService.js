import { webcrypto } from 'node:crypto';

export function createDiscordService({ botToken, publicKey, applicationId }) {
  const BASE_URL = 'https://discord.com/api/v10';

  return {
    async verifySignature(rawBody, signature, timestamp) {
      if (!publicKey) return false;
      try {
        const key = await webcrypto.subtle.importKey(
          'raw',
          Buffer.from(publicKey, 'hex'),
          { name: 'Ed25519', namedCurve: 'Ed25519' },
          false,
          ['verify']
        );
        return webcrypto.subtle.verify(
          { name: 'Ed25519' },
          key,
          Buffer.from(signature, 'hex'),
          new TextEncoder().encode(timestamp + rawBody)
        );
      } catch {
        return false;
      }
    },

    async sendMessage(channelId, content) {
      if (!botToken) return;
      try {
        await fetch(`${BASE_URL}/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
      } catch {
        // Non-critical
      }
    },

    async registerCommands() {
      if (!botToken || !applicationId) {
        return { ok: false, description: 'DISCORD_BOT_TOKEN or DISCORD_APPLICATION_ID not configured' };
      }
      const commands = [
        {
          name: 'connect',
          description: 'Connect your Finance Tracker account',
          options: [
            { name: 'token', description: 'Your 6-character connect token', type: 3, required: true },
          ],
        },
        {
          name: 'add',
          description: 'Add a transaction',
          options: [
            {
              name: 'type',
              description: 'Transaction type',
              type: 3,
              required: true,
              choices: [
                { name: 'income', value: 'income' },
                { name: 'expense', value: 'expense' },
                { name: 'bill', value: 'bill' },
              ],
            },
            { name: 'amount', description: 'Amount (e.g. 500)', type: 10, required: true },
            { name: 'category', description: 'Category (e.g. salary, food, housing)', type: 3, required: false },
            { name: 'note', description: 'Optional note', type: 3, required: false },
          ],
        },
        { name: 'balance', description: 'Get current month balance summary' },
        { name: 'list', description: 'List 5 most recent transactions' },
        { name: 'help', description: 'Show available commands' },
        { name: 'disconnect', description: 'Disconnect your Finance Tracker account' },
      ];

      const res = await fetch(`${BASE_URL}/applications/${applicationId}/commands`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
      });
      return res.json();
    },
  };
}
