import { useState } from 'react';

const QuestionItem = ({ answer, formData, setFormData, index }) => {
  const handleChangeInput = (type, part, number, answer) => {
    setFormData((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.type == type && item.part == part && item.number == number
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].answer = answer;
        return updated;
      } else {
        return [...prev, { type: type, part: part, number: number, answer: answer }];
      }
    });
  };

  // Lấy đáp án đã lưu sẵn cho câu hỏi này
  const savedAnswer =
    formData.find(
      (item) =>
        item.type === answer.type && item.part === answer.part && item.number === answer.number
    )?.answer || '';

  return (
    <div className="questionItem mb-2 rounded-2xl p-3 shadow-xl">
      <p className="part font-bold">
        Phần {answer.part} - Câu {answer.number}
      </p>
      <div className="questionInput">
        {answer.type === 'abcd' &&
          ['A', 'B', 'C', 'D'].map((letter) => {
            const nameInput = `${answer.part}_${answer.number}`;
            return (
              <label key={letter} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={nameInput}
                  value={letter}
                  checked={savedAnswer === letter}
                  className="cursor-pointer accent-blue-500"
                  onChange={(e) =>
                    handleChangeInput(answer.type, answer.part, answer.number, e.target.value)
                  }
                />
                <span>{letter}</span>
              </label>
            );
          })}

        {answer.type === 'truefalse' &&
          ['true', 'false'].map((valueTrueFalse) => {
            const nameInput = `${answer.part}_${answer.number}`;
            return (
              <label key={valueTrueFalse} className="mb-1 flex items-center capitalize">
                <input
                  type="radio"
                  name={nameInput}
                  value={valueTrueFalse}
                  checked={savedAnswer === valueTrueFalse}
                  className="mr-2 cursor-pointer accent-green-500"
                  onChange={(e) =>
                    handleChangeInput(answer.type, answer.part, answer.number, e.target.value)
                  }
                />
                {valueTrueFalse == 'true' ? 'Đúng' : 'Sai'}
              </label>
            );
          })}

        {answer.type === 'value' && (
          <input
            type="text"
            placeholder="Nhập đáp án"
            className="w-full rounded border px-3 py-2"
            name={`${answer.part}_${answer.number}`}
            value={savedAnswer}
            onChange={(e) =>
              handleChangeInput(answer.type, answer.part, answer.number, e.target.value)
            }
          />
        )}
      </div>
    </div>
  );
};

export default QuestionItem;
