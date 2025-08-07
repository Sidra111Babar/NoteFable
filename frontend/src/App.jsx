import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Archived from './components/Archive'
import Trashed from './components/Trash';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/archive" element={<Archived />} />
        <Route path="/trash" element={<Trashed />} />
      </Routes>
    </Router>
  );
}

export default App;