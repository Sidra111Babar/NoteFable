// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/auth/token/logout/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    }).then(() => { 
      localStorage.removeItem('token');
      navigate('/');
    });
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      {/* <div>
        <Link to="/home" className="mr-4">Home</Link>
      </div> */}
      <div>
        {localStorage.getItem('token') ? (
          <button onClick={handleLogout} className="text-white">Logout</button>
        ) : (
          <>
            <Link to="/" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
