import { useState } from 'react';

export default function ExpenseForm({ onAddExpense, categories }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    const newExpense = {
      amount: parseFloat(amount),
      category: category.trim(),
      date,
      description: description.trim()
    };

    onAddExpense(newExpense);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setIsCustomCategory(false);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add New Expense</h2>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Category</label>
        {!isCustomCategory ? (
          <div className="category-select">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="text-button"
              onClick={() => setIsCustomCategory(true)}
            >
              + New Category
            </button>
          </div>
        ) : (
          <div className="category-input">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter new category"
              required
            />
            <button 
              type="button" 
              className="text-button"
              onClick={() => setIsCustomCategory(false)}
            >
              ← Select existing
            </button>
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      
      <button type="submit" className="submit-button">Add Expense</button>
    </form>
  );
}