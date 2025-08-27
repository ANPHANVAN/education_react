import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { Header } from './components';
import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { NotFound } from './pages/site';
import { TestIndex, TestDetail, TestClassDetail, CreateTest } from './pages/testTeacher';
import { VideoIndex, VideoDetail, VideoClassDetail } from './pages/videoTeacher';
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
  EditTeacherInfo,
  TeacherInfo,
} from './pages/classTeacher';

import * as StudentClass from './pages/classStudent';
import * as TestStudent from './pages/testStudent';
import * as VideoStudent from './pages/videoStudent';
import * as EssayStudent from './pages/essayStudent';
import * as Admin from './pages/admin';

function App() {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  return (
    <BrowserRouter>
      <div className="body flex h-screen w-screen flex-col">
        <Header />
        <main className="h-full w-full flex-1">
          <Routes>
            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ResetOTP />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Teacher */}
            <Route path="/class-teacher" element={<ClassIndex />}></Route>
            <Route path="/class-teacher/classroom-details/:classId" element={<ClassDetail />}>
              <Route index element={<Navigate to="student" replace />} />
              <Route path="student" element={<Student />}></Route>
              <Route path="test" element={<Test />}></Route>
              <Route path="essay" element={<Essay />}></Route>
              <Route path="video" element={<Video />}></Route>
              <Route path="announce" element={<Announce />}></Route>
              <Route path="folder" element={<Folder />}></Route>
              <Route path="teacher-edit" element={<EditTeacherInfo />}></Route>
              <Route path="teacher" element={<TeacherInfo />}></Route>
            </Route>
            <Route path="/test-teacher" element={<TestIndex />} />
            <Route path="/test-teacher/test-detail" element={<TestDetail />} />
            <Route path="/test-teacher/test-class-detail" element={<TestClassDetail />} />
            <Route path="/test-teacher/create-test" element={<CreateTest />} />
            <Route path="/essay-teacher" element={<EssayIndex />} />
            <Route path="/essay-teacher/essay-detail" element={<EssayDetail />} />
            <Route path="/essay-teacher/essay-class-detail" element={<EssayClassDetail />} />
            <Route path="/video-teacher" element={<VideoIndex />} />
            <Route path="/video-teacher/video-detail" element={<VideoDetail />} />
            <Route path="/video-teacher/class-video-detail" element={<VideoClassDetail />} />

            {/* Student */}
            <Route path="/home-student" element={<StudentClass.HomeStudent />} />
            <Route path="/class-student/:classId" element={<StudentClass.ClassStudentIndex />}>
              <Route index element={<Navigate to="information" replace />} />
              <Route path="information" element={<StudentClass.ClassInfo />} />
              <Route path="test" element={<StudentClass.Test />} />
              <Route path="essay" element={<StudentClass.Essay />} />
              <Route path="video" element={<StudentClass.Video />} />
              <Route path="folder" element={<StudentClass.Folder />} />
              <Route path="teacher-info" element={<StudentClass.TeacherInfo />} />
            </Route>
            <Route path="/test-student/information/:testId" element={<TestStudent.Information />} />
            <Route path="/test-student/test/:testId" element={<TestStudent.DoTest />} />
            <Route path="/test-student/submit/:submitId" element={<TestStudent.SubmissionInfo />} />
            <Route path="/essay-student/information/:essayId" element={<EssayStudent.Infor />} />
            <Route path="/essay-student/essay/:essayId" element={<EssayStudent.DoEssay />} />
            <Route path="/video-student/watch-video/:videoId" element={<VideoStudent.Watch />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin.AdminIndex />} />

            <Route path="/" element={<Navigate to="/home-student" replace />} />

            {/* Another */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
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
