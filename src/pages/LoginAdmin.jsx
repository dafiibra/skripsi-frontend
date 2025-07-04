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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginImg})` }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-blue-900 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-8 border border-blue-700">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">LOGIN ADMIN</h2>
            <p className="text-blue-200 text-sm">Masuk ke dashboard administrator</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-3 rounded-md text-center text-sm ${
              message.includes('successful') 
                ? 'bg-green-600 bg-opacity-20 border border-green-500 text-green-200' 
                : 'bg-red-600 bg-opacity-20 border border-red-500 text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-blue-700">
            <p className="text-center text-xs text-blue-300">
              Sistem Informasi Geografis VisualJob.ID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;