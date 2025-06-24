// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseStats from './components/ExpenseStats';
import CategoryFilter from './components/CategoryFilter';
import ExpenseChart from './components/ExpenseChart';
import Login from './pages/login';
import Signup from './pages/signup';
import './app.css';

function Dashboard({ expenses }) {
  return (
    <div className="dashboard-page">
      <ExpenseChart expenses={expenses} />
    </div>
  );
}

function Home({ expenses, setExpenses, selectedCategory, setSelectedCategory, sortBy, setSortBy }) {
  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const categories = [...new Set(expenses.map((expense) => expense.category))];

  const filteredExpenses = expenses.filter(
    (expense) => selectedCategory === 'all' || expense.category === selectedCategory
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="main-content">
      <div className="form-section">
        <ExpenseForm onAddExpense={addExpense} categories={categories} />
        <ExpenseStats expenses={expenses} />
      </div>
      <div className="list-section">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <ExpenseList expenses={sortedExpenses} onDelete={deleteExpense} />
      </div>
    </div>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser', null);
  const isLoggedIn = !!loggedInUser;

  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // load user-specific expenses
  useEffect(() => {
    if (loggedInUser?.email) {
      const saved = localStorage.getItem(`expenses_${loggedInUser.email}`);
      setExpenses(saved ? JSON.parse(saved) : []);
    }
  }, [loggedInUser]);

  // save user-specific expenses
  useEffect(() => {
    if (loggedInUser?.email) {
      localStorage.setItem(`expenses_${loggedInUser.email}`, JSON.stringify(expenses));
    }
  }, [expenses, loggedInUser]);

  return (
    <Router>
      <div className="app-container">
       <header className="app-header">
  <div className="logo-title-container">
    <img src="/logo.png" alt="Budget Buddy Logo" className="logo" />
    <h1 className='app-title'>Budget Buddy</h1>
  </div>
  {isLoggedIn && (
    <div className="nav-right">
      <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
      <button
        onClick={() => setLoggedInUser(null)}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  )}
</header>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home
                  expenses={expenses}
                  setExpenses={setExpenses}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard expenses={expenses} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={(user) => setLoggedInUser(user)} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
