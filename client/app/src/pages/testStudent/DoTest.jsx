import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
import QuestionItem from './components/QuestionItem.jsx';
import CountdownTimer from './components/CountDownTimer.jsx';

const VITE_API_URL = process.env.VITE_API_URL;

const DoTest = () => {
  // setFirstState
  const setFirstStateTimeBegin = () => {
    const savedStart = localStorage.getItem(`startTime_${testId}_${classId}`);
    if (savedStart) {
      return new Date(savedStart);
    } else {
      const newBeginDate = new Date();
      localStorage.setItem(`startTime_${testId}_${classId}`, newBeginDate.toISOString());
      return newBeginDate;
    }
  };
  const setFirstStateFormAnswer = () => {
    const saved = localStorage.getItem(`draftAnswers_${testId}_${classId}`);
    if (!saved || saved === 'null') return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [timeBegin, setTimeBegin] = useState(setFirstStateTimeBegin);
  const testRefInfo = useRef({});
  const [formAnswer, setFormAnswer] = useState(setFirstStateFormAnswer);
  const [formDataAnswers, setFormDataAnswers] = useState({
    subject: '',
    grade: 0,
    student_answers: formAnswer,
    time_begin: timeBegin.toISOString(),
    time_end: new Date().toISOString(),
    class_id: classId,
    test_id: testId,
  });
  const formDataAnswersRef = useRef(formDataAnswers);

  const fetchGetData = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-student/api/test-information/${testId}?class_id=${classId}`
      );
      if (!res.ok) {
        toast.error('Không lấy được dữ liệu');
        return;
      }
      const data = await res.json();
      testRefInfo.current = data;
      setReadyToLoad(true);
      return;
    } catch (error) {
      console.error(`Lỗi lấy dữ liệu! ${error}`);
      toast.error('Không lấy được dữ liệu');
      return;
    } finally {
      setLoading(false);
    }
  };

  /** post test info
   * @returns testSubmissionId or null
   */
  const fetchPostSubmitTest = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-student/api/test/${testId}?class_id=${classId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataAnswersRef.current),
        }
      );
      if (!res.ok) {
        toast.error('Nộp bài thất bại');
        return null;
      }
      toast.success('Nộp bài thành công!');
      const testSubmitInfo = await res.json();
      return testSubmitInfo._id;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(`startTime_${testId}_${classId}`);
    localStorage.removeItem(`draftAnswers_${testId}_${classId}`);
  };

  const handleStudentSubmit = async (e) => {
    // check fill full answers
    const unanswered = testRefInfo.current.answers.filter(
      (question) =>
        !formAnswer.some(
          (item) =>
            item.type === question.type &&
            item.part === question.part &&
            item.number === question.number
        )
    );

    if (unanswered.length > 0) {
      toast.info(`Bạn còn ${unanswered.length} câu chưa trả lời!`);
      return;
    }
    return handleAutoSubmit();
  };

  const handleAutoSubmit = async () => {
    const newTimeEnd = new Date().toISOString();
    formDataAnswersRef.current = {
      ...formDataAnswersRef.current,
      time_end: newTimeEnd,
    };
    const submissionId = await fetchPostSubmitTest();
    if (submissionId) {
      navigate(`/test-student/submit/${submissionId}?class_id=${classId}`);
    } else {
      toast.error('nộp bài thất bại');
      return;
    }
    return clearLocalStorage();
  };

  useEffect(() => {
    fetchGetData();
  }, []);

  useEffect(() => {
    setFormDataAnswers((prev) => ({
      ...prev,
      subject: testRefInfo.current.subject,
      grade: testRefInfo.current.grade,
      student_answers: formAnswer,
    }));
    localStorage.setItem(`draftAnswers_${testId}_${classId}`, JSON.stringify(formAnswer));
  }, [testRefInfo.current, formAnswer]);

  useEffect(() => {
    formDataAnswersRef.current = formDataAnswers;
  }, [formDataAnswers]);

  return (
    <div className="h-full w-full">
      {loading && <MiniLoading></MiniLoading>}
      <div className="block h-full w-full sm:flex">
        {/* <!-- LEFT: PDF đề thi --> */}
        <div className="h-1/2 flex-3/4 sm:h-full">
          <iframe
            id="pdfViewer"
            src={testRefInfo.current?.url_file}
            title="Đề thi PDF"
            className="h-full w-full"
          ></iframe>
        </div>

        {/* <!-- RIGHT: Đồng hồ + form đáp án --> */}
        <div className="h-1/2 max-w-full flex-1/4 overflow-auto px-3 sm:h-[calc(100dvh-4rem)]">
          <div className="bg-bg sticky top-0 flex items-center justify-between border-b-2">
            <span id="countdown" className="">
              {readyToLoad && (
                <CountdownTimer
                  initialMinutes={testRefInfo.current?.test_time}
                  timeBegin={timeBegin}
                  autoSubmit={handleAutoSubmit}
                  formDataAnswers={formDataAnswers}
                />
              )}
            </span>
            <button
              id="submitBtn"
              className="bg-primary-from hover:bg-primary-to m-2 cursor-pointer rounded-2xl px-4 py-2 text-white"
              onClick={handleStudentSubmit}
            >
              Nộp bài <i className="bi bi-check-lg"></i>
            </button>
          </div>
          <div id="answerForm" className="overflow-auto">
            {testRefInfo.current?.answers?.map((answer, index) => (
              <QuestionItem
                answer={answer}
                key={index}
                index={index}
                formData={formAnswer}
                setFormData={setFormAnswer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoTest;
