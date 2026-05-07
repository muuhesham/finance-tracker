import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const initialForms = {
  login: {
    email: '',
    password: ''
  },
  register: {
    name: '',
    email: '',
    password: ''
  }
};

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [forms, setForms] = useState(initialForms);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(forms[mode], mode === 'login' ? 'login' : 'register');
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForms((current) => ({
      ...current,
      [mode]: {
        ...current[mode],
        [field]: value
      }
    }));
  }

  const activeForm = forms[mode];

  return (
    <main className="auth-page">
      <motion.section
        className="auth-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">FinanceFlow</div>
        <h1>Build a calmer money routine.</h1>
        <p className="auth-copy">
          Track spending, compare monthly trends, and turn behavior into clear saving guidance.
        </p>

        <div className="auth-tabs">
          {['login', 'register'].map((value) => (
            <button
              key={value}
              type="button"
              className={mode === value ? 'active' : ''}
              onClick={() => setMode(value)}
            >
              {value === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Full name
              <input
                required
                value={activeForm.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Omar Hassan"
              />
            </label>
          )}

          <label>
            Email
            <input
              required
              type="email"
              value={activeForm.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={activeForm.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 8 characters"
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </motion.section>
    </main>
  );
}
