// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      alert('User already exists!');
    } else {
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup} className="auth-form">
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-button">Sign Up</button>

        <p className="auth-switch">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
