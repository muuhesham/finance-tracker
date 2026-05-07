import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';

export function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <motion.aside
        className="sidebar"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <div className="eyebrow">Personal Finance</div>
          <h2>FinanceFlow</h2>
          <p className="sidebar-copy">
            Monthly patterns, recent activity, and smarter money prompts in one place.
          </p>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.[0] ?? 'U'}</div>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <button className="secondary-button" type="button" onClick={logout}>
          Log out
        </button>
      </motion.aside>

      <div className="content-area">{children}</div>
    </div>
  );
}
