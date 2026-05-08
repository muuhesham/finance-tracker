import { useEffect, useState } from 'react';
import { client } from '../../api/client.js';

const PLATFORMS = {
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    color: '#0088cc',
    botInstruction: 'Find your Finance Tracker bot on Telegram',
    connectCmd: (token) => `/connect ${token}`,
    steps: (token) => [
      'Open Telegram and search for your Finance Tracker bot',
      `Send this message to the bot: /connect ${token}`,
      'The bot will confirm — you are ready to track!',
    ],
  },
  discord: {
    name: 'Discord',
    icon: '🎮',
    color: '#5865f2',
    botInstruction: 'Find the Finance Tracker bot in your Discord server',
    connectCmd: (token) => `/connect token:${token}`,
    steps: (token) => [
      'Open Discord and find the Finance Tracker bot',
      `Use the slash command: /connect token:${token}`,
      'The bot will confirm — you are ready to track!',
    ],
  },
};

const COMMAND_EXAMPLES = [
  { cmd: '/add income 500 salary', desc: 'Log a salary payment' },
  { cmd: '/add expense 45 food lunch', desc: 'Log a food expense with note' },
  { cmd: '/add bill 120 electricity', desc: 'Log a bill payment' },
  { cmd: '/balance', desc: 'See this month\'s summary' },
  { cmd: '/list', desc: 'Last 5 transactions' },
];

export function WebhookSettings() {
  const [connections, setConnections] = useState([]);
  const [tokenData, setTokenData] = useState(null);   // { token, platform, expiresInMinutes }
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState('');          // platform being loaded, or ''
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    client.get('/webhooks/connections')
      .then(res => setConnections(res.data))
      .catch(() => {});
  }, []);

  async function generateToken(platform) {
    setLoading(platform);
    setError('');
    setTokenData(null);
    setCopied(false);
    try {
      const res = await client.post('/webhooks/token', { platform });
      setTokenData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate token. Try again.');
    } finally {
      setLoading('');
    }
  }

  async function disconnect(platform) {
    setError('');
    try {
      await client.delete(`/webhooks/connections/${platform}`);
      setConnections(prev => prev.filter(c => c.platform !== platform));
      if (tokenData?.platform === platform) setTokenData(null);
    } catch {
      setError('Could not disconnect. Try again.');
    }
  }

  async function copyToken(token) {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  const connectedMap = Object.fromEntries(connections.map(c => [c.platform, c]));

  return (
    <section className="webhook-settings panel">
      <div className="section-heading">
        <h3>Bot Connections</h3>
        <span>Log incomes, expenses &amp; bills directly from Telegram or Discord</span>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="webhook-platform-grid">
        {Object.entries(PLATFORMS).map(([platform, info]) => {
          const conn = connectedMap[platform];
          const isConnected = Boolean(conn);
          const showToken = tokenData?.platform === platform;

          return (
            <article key={platform} className={`webhook-card ${isConnected ? 'is-connected' : ''}`}>
              <div className="webhook-card-header">
                <span className="webhook-platform-icon" style={{ background: info.color }}>
                  {info.icon}
                </span>
                <div className="webhook-card-meta">
                  <strong>{info.name}</strong>
                  {isConnected
                    ? <span className="webhook-badge connected">Connected · @{conn.username}</span>
                    : <span className="webhook-badge">Not connected</span>
                  }
                </div>
              </div>

              {isConnected ? (
                <div className="webhook-connected-body">
                  <p className="webhook-hint">
                    Send transactions directly from {info.name}. Type <code>/help</code> in the bot for all commands.
                  </p>
                  <button
                    className="webhook-btn-danger"
                    onClick={() => disconnect(platform)}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="webhook-setup-body">
                  <p className="webhook-hint">{info.botInstruction} and send a one-time token to link your account.</p>
                  <button
                    className="webhook-btn-primary"
                    onClick={() => generateToken(platform)}
                    disabled={loading === platform}
                  >
                    {loading === platform ? 'Generating…' : 'Generate Connect Token'}
                  </button>
                </div>
              )}

              {showToken && (
                <div className="webhook-token-panel">
                  <p className="webhook-token-label">
                    Your connect token <span className="webhook-token-expiry">(expires in {tokenData.expiresInMinutes} min)</span>
                  </p>
                  <div className="webhook-token-row">
                    <code className="webhook-token-code">{tokenData.token}</code>
                    <button className="webhook-btn-copy" onClick={() => copyToken(tokenData.token)}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <ol className="webhook-steps">
                    {info.steps(tokenData.token).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="webhook-examples-toggle">
        <button
          className="webhook-btn-ghost"
          onClick={() => setShowExamples(v => !v)}
        >
          {showExamples ? '▲ Hide' : '▼ Show'} command examples
        </button>
      </div>

      {showExamples && (
        <div className="webhook-examples">
          {COMMAND_EXAMPLES.map(({ cmd, desc }) => (
            <div key={cmd} className="webhook-example-row">
              <code>{cmd}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
