import React from 'react';

const TeacherInfo = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {/* Tiêu đề */}
        <h1 className="text-center text-3xl font-bold text-gray-800">Thầy Huỳnh Đăng Phong</h1>
        <p className="mt-2 text-center text-gray-500">Giáo viên môn Toán học</p>

        <div className="my-6 border-t"></div>

        {/* Thông tin cá nhân */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>👤 Họ và tên:</strong> Huỳnh Đăng Phong
            </p>
            <p>
              <strong>🎓 Bằng cấp:</strong> Cử nhân Công Nghệ Thông Tin - Đại học Sư phạm TP.HCM
            </p>
            <p>
              <strong>🎓 Bằng cấp:</strong> Cử nhân Sư phạm Toán - Đại học Sư phạm TP.HCM
            </p>
            <p>
              <strong>📍 Giảng dạy:</strong> Môn Toán Cấp 2 & Cấp 3
            </p>
          </div>
          <div>
            <img
              src="/uploads/thay-huynh-dang-phong.jpeg"
              alt="Ảnh giáo viên"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Tâm huyết nghề nghiệp */}
        <h2 className="mt-10 text-2xl font-semibold text-gray-800">🌟 Tâm huyết nghề nghiệp</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          Là một giáo viên giảng dạy môn Toán học từ lớp 6 đến lớp 12, tôi – thầy Huỳnh Đăng Phong –
          luôn trăn trở với câu hỏi:
          <em className="text-gray-600">
            “Làm thế nào để theo sát quá trình học tập của từng học sinh một cách hiệu quả và khoa
            học hơn?”
          </em>
        </p>

        {/* Những vấn đề */}
        <h2 className="mt-8 text-2xl font-semibold text-gray-800">
          🔍 Những vấn đề trong thực tiễn giảng dạy
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
          <li>
            Việc theo dõi tiến độ học tập, kết quả bài kiểm tra, và mức độ hiểu bài của học sinh
            thường bị rời rạc và thiếu hệ thống.
          </li>
          <li>
            Giáo viên mất nhiều thời gian ghi chép sổ sách thủ công, gây khó khăn trong việc đánh
            giá sự tiến bộ của học sinh.
          </li>
          <li>
            Phụ huynh khó nắm bắt tình hình học tập của con em mình một cách kịp thời và chính xác.
          </li>
        </ul>

        {/* Giải pháp */}
        <h2 className="mt-8 text-2xl font-semibold text-gray-800">✅ Hướng giải quyết</h2>
        <p className="mt-3 text-gray-700">
          Từ những vấn đề trên, tôi đã phát triển một hệ thống quản lý học sinh cá nhân với các mục
          tiêu:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
          <li>
            Theo dõi sát sao quá trình học: điểm kiểm tra, bài tập, tiến độ chuyên đề và nhận xét cá
            nhân.
          </li>
          <li>
            Tổng hợp dữ liệu học tập bằng bảng biểu và biểu đồ giúp đánh giá hiệu quả học tập.
          </li>
          <li>Tạo cầu nối giữa giáo viên – học sinh – phụ huynh, phối hợp hỗ trợ hiệu quả.</li>
          <li>
            Tiết kiệm thời gian quản lý, tập trung vào chất lượng giảng dạy và thiết kế học liệu phù
            hợp.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherInfo;
