export default function ExpenseStats({ expenses }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);

  return (
    <div className="expense-stats">
      <h2>Statistics</h2>

      <div className="stat-card total">
        <h3>Total Spent</h3>
        <p>{formatCurrency(totalExpenses)}</p>
      </div>

      {expenses.length > 0 && (
        <>
          <div className="stat-card average">
            <h3>Average per Expense</h3>
            <p>{formatCurrency(totalExpenses / expenses.length)}</p>
          </div>

          <div className="top-categories">
            <h3>Top Categories</h3>
            {topCategories.length > 0 ? (
              <ul>
                {topCategories.map(([category, amount]) => (
                  <li key={category}>
                    <span className="category-name">{category}</span>
                    <span className="category-amount">{formatCurrency(amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No category data available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
