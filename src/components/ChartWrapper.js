import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import ChartWrapper from './ChartWrapper';

const ExpenseStats = () => {
  const { expenses, filteredExpenses, filter } = useContext(ExpenseContext);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Category breakdown
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Monthly breakdown
    const monthlyTotals = expenses.reduce((acc, exp) => {
      const date = new Date(exp.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + exp.amount;
      return acc;
    }, {});

    // Weekly breakdown (last 8 weeks)
    const weeklyTotals = Array.from({ length: 8 }, (_, i) => {
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

    return {
      totalExpenses,
      filteredTotal,
      averageExpense,
      categoryTotals,
      monthlyTotals,
      weeklyTotals
    };
  }, [expenses, filteredExpenses]);

  // Prepare chart data
  const categoryChartData = {
    labels: Object.keys(stats.categoryTotals),
    datasets: [{
      data: Object.values(stats.categoryTotals),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
      ]
    }]
  };

  const monthlyChartData = {
    labels: Object.keys(stats.monthlyTotals).sort(),
    datasets: [{
      label: 'Monthly Expenses',
      data: Object.keys(stats.monthlyTotals).sort().map(key => stats.monthlyTotals[key]),
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      borderWidth: 1
    }]
  };

  const weeklyChartData = {
    labels: stats.weeklyTotals.map(week => week.label),
    datasets: [{
      label: 'Weekly Expenses',
      data: stats.weeklyTotals.map(week => week.value),
      fill: false,
      backgroundColor: '#4BC0C0',
      borderColor: '#4BC0C0',
      tension: 0.1
    }]
  };

  return (
    <div className="expense-stats">
      <h2>Expense Analytics</h2>
      
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total {filter === 'all' ? 'Expenses' : `(${filter})`}</h3>
          <p>${stats.filteredTotal.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Overall Total</h3>
          <p>${stats.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Average Expense</h3>
          <p>${stats.averageExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-card">
          <h3>Category Breakdown</h3>
          <div className="chart-wrapper">
            <ChartWrapper 
              type="pie" 
              data={categoryChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false
              }} 
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>Monthly Expenses</h3>
          <div className="chart-wrapper">
            <ChartWrapper 
              type="bar" 
              data={monthlyChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>Weekly Trend (Last 8 Weeks)</h3>
          <div className="chart-wrapper">
            <ChartWrapper 
              type="line" 
              data={weeklyChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStats;