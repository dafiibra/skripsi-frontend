import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImg from '@/assets/login.jpeg';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      console.log('Attempting login with username:', username);
      const response = await fetch('https://skripsi-backend-three.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success) {
        setMessage('Login successful!');
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please check your network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginImg})` }}
    >
      <div className="w-full max-w-md p-6 bg-blue-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">LOGIN ADMIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-white">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginAdmin;