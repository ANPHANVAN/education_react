import React, { useState } from 'react';
import { toast } from 'react-toastify';

const VITE_API_URL = process.env.VITE_API_URL;

const AdminIndex = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);

  // Xử lý change input cho form Set Role
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit form Set Role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, role } = formData;

    if (!username || !email || !role) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/admin/api/set-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(`Update Role Failure!, ${data.message}`);
        return;
      }
      toast.success('Update Role Success!');
      setIsSuccess(res.ok);
      setFormData({
        username: '',
        email: '',
        role: '',
      });
    } catch (err) {
      toast.error('Update Role Failure!');
      console.error(err);
    } finally {
      handleSearch(searchKeyword);
    }
  };

  // Xử lý tìm kiếm user
  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);

    if (!keyword) {
      setUsers([]);
      return;
    }

    try {
      const res = await fetch(
        `${VITE_API_URL}/admin/api/find-user?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm kiếm');
    }
  };

  return (
    <div className="adminIndex grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-2">
      {/* Form Set User Role */}
      <div className="w-full max-w-md rounded-lg p-6 shadow-lg">
        <h4 className="mb-4 text-center text-xl font-semibold">Set User Role</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block font-medium">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
              required
            >
              <option value="" disabled>
                -- Chọn role --
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-primary-from hover:bg-primary-to w-full cursor-pointer rounded p-2 text-white"
          >
            Set Role
          </button>
        </form>
      </div>

      {/* Tìm kiếm user */}
      <div className="w-full max-w-md rounded-lg p-6 shadow-lg lg:h-[calc(100vh-3.5rem)] lg:overflow-auto">
        <h4 className="mb-4 text-center text-xl font-semibold">
          Tìm Kiếm User bằng username hoặc email
        </h4>
        <input
          type="text"
          id="searchInput"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value.trim())}
          className="w-full rounded border p-2"
          placeholder="Nhập username hoặc email"
        />
        <ul className="mt-4 divide-y rounded border">
          {users.map((user) => (
            <li key={user._id} className="flex items-center justify-between p-3">
              <div>
                <strong>{user.fullname}</strong> ({user.username}) - {user.role}
                <br />
                <small>{user.email}</small>
              </div>
              <a
                target="_blank"
                href={`${VITE_API_URL}/admin/api/get-one-user?id=${user._id}`}
                className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-300"
              >
                Chi tiết
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminIndex;
