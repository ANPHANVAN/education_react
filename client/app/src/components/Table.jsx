import React from 'react';

// Định nghĩa kiểu cho columns
export const Table = ({ columns, data, handleUserId }) => {
  return (
    <div className="mx-5 my-1 overflow-auto">
      <table className="bg-bg min-w-full border-collapse rounded-lg shadow-md">
        <HeaderTable columns={columns} />
        <BodyTable data={data} columns={columns} handleUserId={handleUserId} />
      </table>
    </div>
  );
};

// Component tiêu đề bảng
const HeaderTable = ({ columns }) => {
  return (
    <thead>
      <tr className="max-h-8 bg-gray-300 text-gray-700">
        {columns.map((column, index) => (
          <th key={index} className="border-b border-gray-200 px-4 py-2 text-left font-semibold">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Component thân bảng
const BodyTable = ({ data, columns, handleUserId }) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={row._id || rowIndex}
          className="even:bg-tertiary hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => handleUserId(row._id)}
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className="border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap"
            >
              {column.render
                ? column.render(row)
                : column.accessor
                  ? getNestedValue(row, column.accessor)
                  : ''}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// Hàm hỗ trợ lấy giá trị lồng nhau (nested) từ object
const getNestedValue = (obj, accessor) => {
  return accessor.split('.').reduce((o, key) => (o && o[key] ? o[key] : ''), obj);
};
