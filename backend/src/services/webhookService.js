import crypto from 'node:crypto';
import { transactionCategories } from '../constants/transactionCategories.js';

const CATEGORY_ALIASES = {
  bill: 'bills',
  eat: 'food', groceries: 'food', grocery: 'food', restaurant: 'food', lunch: 'food', dinner: 'food',
  car: 'transport', bus: 'transport', taxi: 'transport', uber: 'transport', lyft: 'transport', metro: 'transport',
  job: 'salary', work: 'salary', paycheck: 'salary', pay: 'salary', wage: 'salary',
  gig: 'freelance', contract: 'freelance', consulting: 'freelance',
  invest: 'investment', stocks: 'investment', dividend: 'investment', crypto: 'investment', trading: 'investment',
  shop: 'shopping', clothes: 'shopping', clothing: 'shopping', amazon: 'shopping',
  doctor: 'health', medicine: 'health', hospital: 'health', gym: 'health', pharmacy: 'health', dental: 'health',
  school: 'education', course: 'education', tuition: 'education', university: 'education', book: 'education',
  rent: 'housing', mortgage: 'housing', home: 'housing', house: 'housing', apartment: 'housing', electric: 'housing', water: 'housing',
  movie: 'entertainment', game: 'entertainment', games: 'entertainment', fun: 'entertainment', bar: 'entertainment', streaming: 'entertainment', netflix: 'entertainment', spotify: 'entertainment',
  trip: 'travel', vacation: 'travel', flight: 'travel', hotel: 'travel', airbnb: 'travel', train: 'travel',
};

const HELP_TEXT = [
  '📊 *Finance Tracker Bot*',
  '',
  '*Add transactions:*',
  '`/add income 500 salary`',
  '`/add expense 200 food lunch`',
  '`/add bill 150` — shortcut for bills',
  '',
  '*Other commands:*',
  '`/balance` — current month summary',
  '`/list` — last 5 transactions',
  '`/disconnect` — unlink this account',
  '',
  '*Income categories:*',
  '`salary` · `freelance` · `investment` · `other`',
  '',
  '*Expense categories:*',
  '`food` · `transport` · `bills` · `entertainment`',
  '`health` · `shopping` · `housing` · `education` · `travel` · `other`',
].join('\n');

function resolveCategory(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (transactionCategories.includes(lower)) return lower;
  return CATEGORY_ALIASES[lower] || null;
}

function generateToken() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars e.g. "A3F2BC"
}

