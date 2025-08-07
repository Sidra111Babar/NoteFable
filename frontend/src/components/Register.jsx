// src/components/Register.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/users/', {
        username,
        password,
        re_password: rePassword,
      });
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-black text-white shadow-xl overflow-hidden rounded-lg border-2 border-indigo-500/50 shadow-indigo-500/50">

        {/* Left Panel */}
        <div
          className="w-full md:w-1/2 p-10 flex items-center justify-center"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 66% 100%, 0% 100%)',
            background:
              'linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)',
          }}
        >
          <div className="max-w-sm md:text-left pr-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Register</h2>
            <p className="text-base md:text-lg pr-2 md:pr-8">
              Register here and organize your notes — you can <strong>Save Note from picture</strong>, <strong>Make Note by speak</strong>, <strong>trash</strong>, <strong>drag & drop</strong>, <strong>archive</strong>,<strong>search</strong>,<strong>filter</strong>, and even <strong>tag</strong>,your notes for better productivity.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-black p-6">
          <form
            onSubmit={handleRegister}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <h2 className="text-3xl font-semibold text-blue-500 text-center">Create Account</h2>

            {/* Username */}
            <div className="relative border-b border-gray-400 focus-within:border-blue-500">
              <UserIcon className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-8 py-2 bg-transparent focus:outline-none peer"
              />
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full" />
            </div>

            {/* Confirm Password */}
            <div className="relative border-b border-gray-400 focus-within:border-blue-500">
              <LockClosedIcon className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full pl-8 py-2 bg-transparent focus:outline-none peer"
              />
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full" />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded transition duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;
