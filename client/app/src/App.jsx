import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { DarkModeToggle, Header } from './components';
import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { NotFound } from './pages/site';
import {
  TestIndex,
  TestDetail,
  TestClassDetail,
  CreateTest,
  EssayDetail,
  EssayClassDetail,
  VideoDetail,
  VideoClassDetail,
} from './pages/testTeacher';

function App() {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ResetOTP />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Teacher */}
        <Route path="/home-student" element={<div>Home Student</div>} />
        <Route path="/class-teacher" element={<div>Class Teacher</div>} />
        <Route path="/test-teacher" element={<TestIndex />} />
        <Route path="/test-teacher/test-detail" element={<TestDetail />} />
        <Route path="/test-teacher/test-class-detail" element={<TestClassDetail />} />
        <Route path="/test-teacher/create-test" element={<CreateTest />} />
        <Route path="/essay-teacher" element={<div>Essay Teacher</div>} />
        <Route path="/essay-teacher/essay-detail" element={<EssayDetail />} />
        <Route path="/essay-teacher/essay-class-detail" element={<EssayClassDetail />} />
        <Route path="/video-teacher" element={<div>Video Teacher</div>} />
        <Route path="/video-teacher/video-detail" element={<VideoDetail />} />
        <Route path="/video-teacher/class-video-detail" element={<VideoClassDetail />} />

        {/* Student */}

        {/* Admin */}
        <Route path="/admin" element={<DarkModeToggle />} />

        {/* Another */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
