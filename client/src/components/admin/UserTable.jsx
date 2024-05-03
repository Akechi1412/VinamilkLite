import PropTypes from 'prop-types';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { userApi } from '../../api';
import { Loading } from '../common';

function UserTable({ userRows, handleMutate }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);

  const getStatus = (banExpired) => {
    if (!banExpired) return 'Bình thường';

    const expiredTime = new Date(banExpired).getTime();
    const currentTime = new Date().getTime();
    if (expiredTime <= currentTime) {
      return 'Bình thường';
    }

    return 'Đã cấm';
  };

  const handleUnban = async (id) => {
    const result = await Swal.fire({
      title: 'Bỏ cấm người dùng này?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Ok',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await userApi.update(id, { ban_expired: -60 });
        setActionsExpandedId(null);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
        });
        handleMutate();
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    }
  };

  const handleBan = async (id) => {
    const result = await Swal.fire({
      title: 'Chọn thời gian cấm',
      input: 'select',
      inputOptions: {
        option1: '10 phút',
        option2: '1 tiếng',
        option3: '10 tiếng',
        option4: '1 ngày',
        option5: 'Vô thời hạn',
      },
      confirmButtonText: 'Chọn',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      setLoading(true);
      const SECOND_PER_MINUTE = 60;
      const SECOND_PER_HOUR = 60 * 60;
      let banExpiredTime = null;
      const option = result.value;
      switch (option) {
        case 'option1':
          banExpiredTime = 10 * SECOND_PER_MINUTE;
          break;
        case 'option2':
          banExpiredTime = 1 * SECOND_PER_HOUR;
          break;
        case 'option3':
          banExpiredTime = 10 * SECOND_PER_HOUR;
          break;
        case 'option4':
          banExpiredTime = 24 * SECOND_PER_HOUR;
          break;
        case 'option5':
          banExpiredTime = 20 * 365 * 24 * SECOND_PER_HOUR;
          break;
        default:
          console.log('Invalid options!');
      }

      try {
        await userApi.update(id, { ban_expired: banExpiredTime });
        setActionsExpandedId(null);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
        });
        handleMutate();
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    }
  };

  const handleEdit = (id) => {};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa thành viên này',
      text: 'Bạn sẽ không thể hoàn tác lại',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok, xóa đi',
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await userApi.delete(id);
        setActionsExpandedId(null);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
        });
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Họ</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tên</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Email</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Vai trò</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
            Ảnh đại diện
          </th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Trạng thái</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
            Ngày cập nhật
          </th>
          <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {userRows.map((user) => (
          <tr key={user.id}>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">{user.id}</td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">{user.last_name}</td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              {user.first_name}
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">{user.email}</td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              <img className="w-12 h-12 object-cover" src={user.avatar || DefaultAvatar} alt="" />
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              {getStatus(user.ban_expired)}
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              {user.created_at}
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              {user.updated_at}
            </td>
            <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
              <div className="h-full relative flex justify-center items-center">
                <div
                  onClick={() => setActionsExpandedId((id) => (user.id === id ? null : user.id))}
                  className={
                    'p-2' +
                    (user.role !== 'admin' ? ' cursor-pointer' : ' opacity-50 cursor-default')
                  }
                >
                  <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                </div>
                {actionsExpandedId === user.id && user.role !== 'admin' && (
                  <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                    <ul className="overflow-y-auto">
                      <li>
                        {getStatus(user.ban_expired) === 'Đã cấm' ? (
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-green-500 hover:bg-gray-50"
                          >
                            Bỏ cấm
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-yellow-500 hover:bg-gray-50"
                          >
                            Cấm
                          </button>
                        )}
                      </li>
                      <li>
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Sửa
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-red-500 hover:bg-gray-50"
                        >
                          Xóa
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {loading && <Loading fullScreen />}
    </table>
  );
}

UserTable.propTypes = {
  userRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
};

export default UserTable;
