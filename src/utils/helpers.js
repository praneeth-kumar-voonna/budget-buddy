// helpers.js

import { format } from 'date-fns';

/**
 * Format a number as INR currency (e.g., ₹1,234.56)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Format a date string into readable form (e.g., "Jun 18, 2025")
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

/**
 * Get unique list of categories from expenses
 * @param {Array} expenses
 * @returns {Array<string>}
 */
export function getUniqueCategories(expenses) {
  return [...new Set(expenses.map(exp => exp.category))];
}

/**
 * Filter expenses by a given category
 * @param {Array} expenses
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(expenses, category) {
  return category === 'all'
    ? expenses
    : expenses.filter(exp => exp.category === category);
}

/**
 * Sort expenses based on criteria
 * @param {Array} expenses
 * @param {string} sortBy
 * @returns {Array}
 */
export function sortExpenses(expenses, sortBy) {
  return [...expenses].sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    return 0;
  });
}

/**
 * Get total amount from expenses
 * @param {Array} expenses
 * @returns {number}
 */
export function getTotalAmount(expenses) {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

/**
 * Get average amount per expense
 * @param {Array} expenses
 * @returns {number}
 */
export function getAverageAmount(expenses) {
  if (expenses.length === 0) return 0;
  return getTotalAmount(expenses) / expenses.length;
}

/**
 * Get top N categories by total amount
 * @param {Array} expenses
 * @param {number} topN
 * @returns {Array<[string, number]>}
 */
export function getTopCategories(expenses, topN = 3) {
  const totals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}
