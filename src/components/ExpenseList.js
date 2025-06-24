import { format } from 'date-fns';

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <div className="empty-state">No expenses found. Add your first expense!</div>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-item">
          <div className="expense-info">
            <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
            <div className="expense-category">{expense.category}</div>
            <div className="expense-date">
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </div>
            {expense.description && (
              <div className="expense-description">{expense.description}</div>
            )}
          </div>
          <button 
            onClick={() => onDelete(expense.id)}
            className="delete-button"
            aria-label="Delete expense"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}