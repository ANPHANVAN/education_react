import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { DarkModeToggle, Header } from './components';
import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { NotFound } from './pages/site';
import { TestIndex, TestDetail, TestClassDetail, CreateTest } from './pages/testTeacher';
import { VideoDetail, VideoClassDetail } from './pages/videoTeacher';
import { EssayIndex, EssayDetail, EssayClassDetail } from './pages/essayTeacher';
import {
  ClassIndex,
  ClassDetail,
  Student,
  Test,
  Essay,
  Video,
  Announce,
  Folder,
} from './pages/classTeacher';

function App() {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  return (
    <BrowserRouter>
      <Header />
      <main className="h-[calc(100dvh-56px)]">
        <Routes>
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ResetOTP />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Teacher */}
          <Route path="/home-student" element={<div>Home Student</div>} />
          <Route path="/class-teacher" element={<ClassIndex />}></Route>

          <Route path="/class-teacher/classroom-details/:classId" element={<ClassDetail />}>
            <Route index element={<Navigate to="student" replace />} />
            <Route path="student" element={<Student />}></Route>
            <Route path="test" element={<Test />}></Route>
            <Route path="essay" element={<Essay />}></Route>
            <Route path="video" element={<Video />}></Route>
            <Route path="announce" element={<Announce />}></Route>
            <Route path="folder" element={<Folder />}></Route>
          </Route>

          <Route path="/test-teacher" element={<TestIndex />} />
          <Route path="/test-teacher/test-detail" element={<TestDetail />} />
          <Route path="/test-teacher/test-class-detail" element={<TestClassDetail />} />
          <Route path="/test-teacher/create-test" element={<CreateTest />} />
          <Route path="/essay-teacher" element={<EssayIndex />} />
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
      </main>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
