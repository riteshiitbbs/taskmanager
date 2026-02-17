import React, { useState } from 'react';
import { mockUsers, fetchUserPermissions } from '../data/rbacData';
import { useRbacContext } from '../rbac';

const Login = ({ setCurrentUser, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { initializePermissions } = useRbacContext();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (user) {
        // Fetch user permissions from "API"
        const userPermissionsData = await fetchUserPermissions(user.id);

        // Initialize RBAC context with permissions
        initializePermissions(userPermissionsData);

        // Set current user and navigate to dashboard
        setCurrentUser(user);
        setCurrentPage('dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Sign in to manage your tasks</p>
        </div>
        
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Admin: admin@example.com / admin123</p>
          <p className="text-xs text-gray-500">Manager: manager@example.com / manager123</p>
          <p className="text-xs text-gray-500">User: user@example.com / user123</p>
          <p className="text-xs text-gray-500">Viewer: viewer@example.com / viewer123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;