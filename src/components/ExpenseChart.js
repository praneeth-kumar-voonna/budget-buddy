import React from 'react';
import { Link } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

export default function ExpenseChart({ expenses }) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: amounts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#66D9EF', '#FF6B6B',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dailyData = expenses
    .map(exp => ({ x: new Date(exp.date), y: exp.amount }))
    .sort((a, b) => a.x - b.x);

  const lineData = {
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyData,
        borderColor: '#4BC0C0',
        backgroundColor: '#4BC0C0',
        fill: false,
        tension: 0, // 👈 Makes lines straight
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw.y} on ${ctx.raw.x.toLocaleDateString()}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM dd, yyyy',
          displayFormats: { day: 'MMM dd' },
        },
        title: { display: true, text: 'Date' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Amount (₹)' },
      },
    },
  };

  return (
    <div className="expense-chart">
      <div
        className="dashboard-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 className="dashboard-title">Expense Dashboard</h2>
        <Link to="/" className="home-link" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
          ← Home
        </Link>
      </div>

      <div
        className="chart-row"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}
      >
        <div className="chart-wrapper" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="chart-title">Category-wise (Pie)</h3>
          <Pie
            data={pieData}
            options={{
              maintainAspectRatio: true,
              aspectRatio: 1.2,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart-wrapper" style={{ maxWidth: '600px', width: '100%' }}>
          <h3 className="chart-title">Day-wise (Line)</h3>
          <Line
            data={lineData}
            options={{
              ...lineOptions,
              maintainAspectRatio: true,
              aspectRatio: 1.6,
            }}
          />
        </div>
      </div>
    </div>
  );
}
