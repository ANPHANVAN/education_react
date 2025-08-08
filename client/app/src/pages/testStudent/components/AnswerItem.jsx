const AnswerItem = ({ answer }) => {
  const isAnswered = answer.answer && answer.answer.trim() !== '';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-1 text-sm font-medium text-gray-500">
        Phần {answer.part} - Câu {answer.number}
      </div>
      <div className="text-base text-gray-800">
        <span className="font-semibold">Đáp án của bạn:</span>{' '}
        {isAnswered ? (
          <span className="text-blue-600">{answer.answer}</span>
        ) : (
          <span className="text-red-500 italic">Chưa trả lời</span>
        )}
      </div>
    </div>
  );
};

export default AnswerItem;