export function createWebhookService({ webhookConnectionModel, pendingTokenModel, transactionModel }) {
  // ── Command handlers ────────────────────────────────────────────────────────

  async function cmdConnect(platform, chatId, username, args) {
    const token = args[0]?.toUpperCase();
    if (!token || token.length !== 6) {
      return '❌ Usage: `/connect XXXXXX`\n\nGet your 6-character token from Finance Tracker → Settings → Bot Connections.';
    }

    const pending = await pendingTokenModel.findOne({
      token,
      platform,
      expiresAt: { $gt: new Date() },
    });

    if (!pending) {
      return '❌ Invalid or expired token. Generate a new one in Finance Tracker → Settings → Bot Connections.';
    }

    await webhookConnectionModel.findOneAndUpdate(
      { platform, chatId },
      { userId: pending.userId, username },
      { upsert: true, new: true }
    );
    await pendingTokenModel.deleteOne({ _id: pending._id });

    const platformLabel = platform === 'telegram' ? 'Telegram' : 'Discord';
    return `✅ *Account connected!*\n\nYou can now track finances from ${platformLabel}:\n\n\`/add income 500 salary\`\n\`/add expense 200 food\`\n\`/add bill 150 rent\`\n\nType \`/help\` to see all commands.`;
  }

  async function cmdDisconnect(platform, chatId) {
    await webhookConnectionModel.deleteOne({ platform, chatId });
    return '👋 Account disconnected. Your Finance Tracker data is untouched.';
  }

  async function cmdAdd(userId, args) {
    const subtype = args[0]?.toLowerCase();
    const amount = parseFloat(args[1]);

    if (!subtype || !['income', 'expense', 'bill', 'bills'].includes(subtype)) {
      return '❌ Usage: `/add income|expense|bill <amount> [category] [note]`\n\nExamples:\n`/add income 500 salary bonus`\n`/add expense 45 food lunch`\n`/add bill 120 electricity`';
    }
    if (isNaN(amount) || amount <= 0) {
      return `❌ "${args[1]}" is not a valid amount.\n\nExample: \`/add income 500 salary\``;
    }

    let type, category, noteStart;

    if (subtype === 'bill' || subtype === 'bills') {
      type = 'expense';
      category = 'bills';
      noteStart = 2;
    } else {
      type = subtype;
      const resolved = resolveCategory(args[2]);
      category = resolved ?? (type === 'income' ? 'salary' : 'other');
      noteStart = resolved ? 3 : 2;
    }

    const note = args.slice(noteStart).join(' ').slice(0, 180);

    await transactionModel.create({
      userId,
      type,
      amount,
      category,
      note,
      transactionDate: new Date(),
    });

    const emoji = type === 'income' ? '💰' : '💸';
    const sign = type === 'income' ? '+' : '-';
    const noteLine = note ? `\n📝 _"${note}"_` : '';
    return `${emoji} *${type.charAt(0).toUpperCase() + type.slice(1)} added!*\n\n${sign}$${amount.toFixed(2)} · ${category}${noteLine}`;
  }

  async function cmdBalance(userId) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const txns = await transactionModel
      .find({ userId, transactionDate: { $gte: start, $lt: end } })
      .lean();

    const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;

    return [
      `📊 *${year}-${month} Summary*`,
      '',
      `💰 Income:   $${income.toFixed(2)}`,
      `💸 Expenses: $${expense.toFixed(2)}`,
      `${balance >= 0 ? '📈' : '📉'} Balance:  $${balance.toFixed(2)}`,
      `📝 ${txns.length} transaction${txns.length !== 1 ? 's' : ''}`,
    ].join('\n');
  }

  async function cmdList(userId) {
    const txns = await transactionModel
      .find({ userId })
      .sort({ transactionDate: -1, createdAt: -1 })
      .limit(5)
      .lean();

    if (!txns.length) {
      return '📭 No transactions yet.\n\nAdd one: `/add income 500 salary`';
    }

    const lines = txns.map(t => {
      const emoji = t.type === 'income' ? '💰' : '💸';
      const sign = t.type === 'income' ? '+' : '-';
      const date = new Date(t.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const noteStr = t.note ? ` · ${t.note}` : '';
      return `${emoji} ${sign}$${t.amount.toFixed(2)} · ${t.category} · ${date}${noteStr}`;
    });

    return `📋 *Recent transactions:*\n\n${lines.join('\n')}`;
  }

  // ── Main dispatcher ─────────────────────────────────────────────────────────

  async function handleCommand(platform, chatId, username, command, args) {
    if (command === 'connect') {
      return cmdConnect(platform, chatId, username, args);
    }

    const connection = await webhookConnectionModel.findOne({ platform, chatId }).lean();
    if (!connection) {
      const label = platform === 'telegram' ? 'Telegram' : 'Discord';
      return [
        `👋 *Welcome to Finance Tracker Bot!*`,
        '',
        `Connect your account to start tracking:`,
        `1. Open Finance Tracker → Settings → Bot Connections`,
        `2. Click *Generate Token* for ${label}`,
        `3. Send: \`/connect YOURTOKEN\``,
      ].join('\n');
    }

    switch (command) {
      case 'help':       return HELP_TEXT;
      case 'disconnect': return cmdDisconnect(platform, chatId);
      case 'add':        return cmdAdd(connection.userId, args);
      case 'balance':
      case 'summary':    return cmdBalance(connection.userId);
      case 'list':       return cmdList(connection.userId);
      default:           return `❓ Unknown command \`/${command}\`. Type \`/help\` for available commands.`;
    }
  }

  // ── Update parsers ──────────────────────────────────────────────────────────

  function parseTelegramUpdate(update) {
    const message = update.message || update.edited_message;
    if (!message?.text) return null;

    const chatId = String(message.chat.id);
    const username = message.from?.username || message.from?.first_name || 'User';
    // Strip @botname suffix from commands: /start@MyBot → /start
    const text = message.text.trim().replace(/^(\/\w+)@\S+/, '$1');

    if (!text.startsWith('/')) return null;

    const parts = text.split(/\s+/);
    const command = parts[0].slice(1).toLowerCase();
    const args = parts.slice(1);

    return { chatId, username, command, args };
  }

  function parseDiscordInteraction(interaction) {
    const user = interaction.member?.user ?? interaction.user;
    if (!user?.id) return null;

    const chatId = user.id;
    const username = user.username || 'User';
    const command = interaction.data?.name?.toLowerCase();
    if (!command) return null;

    // Map named Discord options to a positional args array matching the Telegram format
    const opts = Object.fromEntries(
      (interaction.data?.options ?? []).map(o => [o.name, String(o.value)])
    );

    let args;
    if (command === 'connect') {
      args = [opts.token].filter(Boolean);
    } else if (command === 'add') {
      // type, amount, category?, note?
      args = [opts.type, opts.amount, opts.category, opts.note].filter(v => v !== undefined);
    } else {
      args = [];
    }

    return { chatId, username, command, args };
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  return {
    async createConnectToken(userId, platform) {
      await pendingTokenModel.deleteMany({ userId, platform });
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      await pendingTokenModel.create({ userId, platform, token, expiresAt });
      return token;
    },

    async getConnections(userId) {
      return webhookConnectionModel
        .find({ userId })
        .select('platform username createdAt')
        .lean();
    },

    async disconnect(userId, platform) {
      return webhookConnectionModel.deleteOne({ userId, platform });
    },

    parseTelegramUpdate,
    parseDiscordInteraction,
    handleCommand,
  };
}
