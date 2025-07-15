import { DarkModeToggle } from './components';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Header } from './components';
import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { NotFound } from './pages/site';
function App() {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ResetOTP />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/home-student" element={<div>Home Student</div>} />
        <Route path="/class-teacher" element={<div>Class Teacher</div>} />
        <Route path="/test-teacher" element={<div>Test Teacher</div>} />
        <Route path="/essay-teacher" element={<div>Essay Teacher</div>} />
        <Route path="/video-teacher" element={<div>Video Teacher</div>} />
        <Route path="/admin" element={<DarkModeToggle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
