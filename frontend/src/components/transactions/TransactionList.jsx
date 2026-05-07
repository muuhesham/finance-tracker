import { motion } from 'framer-motion';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="panel transaction-list">
      <div className="section-heading">
        <h3>Recent transactions</h3>
        <span>Latest recorded activity</span>
      </div>

      <div className="transaction-items">
        {transactions.map((transaction, index) => (
          <motion.article
            key={transaction.id}
            className="transaction-item"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <div>
              <strong>{transaction.category}</strong>
              <p>{transaction.note || 'No note added'}</p>
              <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
            </div>
            <div className="transaction-actions">
              <strong className={transaction.type === 'income' ? 'income-text' : 'expense-text'}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </strong>
              <div>
                <button type="button" onClick={() => onEdit(transaction)}>
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(transaction.id)}>
                  Delete
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
