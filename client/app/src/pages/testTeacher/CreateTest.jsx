import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VITE_API_URL = process.env.VITE_API_URL;

export const CreateTest = () => {
  const navigate = useNavigate();
  const [viewerFile, setViewerFile] = useState(null);
  const [test, setTest] = useState({
    title: '',
    testTime: '',
    subject: '',
    grade: '',
    urlFile: '',
    answers: [],
  });

  // Load file từ URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileUrl = urlParams.get('file');
    if (fileUrl) {
      const filePath = `/uploads/${encodeURIComponent(fileUrl)}`;
      setViewerFile(filePath);
      setTest((prev) => ({ ...prev, urlFile: `/uploads/${encodeURIComponent(fileUrl)}` }));
    }
  }, []);

  // Thêm câu hỏi mới
  const addAnswer = () => {
    setTest({
      ...test,
      answers: [...test.answers, { number: '', part: '', type: '', answer: '', score: '' }],
    });
  };

  // Xóa câu hỏi
  const removeAnswer = (index) => {
    setTest({
      ...test,
      answers: test.answers.filter((_, i) => i !== index),
    });
  };

  // Cập nhật thông tin câu hỏi
  const updateAnswer = (index, field, value) => {
    const updatedAnswers = [...test.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    if (field === 'type') {
      updatedAnswers[index].answer = ''; // Reset answer khi đổi type
    }
    setTest({ ...test, answers: updatedAnswers });
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate dữ liệu

    if (!test.title || !test.testTime || !test.subject || !test.grade || !test.urlFile) {
      toast.error('Vui lòng điền đầy đủ thông tin và đảm bảo có file đề thi!');
      return;
    }
    if (test.answers.length === 0) {
      toast.error('Vui lòng thêm ít nhất một câu trả lời!');
      return;
    }
    for (let i = 0; i < test.answers.length; i++) {
      const answer = test.answers[i];
      if (!answer.number || !answer.part || !answer.type || !answer.answer || !answer.score) {
        toast.error(`Câu trả lời ${i + 1} chưa đầy đủ thông tin!`);
        return;
      }
    }

    try {
      console.log('Submitting test data:', test);
      const response = await fetch(`${VITE_API_URL}/test-teacher/api/create-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Lưu bài test thành công!');
        setTest({
          title: '',
          testTime: '',
          subject: '',
          grade: '',
          urlFile: '',
          answers: [],
        });
        return navigate(`/test-teacher`); // Redirect to test list
      } else {
        return toast.info('Lưu bài test thất bại!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi Hệ Thống!');
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-68px)]">
      <div className="max-h-screen min-w-0 flex-1 overflow-auto p-4">
        <h4 className="mb-4 text-lg font-bold">Thông tin đề thi</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Tên đề thi</label>
            <input
              type="text"
              className="w-full rounded border p-2"
              value={test.title}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Thời gian làm bài (phút)</label>
            <input
              type="number"
              className="w-full rounded border p-2"
              value={test.testTime}
              onChange={(e) => setTest({ ...test, testTime: e.target.value })}
              placeholder="VD: 40"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Môn học</label>
            <select
              className="bg-bg w-full rounded border p-2"
              value={test.subject}
              onChange={(e) => setTest({ ...test, subject: e.target.value })}
              required
            >
              <option value="">Chọn môn học</option>
              <option value="Toán">Toán</option>
              <option value="Vật Lý">Vật Lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Ngữ văn">Ngữ văn</option>
              <option value="Lịch sử">Lịch sử</option>
              <option value="Địa lý">Địa lý</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Khối</label>
            <select
              className="bg-bg w-full rounded border p-2"
              value={test.grade}
              onChange={(e) => setTest({ ...test, grade: e.target.value })}
              required
            >
              <option value="">Chọn khối</option>
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>
          {test.urlFile && (
            <div className="mb-3">
              <label className="block text-sm font-medium">File đề thi</label>
              <p className="text-sm text-green-600">{test.urlFile}</p>
            </div>
          )}
          <div className="mb-3">
            <label className="block text-sm font-medium">Đáp án từng câu</label>
            {test.answers.map((answer, index) => (
              <div key={index} className="mb-2 rounded border p-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm">Câu số</label>
                    <input
                      type="text"
                      className="w-full rounded border p-2"
                      placeholder="VD:1, 1a"
                      value={answer.number}
                      onChange={(e) => updateAnswer(index, 'number', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Phần</label>
                    <select
                      className="bg-bg w-full rounded border p-2"
                      value={answer.part}
                      onChange={(e) => updateAnswer(index, 'part', e.target.value)}
                      required
                    >
                      <option value="">Chọn phần</option>
                      <option value="I">Phần I</option>
                      <option value="II">Phần II</option>
                      <option value="III">Phần III</option>
                    </select>
                  </div>

                  {/* Ô điểm */}
                  <div>
                    <label className="block text-sm">Điểm</label>
                    <input
                      type="number"
                      step="0.01" // cho phép số thập phân
                      min="0"
                      className="w-full rounded border p-2"
                      value={answer.score}
                      placeholder="VD:0.25"
                      onChange={(e) => updateAnswer(index, 'score', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Loại câu hỏi</label>
                    <select
                      className="bg-bg w-full rounded border p-2"
                      value={answer.type}
                      onChange={(e) => updateAnswer(index, 'type', e.target.value)}
                      required
                    >
                      <option value="">Chọn loại</option>
                      <option value="abcd">Trắc nghiệm (A, B, C, D)</option>
                      <option value="truefalse">Đúng/Sai</option>
                      <option value="value">Nhập giá trị</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  {answer.type === 'abcd' && (
                    <div>
                      <label className="block text-sm">Đáp án đúng</label>
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={`answer-${index}`}
                            value={option}
                            checked={answer.answer === option}
                            onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                            className="mr-2"
                            required
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {answer.type === 'truefalse' && (
                    <div>
                      <label className="block text-sm">Đáp án đúng</label>
                      {['true', 'false'].map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={`answer-${index}`}
                            value={option}
                            checked={answer.answer === option}
                            onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                            className="mr-2"
                            required
                          />
                          <label>{option === 'true' ? 'Đúng' : 'Sai'}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {answer.type === 'value' && (
                    <div>
                      <label className="block text-sm">Đáp án</label>
                      <input
                        type="text"
                        className="w-full rounded border p-2"
                        value={answer.answer}
                        onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                        placeholder="10.10"
                        required
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
                  onClick={() => removeAnswer(index)}
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 rounded bg-gray-500 px-4 py-2 text-white"
              onClick={addAnswer}
            >
              Thêm câu trả lời
            </button>
          </div>
          <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
            Lưu thông tin
          </button>
        </form>
      </div>

      <div className="flex-[2] p-4">
        <iframe id="viewer" src={viewerFile} className="h-full w-full"></iframe>
      </div>
    </div>
  );
};
