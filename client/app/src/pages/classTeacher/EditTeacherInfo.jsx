import { useState, useEffect } from 'react';
import { MiniLoading } from '../../components';
import { useParams } from 'react-router-dom';
import { ObjectId } from 'bson';

const VITE_API_URL = process.env.VITE_API_URL;

export const EditTeacherInfo = () => {
  const { classId } = useParams();
  const [formData, setFormData] = useState({
    titleFullname: 'Thầy Huỳnh Đăng Phong',
    teacherSubject: 'Giáo viên môn Toán học',
    fullname: 'Huỳnh Đăng Phong',
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
    console.log('get Teacher Info');
    // setFormData()
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
  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {/* Tiêu đề */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          <input
            type="text"
            name="titleFullname"
            id="titleFullname"
            value={formData.titleFullname}
            onChange={handleChangeInputMainFormData}
          />
        </h1>
        <p className="mt-2 text-center text-gray-500">
          <input
            type="text"
            name="teacherSubject"
            id="teacherSubject"
            value={formData.teacherSubject}
            onChange={handleChangeInputMainFormData}
          />
        </p>

        <div className="my-6 border-t"></div>

        {/* Thông tin cá nhân */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>👤 Họ và tên:</strong>
              <input
                className="w-full"
                type="text"
                name="fullname"
                id="fullname"
                value={formData.fullname}
                onChange={handleChangeInputMainFormData}
              />
            </p>
            {formData.degree.map((degreeItem) => {
              return (
                <p key={degreeItem._id}>
                  <strong>
                    🎓 Bằng cấp:
                    <input
                      className="w-full"
                      type="text"
                      name={degreeItem._id}
                      id={'degree_' + degreeItem._id}
                      value={degreeItem.context}
                      onChange={handleChangeDegree}
                    />
                  </strong>
                </p>
              );
            })}
          </div>
          <div>
            <img
              src="/uploads/thay-huynh-dang-phong.jpeg"
              alt="Ảnh giáo viên"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>

        {formData.part?.map((partItem) => {
          return (
            <div key={partItem._id} className="part">
              <h2 className="mt-10 text-2xl font-semibold text-gray-800">
                <input
                  type="text"
                  name={'part.title' + '_' + partItem._id}
                  id={partItem._id}
                  value={partItem.title}
                  className="w-full"
                  onChange={handleChangePartTitle}
                />
              </h2>
              <button
                className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-2xl px-3 py-1 shadow"
                onClick={() => handleClickDeletePart(partItem._id)}
              >
                Xóa Phần
              </button>
              <button
                className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-2xl px-3 py-1 shadow"
                onClick={() => handleClickAddContent(partItem._id)}
              >
                Thêm Đoạn
              </button>
              {partItem.content.map((contentItem) => {
                return (
                  <div key={contentItem._id} className="partItem">
                    <p className="mt-3 leading-relaxed text-gray-700">
                      <textarea
                        type="text"
                        name={partItem._id + '_' + contentItem._id}
                        id={partItem._id + '_' + contentItem._id}
                        value={contentItem.context}
                        className="w-full"
                        onChange={handleChangeContent}
                      />
                    </p>
                    <button
                      onClick={() => handleClickDeleteContentItem(partItem._id, contentItem._id)}
                      className="deleteContentItem bg-primary-from hover:bg-primary-to cursor-pointer rounded-2xl px-3 py-1 shadow"
                    >
                      Xóa Đoạn
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
        <button
          className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-2xl px-3 py-1 shadow"
          onClick={handleClickAddPart}
        >
          Thêm Phần
        </button>
      </div>
    </div>
  );
};
