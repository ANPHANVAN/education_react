import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Folder = () => {
  const tableColumn = [
    { header: 'Tên Gợi Nhớ' },
    { header: 'Tên File' },
    { header: 'Ngày Tải Lên' },
    { header: 'Xem File' },
  ];
  const [loading, setLoading] = useState(true);
  const { classId } = useParams();
  const [listFolder, setListFolder] = useState([]);
  // Fetch list data from API
  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/folder/api/folder-teacher/${classId}/get-files`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const data = await response.json();
      setListFolder(data);
      return;
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  return (
    <div className="">
      {loading && <MiniLoading />}
      <div className="mt-2 mb-4 flex items-center justify-between">
        <div className="text-xl">Danh sách Tài Liệu</div>
      </div>
      <div className="table w-full">
        <table className="bg-bg min-w-full border-collapse rounded-lg whitespace-nowrap shadow-md">
          <thead>
            <tr className="max-h-8 bg-gray-300 text-gray-700">
              {tableColumn.map((column, index) => (
                <th
                  key={index}
                  className="border-b border-gray-200 px-4 py-2 text-left font-semibold"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {listFolder?.map((file, index) => {
              return (
                <tr key={index + 1}>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {file.title}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {file.file_origin_name}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <a href={file.url_file} target="_blank" className="">
                      <button className="link bg-primary-from min-w-12 cursor-pointer rounded-lg px-3 py-1 text-sm font-bold text-white">
                        Xem File
                      </button>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Folder;
