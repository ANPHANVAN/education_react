import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { Header } from './components';
import { NotFound } from './pages/site';

// import { Login, Register, ResetOTP, ResetPassword } from './pages/auth';
import { Login } from './pages/auth';
const Register = lazy(() =>
  import('./pages/auth').then((module) => ({ default: module.Register }))
);
const ResetOTP = lazy(() =>
  import('./pages/auth').then((module) => ({ default: module.ResetOTP }))
);
const ResetPassword = lazy(() =>
  import('./pages/auth').then((module) => ({ default: module.ResetPassword }))
);
// import * as Me from './pages/me';
const MeEditProfile = lazy(() =>
  import('./pages/me').then((module) => ({ default: module.EditProfile }))
);

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

// import { ClassIndex, ClassDetail, Student, Test, Essay, Video,
//   Announce, Folder, EditTeacherInfo,TeacherInfo } from './pages/classTeacher';
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

// import * as StudentClass from './pages/classStudent';
import StudentClassHomeStudent from './pages/classStudent/HomeStudent.jsx';
const StudentClassClassStudentIndex = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.ClassStudentIndex }))
);
const StudentClassClassInfo = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.ClassInfo }))
);
const StudentClassTest = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.Test }))
);
const StudentClassEssay = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.Essay }))
);
const StudentClassVideo = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.Video }))
);
const StudentClassFolder = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.Folder }))
);
const StudentClassTeacherInfo = lazy(() =>
  import('./pages/classStudent').then((module) => ({ default: module.TeacherInfo }))
);

// import * as TestStudent from './pages/testStudent';
const TestStudentInformation = lazy(() =>
  import('./pages/testStudent').then((module) => ({ default: module.Information }))
);
const TestStudentDoTest = lazy(() =>
  import('./pages/testStudent').then((module) => ({ default: module.DoTest }))
);
const TestStudentSubmissionInfo = lazy(() =>
  import('./pages/testStudent').then((module) => ({ default: module.SubmissionInfo }))
);

// import * as VideoStudent from './pages/videoStudent';
const VideoStudentWatch = lazy(() =>
  import('./pages/videoStudent').then((module) => ({ default: module.Watch }))
);
// import * as EssayStudent from './pages/essayStudent';
const EssayStudentInfor = lazy(() =>
  import('./pages/essayStudent').then((module) => ({ default: module.Infor }))
);
const EssayStudentDoEssay = lazy(() =>
  import('./pages/essayStudent').then((module) => ({ default: module.DoEssay }))
);
// import * as Admin from './pages/admin';
const AdminAdminIndex = lazy(() =>
  import('./pages/admin').then((module) => ({ default: module.AdminIndex }))
);

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
      {/* <div className="body flex h-screen w-screen flex-col"> */}
      <div className="body flex h-screen flex-col">
        <Header navigationFromRole={navigationFromRole} />
        <main className="h-full w-full flex-1 overflow-auto">
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
            <Route path="/admin" element={<AdminAdminIndex />} />

            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ResetOTP />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Student */}
            <Route path="/home-student" element={<StudentClassHomeStudent />} />
            <Route path="/class-student/:classId" element={<StudentClassClassStudentIndex />}>
              <Route index element={<Navigate to="information" replace />} />
              <Route path="information" element={<StudentClassClassInfo />} />
              <Route path="test" element={<StudentClassTest />} />
              <Route path="essay" element={<StudentClassEssay />} />
              <Route path="video" element={<StudentClassVideo />} />
              <Route path="folder" element={<StudentClassFolder />} />
              <Route path="teacher-info" element={<StudentClassTeacherInfo />} />
            </Route>
            <Route path="/test-student/information/:testId" element={<TestStudentInformation />} />
            <Route path="/test-student/test/:testId" element={<TestStudentDoTest />} />
            <Route path="/test-student/submit/:submitId" element={<TestStudentSubmissionInfo />} />
            <Route path="/essay-student/information/:essayId" element={<EssayStudentInfor />} />
            <Route path="/essay-student/essay/:essayId" element={<EssayStudentDoEssay />} />
            <Route path="/video-student/watch-video/:videoId" element={<VideoStudentWatch />} />

            {/* Another */}
            <Route path="/me/:userId" element={<MeEditProfile />} />

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
