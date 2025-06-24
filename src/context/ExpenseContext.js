import React, { createContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const loadExpenses = () => {
      try {
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(savedExpenses);
        setFilteredExpenses(savedExpenses);
      } catch (error) {
        console.error("Failed to load expenses:", error);
        setExpenses([]);
        setFilteredExpenses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExpenses();
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      filterExpenses(filter); // Reapply current filter after expenses change
    }
  }, [expenses, isLoading, filter]);

  // Filter expenses based on category
  const filterExpenses = (category = 'all') => {
    setFilter(category);
    if (category === 'all') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(exp => exp.category === category));
    }
  };

  // Add new expense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  // Update existing expense
  const updateExpense = (id, updatedExpense) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === id ? { ...updatedExpense, id, createdAt: exp.createdAt } : exp
      )
    );
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Get expenses by time period
  const getExpensesByPeriod = (period = 'month') => {
    const now = new Date();
    let fromDate;

    switch (period) {
      case 'week':
        fromDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        fromDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        fromDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return expenses.filter(exp => new Date(exp.date) >= fromDate);
  };

  // Get category totals
  const getCategoryTotals = () => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
  };

  // Get monthly totals
  const getMonthlyTotals = () => {
    return expenses.reduce((acc, exp) => {
      const date = new Date(exp.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + exp.amount;
      return acc;
    }, {});
  };

  // Get weekly totals (last 8 weeks)
  const getWeeklyTotals = () => {
    return Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekTotal = expenses.reduce((sum, exp) => {
        const expDate = new Date(exp.date);
        return expDate >= weekStart && expDate <= weekEnd ? sum + exp.amount : sum;
      }, 0);
      
      return {
        label: `Week ${i + 1}`,
        value: weekTotal
      };
    });
  };

  // Get total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Get filtered total
  const getFilteredTotal = () => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Get average expense
  const getAverageExpense = () => {
    return expenses.length > 0 ? getTotalExpenses() / expenses.length : 0;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        filter,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        filterExpenses,
        getExpensesByPeriod,
        getCategoryTotals,
        getMonthlyTotals,
        getWeeklyTotals,
        getTotalExpenses,
        getFilteredTotal,
        getAverageExpense
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseContext, ExpenseProvider };