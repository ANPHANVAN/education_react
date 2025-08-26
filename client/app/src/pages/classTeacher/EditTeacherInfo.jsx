import { useState, useEffect } from 'react';
import { MiniLoading } from '../../components';
import { useParams } from 'react-router-dom';
import { ObjectId } from 'bson';
import { toast } from 'react-toastify';

const VITE_API_URL = process.env.VITE_API_URL;
// TODO: add more button add certificate
export const EditTeacherInfo = () => {
  const { classId } = useParams();
  const [preview, setPreview] = useState(null);
  const [teacherImage, setTeacherImage] = useState(null);
  const [formData, setFormData] = useState({
    titleFullname: 'Thầy Huỳnh Đăng Phong',
    teacherSubject: 'Giáo viên môn Toán học',
    fullname: 'Huỳnh Đăng Phong',
    teacherImageLink: '/uploads/thay-huynh-dang-phong.jpeg',
    degree: [
      { _id: 1, context: 'Cử nhân Công Nghệ Thông Tin - Đại học Sư phạm TP.HCM' },
      { _id: 2, context: 'Cử nhân Sư phạm Toán - Đại học Sư phạm TP.HCM' },
    ],
    subject: 'Môn Toán Cấp 2 & Cấp 3',
    workPassion:
      'Là một giáo viên giảng dạy môn Toán học từ lớp 6 đến lớp 12, tôi – thầy Huỳnh Đăng Phong – luôn trăn trở với câu hỏi:“Làm thế nào để theo sát quá trình học tập của từng học sinh một cách hiệu quả và khoa học hơn?”',
    part: [
      {
        _id: 1,
        title: '🌟 Tâm huyết nghề nghiệp',
        content: [
          {
            _id: 1,
            context:
              'Là một giáo viên giảng dạy môn Toán học từ lớp 6 đến lớp 12, tôi – thầy Huỳnh Đăng Phong – luôn trăn trở với câu hỏi:“Làm thế nào để theo sát quá trình học tập của từng học sinh một cách hiệu quả và khoa học hơn?”',
          },
        ],
      },
      {
        _id: 2,
        title: '🔍 Những vấn đề trong thực tiễn giảng dạy',
        content: [
          {
            _id: 1,
            context:
              'Việc theo dõi tiến độ học tập, kết quả bài kiểm tra, và mức độ hiểu bài của học sinh thường bị rời rạc và thiếu hệ thống.',
          },
          {
            _id: 2,
            context:
              'Giáo viên mất nhiều thời gian ghi chép sổ sách thủ công, gây khó khăn trong việc đánh giá sự tiến bộ của học sinh.',
          },
          {
            _id: 3,
            context:
              'Phụ huynh khó nắm bắt tình hình học tập của con em mình một cách kịp thời và chính xác.',
          },
        ],
      },
    ],
  });

  const fetchTeacherInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/get-teacher-info/${classId}`
      );
      if (res.ok) {
        const dataTeacherInfo = await res.json();
        setFormData(dataTeacherInfo);
      } else {
        toast.error('Không lấy được thông tin giáo viên');
        return;
      }
    } catch (error) {
      console.error(`Lỗi lấy dữ liệu! ${error}`);
      toast.error('Không lấy được dữ liệu');
      return;
    }
  };

  const postChangeTeacherInfo = async () => {
    const data = new FormData();
    if (teacherImage) {
      data.set('teacherPhoto', teacherImage);
    }
    data.set('titleFullname', formData.titleFullname);
    data.set('teacherSubject', formData.teacherSubject);
    data.set('fullname', formData.fullname);
    data.set('subject', formData.subject);
    data.set('workPassion', formData.workPassion);
    data.set('degree', JSON.stringify(formData.degree));
    data.set('part', JSON.stringify(formData.part));

    const res = await fetch(
      `${VITE_API_URL}/class-teacher/api/classroom-details/createTeacherInfo/${classId}`,
      {
        method: 'POST',
        body: data,
      }
    );

    if (res.ok) {
      toast.success('Thay đổi thông tin thành công!');
      return;
    } else {
      toast.success('Thay đổi thông tin thất bại!');
    }
  };

  const handleChangeInputMainFormData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleChangeDegree = (e) => {
    const degreeId = e.target.name;
    const value = e.target.value;

    setFormData((prev) => {
      const finalDegree = prev.degree.map((degreeItem) => {
        if (degreeItem._id == degreeId) {
          return {
            ...degreeItem,
            context: value,
          };
        }
        return degreeItem;
      });

      return {
        ...prev,
        degree: finalDegree,
      };
    });
  };

  const handleChangePartTitle = (e) => {
    const partId = e.target.id;
    const value = e.target.value;

    setFormData((prev) => {
      const finalPart = prev.part.map((partItem) => {
        if (partItem._id == partId) {
          return {
            ...partItem,
            title: value,
          };
        } else {
          return partItem;
        }
      });
      return {
        ...prev,
        part: finalPart,
      };
    });
  };

  const handleChangeContent = (e) => {
    // name={partItem._id + '_' + contentItem._id}
    const name = e.target.name;
    const contextValue = e.target.value;
    const partId = name.split('_')[0];
    const contentId = name.split('_')[1];

    setFormData((prev) => {
      const finalPart = prev.part.map((partItem) => {
        if (partItem._id == partId) {
          const newContent = partItem.content.map((contentItem) => {
            if (contentItem._id == contentId) {
              return {
                ...contentItem,
                context: contextValue,
              };
            } else {
              return contentItem;
            }
          });
          return {
            ...partItem,
            content: newContent,
          };
        } else {
          return partItem;
        }
      });

      return {
        ...prev,
        part: finalPart,
      };
    });
  };

  const handleClickDeletePart = (partId) => {
    setFormData((prev) => {
      const finalPart = prev.part.filter((partItem) => partItem._id != partId);
      return {
        ...prev,
        part: finalPart,
      };
    });
  };

  const handleClickDeleteContentItem = (partItemId, contentItemId) => {
    setFormData((prev) => {
      const finalPart = prev.part.map((partItem) => {
        if (partItem._id == partItemId) {
          const newContent = partItem.content.filter(
            (contentItem) => contentItem._id != contentItemId
          );
          return {
            ...partItem,
            content: newContent,
          };
        } else {
          return partItem;
        }
      });

      return {
        ...prev,
        part: finalPart,
      };
    });
  };

  const handleClickAddContent = (partId) => {
    setFormData((prev) => {
      const finalPart = prev.part.map((partItem) => {
        if (partItem._id == partId) {
          return {
            ...partItem,
            content: [
              ...partItem.content,
              {
                _id: new ObjectId().toString(),
                context: 'mẫu',
              },
            ],
          };
        } else {
          return partItem;
        }
      });
      return {
        ...prev,
        part: finalPart,
      };
    });
  };

  const handleClickAddPart = () => {
    const newObjectPart = {
      _id: new ObjectId().toString(),
      title: '🌟 Mẫu',
      content: [
        {
          _id: new ObjectId().toString(),
          context: 'Mẫu',
        },
      ],
    };
    setFormData((prev) => ({ ...prev, part: [...prev.part, newObjectPart] }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeacherImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-6">
      <div className="rounded-xl p-6 shadow-lg">
        {/* Header */}
        <h1 className="mb-6 text-center text-3xl font-bold">Chỉnh sửa thông tin giáo viên</h1>

        {/* Thông tin cơ bản */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">Tiêu đề</label>
            <input
              className="focus:ring-primary-to w-full rounded-lg border border-gray-300 p-3 focus:ring"
              type="text"
              name="titleFullname"
              value={formData.titleFullname}
              onChange={handleChangeInputMainFormData}
            />
          </div>
          <div>
            <label className="mb-2 block font-semibold">Môn giảng dạy</label>
            <input
              className="focus:ring-primary-to w-full rounded-lg border border-gray-300 p-3 focus:ring"
              type="text"
              name="teacherSubject"
              value={formData.teacherSubject}
              onChange={handleChangeInputMainFormData}
            />
          </div>
        </div>

        {/* Ảnh giáo viên */}
        <div className="mt-6">
          <p className="mb-2 font-semibold">Ảnh giáo viên</p>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={preview || formData.teacherImageLink}
              alt="Ảnh giáo viên"
              className="h-40 w-40 rounded-full object-cover shadow-md"
            />
            <input
              onChange={handleFileChange}
              type="file"
              name="teacherPhoto"
              accept="image/*"
              className="file:bg-primary-from hover:file:bg-primary-to text-gray-500 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-white"
            />
          </div>
        </div>

        {/* Bằng cấp */}
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">🎓 Bằng cấp</h2>
          {formData.degree.map((degreeItem) => (
            <input
              key={degreeItem._id}
              className="focus:ring-primary-to mb-3 w-full rounded-lg border border-gray-300 p-3 focus:ring"
              type="text"
              name={degreeItem._id}
              value={degreeItem.context}
              onChange={handleChangeDegree}
            />
          ))}
        </div>

        {/* Các phần nội dung */}
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-semibold">📌 Các phần nội dung</h2>
          {formData.part.map((partItem) => (
            <div key={partItem._id} className="rounded-lg border p-4 shadow-sm">
              <input
                type="text"
                className="mb-3 w-full border-b pb-2 text-xl font-semibold focus:ring"
                value={partItem.title}
                onChange={handleChangePartTitle}
                id={partItem._id}
              />
              {partItem.content.map((contentItem) => (
                <div key={contentItem._id} className="mb-3">
                  <textarea
                    className="w-full rounded-lg border p-3 focus:ring"
                    value={contentItem.context}
                    name={partItem._id + '_' + contentItem._id}
                    onChange={handleChangeContent}
                  />
                  <button
                    onClick={() => handleClickDeleteContentItem(partItem._id, contentItem._id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Xóa đoạn
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleClickAddContent(partItem._id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Thêm đoạn
              </button>
            </div>
          ))}

          <button
            onClick={handleClickAddPart}
            className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            + Thêm phần
          </button>
        </div>
      </div>

      {/* Nút lưu */}
      <div className="text-center">
        <button
          onClick={postChangeTeacherInfo}
          className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-lg px-6 py-3 text-lg font-semibold text-white shadow-lg"
        >
          Lưu thông tin
        </button>
      </div>
    </div>
  );
};
