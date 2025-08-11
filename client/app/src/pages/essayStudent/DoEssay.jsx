import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';

const VITE_API_URL = process.env.VITE_API_URL;

const DoEssay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { essayId } = useParams();
  const [searchParams] = useSearchParams();
  const [classId] = useState(searchParams.get('class_id'));
  const essayRefInfo = useRef({});
  const [formData, setFormData] = useState(new FormData());

  const fetchGetData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${VITE_API_URL}/essay-student/api/essay-information/${essayId}?class_id=${classId}`
      );
      if (!res.ok) {
        toast.error('Không lấy được dữ liệu');
        return;
      }
      const data = await res.json();
      essayRefInfo.current = data;
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
  const fetchPostSubmitEssay = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${VITE_API_URL}/essay-student/api/essay/${essayId}?class_id=${classId}`,
        {
          method: 'POST',
          // headers: { 'Content-Type': 'application/json' }, // Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryxYz123
          body: formData,
        }
      );
      if (!res.ok) {
        toast.error('Nộp bài thất bại');
        return;
      }
      toast.success('Nộp bài thành công! Chờ giáo viên chấm điểm');
      navigate(`/class-student/${classId}/essay`);
      return;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (formData.get('submitEssay')) {
      await fetchPostSubmitEssay();
      return;
    }
    toast.info(`Chưa Upload File bài làm!`);
    return;
  };

  const handleChangeInput = (e) => {
    const validType = ['.pdf', '.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx'];
    const file = e.target.files[0];
    const ext = file?.name?.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (file && !validType.includes(ext)) {
      toast.error('Chỉ chấp nhận file .pdf, .png, .jpg, .jpeg, .docx, .xlsx');
      return (e.target.value = '');
    } else {
      formData.set('submitEssay', e.target.files[0]);
      return;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchGetData();
        formData.set('classId', classId);
        formData.set('subject', essayRefInfo.current.subject);
        formData.set('grade', essayRefInfo.current.grade);
        formData.set('essayId', essayId);
      } catch (error) {
        console.error(`error when init: ${error}`);
        toast.error(`Lỗi Lấy Dữ Liệu!, ${error}`);
      }
    };
    init();
  }, []);

  return (
    <div className="h-full w-full">
      {loading ? (
        <MiniLoading></MiniLoading>
      ) : (
        <div className="block h-full w-full sm:flex">
          {/* <!-- LEFT: PDF đề thi --> */}
          <div className="h-2/3 flex-3/4 sm:h-full">
            <iframe
              id="pdfViewer"
              src={essayRefInfo.current?.url_file}
              title="Đề thi PDF"
              className="h-full w-full"
            ></iframe>
          </div>

          {/* <!-- RIGHT:form đáp án --> */}
          <div className="h-1/3 max-w-full flex-1/4 overflow-auto px-3 py-3 sm:h-[calc(100dvh-4rem)]">
            <div className="bg-bg flex flex-col justify-center">
              <h3 className="text-xl">
                Lưu Ý: Học sinh làm bài vào giấy, làm xong thì chụp hình lại upload lên đây
              </h3>
              <div className="submit">
                <input
                  type="file"
                  accept=".pdf, .png, .jpg, .jpeg, .docx, .xlsx"
                  name="submitEssay"
                  onChange={handleChangeInput}
                  className="file:bg-primary-from hover:file:bg-primary-to border-primary-from block w-full cursor-pointer rounded-lg border-2 text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
              <button
                id="submitBtn"
                className="bg-primary-from hover:bg-primary-to my-2 block w-full cursor-pointer rounded-2xl px-4 py-2 text-white"
                onClick={handleSubmit}
              >
                Nộp bài <i className="bi bi-check-lg"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoEssay;
