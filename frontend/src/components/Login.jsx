// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/auth/token/login/', form)
      .then((res) => {
        localStorage.setItem('token', res.data.auth_token);
        navigate('/home');
      })
      .catch(() => alert('Login failed'));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Username */}
          <div className="relative border-b border-gray-400 focus-within:border-blue-500">
            <UserIcon className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full pl-8 py-2 bg-transparent focus:outline-none peer"
            />
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full" />
          </div>

          {/* Password */}
          <div className="relative border-b border-gray-400 focus-within:border-blue-500">
            <LockClosedIcon className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-8 py-2 bg-transparent focus:outline-none peer"
            />
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full" />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-300"
          >
            Login
          </button>
          <p className="text-sm text-center mt-4 text-gray-400">
              Don’t have an account?{' '}
             <a href="/register" className="text-blue-600 hover:underline">
              Register
              </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
