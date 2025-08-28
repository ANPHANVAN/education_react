import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VITE_API_URL = process.env.VITE_API_URL;

const EditProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`${VITE_API_URL}/me/api/get-user-info`);
      const data = await res.json();
      setUser(data.userInfo);
      setOriginalData(data.userInfo);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Không thể tải thông tin người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser(originalData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${VITE_API_URL}/me/api/${userId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname: user.fullname }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Cập nhật thành công!');
        setUser(result.updatedUser || user);
        setOriginalData(result.updatedUser || user);
        setIsEditing(false);
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Lỗi khi cập nhật hồ sơ.');
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-red-500">
        Không tìm thấy người dùng.
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="mb-8 text-center text-3xl font-bold">Edit Profile</h2>

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-[10px_10px_20px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSave}>
          {/* Fullname */}
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={user.fullname || ''}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full rounded-lg border px-4 py-2 text-black focus:outline-none ${
                isEditing
                  ? 'border-blue-400 focus:ring-2 focus:ring-blue-500'
                  : 'border-gray-300 bg-gray-100'
              }`}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={user.username || ''}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-black"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ''}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="bg-primary-from hover:bg-primary-to flex items-center rounded-lg px-4 py-2 font-semibold text-white"
              >
                ✏️ Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  type="submit"
                  className="flex items-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                >
                  💾 Lưu
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
