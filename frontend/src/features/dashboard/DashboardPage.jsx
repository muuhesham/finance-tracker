import { useEffect, useState } from 'react';
import { client } from '../../api/client.js';
import { SpendingPieChart } from '../../components/charts/SpendingPieChart.jsx';
import { MonthlyTrendChart } from '../../components/charts/MonthlyTrendChart.jsx';
import { TransactionForm } from '../../components/transactions/TransactionForm.jsx';
import { TransactionList } from '../../components/transactions/TransactionList.jsx';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    void loadData();
  }, [activeMonth]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(''), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  async function loadData() {
    setIsLoading(true);
    setError('');

    try {
      const [dashboardResponse, insightsResponse] = await Promise.all([
        client.get('/dashboard/summary', { params: { month: activeMonth } }),
        client.get('/insights/monthly', { params: { month: activeMonth } })
      ]);

      setDashboard(dashboardResponse.data);
      setInsights(insightsResponse.data.insights);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveTransaction(payload) {
    setError('');

    try {
      if (editingTransaction) {
        await client.put(`/transactions/${editingTransaction.id}`, payload);
        setMessage('Transaction updated.');
        setEditingTransaction(null);
      } else {
        await client.post('/transactions', payload);
        setMessage('Transaction added.');
      }

      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to save the transaction.');
    }
  }

  async function handleDeleteTransaction(transactionId) {
    setError('');

    try {
      await client.delete(`/transactions/${transactionId}`);
      setMessage('Transaction deleted.');
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to delete the transaction.');
    }
  }

  if (isLoading && !dashboard) {
    return <div className="loading-state">Loading your finance dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="loading-state">{error || 'No dashboard data available yet.'}</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <div className="eyebrow">Monthly snapshot</div>
          <h1>{dashboard.monthLabel}</h1>
          <p>See your balance, category weight, and behavior-driven insights for this month.</p>
        </div>
        <label className="month-picker">
          Focus month
          <input
            type="month"
            value={activeMonth}
            onChange={(event) => setActiveMonth(event.target.value)}
          />
        </label>
      </header>

      <section className="summary-grid">
        <article className="summary-card positive">
          <span>Income</span>
          <strong>{formatCurrency(dashboard.totals.income)}</strong>
        </article>
        <article className="summary-card negative">
          <span>Expenses</span>
          <strong>{formatCurrency(dashboard.totals.expense)}</strong>
        </article>
        <article className="summary-card neutral">
          <span>Balance</span>
          <strong>{formatCurrency(dashboard.totals.balance)}</strong>
        </article>
      </section>

      <section className="charts-grid">
        <SpendingPieChart data={dashboard.categoryBreakdown} />
        <MonthlyTrendChart data={dashboard.monthlyTrend} />
      </section>

      <section className="insights-panel panel">
        <div className="section-heading">
          <h3>Automated monthly insights</h3>
          <span>Rule-based tips generated from your behavior</span>
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        <div className="insight-grid">
          {insights.map((insight) => (
            <article key={insight.title} className={`insight-card ${insight.severity}`}>
              <strong>{insight.title}</strong>
              <p>{insight.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace-grid">
        <TransactionForm
          onSubmit={handleSaveTransaction}
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />
        <TransactionList
          transactions={dashboard.recentTransactions}
          onEdit={setEditingTransaction}
          onDelete={handleDeleteTransaction}
        />
      </section>

      {message ? <div className="toast-message">{message}</div> : null}
    </div>
  );
}
