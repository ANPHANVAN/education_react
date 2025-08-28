import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { Header } from './components';
import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { NotFound } from './pages/site';
import * as Me from './pages/me';

// import { TestIndex, TestDetail, TestClassDetail, CreateTest } from './pages/testTeacher';
const TestIndex = lazy(() =>
  import('./pages/testTeacher').then((module) => ({ default: module.TestIndex }))
);
const TestDetail = lazy(() =>
  import('./pages/testTeacher').then((module) => ({ default: module.TestDetail }))
);
const TestClassDetail = lazy(() =>
  import('./pages/testTeacher').then((module) => ({ default: module.TestClassDetail }))
);
const CreateTest = lazy(() =>
  import('./pages/testTeacher').then((module) => ({ default: module.CreateTest }))
);

// import { VideoIndex, VideoDetail, VideoClassDetail } from './pages/videoTeacher';
const VideoIndex = lazy(() =>
  import('./pages/videoTeacher').then((module) => ({ default: module.VideoIndex }))
);
const VideoDetail = lazy(() =>
  import('./pages/videoTeacher').then((module) => ({ default: module.VideoDetail }))
);
const VideoClassDetail = lazy(() =>
  import('./pages/videoTeacher').then((module) => ({ default: module.VideoClassDetail }))
);
// import { EssayIndex, EssayDetail, EssayClassDetail } from './pages/essayTeacher';
const EssayIndex = lazy(() =>
  import('./pages/essayTeacher').then((module) => ({ default: module.EssayIndex }))
);
const EssayDetail = lazy(() =>
  import('./pages/essayTeacher').then((module) => ({ default: module.EssayDetail }))
);
const EssayClassDetail = lazy(() =>
  import('./pages/essayTeacher').then((module) => ({ default: module.EssayClassDetail }))
);
// import {
//   ClassIndex,
//   ClassDetail,
//   Student,
//   Test,
//   Essay,
//   Video,
//   Announce,
//   Folder,
//   EditTeacherInfo,
//   TeacherInfo,
// } from './pages/classTeacher';
const ClassIndex = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.ClassIndex }))
);
const ClassDetail = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.ClassDetail }))
);
const Student = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Student }))
);
const Test = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Test }))
);
const Essay = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Essay }))
);
const Video = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Video }))
);
const Announce = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Announce }))
);
const Folder = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.Folder }))
);
const EditTeacherInfo = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.EditTeacherInfo }))
);
const TeacherInfo = lazy(() =>
  import('./pages/classTeacher').then((module) => ({ default: module.TeacherInfo }))
);

import * as StudentClass from './pages/classStudent';
import * as TestStudent from './pages/testStudent';
import * as VideoStudent from './pages/videoStudent';
import * as EssayStudent from './pages/essayStudent';

import * as Admin from './pages/admin';

function App() {
  const [routeBeginNavigation, setRouteBeginNavigation] = React.useState(false);
  const [role, setRole] = React.useState('student');

  const navigationFromRole = (roleCallBack) => {
    setRole(roleCallBack);
    switch (roleCallBack) {
      case 'admin':
        return setRouteBeginNavigation('/admin');
      case 'teacher':
        return setRouteBeginNavigation('/class-teacher');
      case 'student':
        return setRouteBeginNavigation('/home-student');
      default:
        return setRouteBeginNavigation('/auth/login');
    }
  };

  return (
    <BrowserRouter>
      <div className="body flex h-screen w-screen flex-col">
        <Header navigationFromRole={navigationFromRole} />
        <main className="h-full w-full flex-1">
          <Routes>
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

            {/* Admin */}
            <Route path="/admin" element={<Admin.AdminIndex />} />

            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ResetOTP />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

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

            {/* Another */}
            <Route path="/me/:userId" element={<Me.EditProfile />} />

            <Route
              path="/"
              element={<Navigate to={routeBeginNavigation && routeBeginNavigation} replace />}
            />
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
