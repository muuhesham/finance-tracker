const categories = [
  'salary',
  'freelance',
  'investment',
  'food',
  'transport',
  'bills',
  'entertainment',
  'health',
  'shopping',
  'housing',
  'education',
  'travel',
  'other'
];

const initialState = {
  type: 'expense',
  amount: '',
  category: 'food',
  note: '',
  transactionDate: new Date().toISOString().slice(0, 10)
};

export function TransactionForm({ onSubmit, editingTransaction, onCancelEdit }) {
  const formState = editingTransaction
    ? {
        ...editingTransaction,
        transactionDate: editingTransaction.transactionDate.slice(0, 10)
      }
    : initialState;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit({
      type: formData.get('type'),
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      note: formData.get('note'),
      transactionDate: formData.get('transactionDate')
    });
    event.currentTarget.reset();
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit} key={editingTransaction?.id ?? 'new'}>
      <div className="section-heading">
        <h3>{editingTransaction ? 'Edit transaction' : 'Add transaction'}</h3>
        <span>{editingTransaction ? 'Update an existing entry' : 'Capture today’s activity'}</span>
      </div>

      <div className="form-grid">
        <label>
          Type
          <select name="type" defaultValue={formState.type}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Amount
          <input name="amount" type="number" min="0.01" step="0.01" defaultValue={formState.amount} required />
        </label>

        <label>
          Category
          <select name="category" defaultValue={formState.category}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input name="transactionDate" type="date" defaultValue={formState.transactionDate} required />
        </label>
      </div>

      <label>
        Note
        <input name="note" defaultValue={formState.note} placeholder="Optional note" />
      </label>

      <div className="action-row">
        <button className="primary-button" type="submit">
          {editingTransaction ? 'Save changes' : 'Add transaction'}
        </button>
        {editingTransaction ? (
          <button className="ghost-button" type="button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}
