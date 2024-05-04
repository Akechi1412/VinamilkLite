import PropTypes from 'prop-types';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { firebaseApi, userApi } from '../../api';
import { Button, ImageSelector, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../assets/images/close-dark.svg';

function UserTable({ userRows, handleMutate }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [userEdit, setUserEdit] = useState(null);
  const [file, setFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      email: '',
      role: 'subscriber',
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .required('Tên là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Tên không được chứa số hoặc ký tự đặc biệt'
        )
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(30, 'Tên có nhiều nhất 30 ký tự'),
      lastName: Yup.string()
        .required('Họ là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Họ không được chứa số hoặc ký tự đặc biệt'
        )
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(30, 'Tên có nhiều nhất 30 ký tự'),
      password: Yup.string()
        .matches(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
          'Mật khẩu phải có ít nhất 8 ký tự, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt'
        )
        .max(20, 'Mật khẩu dài tối đa 20 ký tự'),
      confirmPassword: Yup.string().when('password', {
        is: (password) => !!password,
        then: Yup.string()
          .required('Vui lòng nhập lại mật khẩu')
          .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp'),
      }),
      email: Yup.string().required('Email là bắt buộc').email('Hãy nhập đúng định dạng email'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let avatar = null;
      if (file) {
        const url = await firebaseApi.upload(file, `users/${Date.now()}_${file.name}`);
        avatar = url;
      }

      const data = {
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        role: values.role,
      };
      if (values.password) {
        data.password = values.password;
      }
      if (values.avatar) {
        data.avatar = avatar;
      }
      try {
        await userApi.update(userEdit.id, data);
        setLoading(false);
        handleMutate();
        Swal.fire({
          icon: 'success',
          title: 'Sửa dùng thành công!',
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
    },
    onReset: () => {
      formik.setValues(formik.initialValues);
    },
  });

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

  useEffect(() => {
    if (!userEdit) return;

    formik.setValues({
      firstName: userEdit.first_name,
      lastName: userEdit.last_name,
      password: '',
      confirmPassword: '',
      email: userEdit.email || '',
      role: userEdit.role || 'subscriber',
    });
  }, [userEdit]);

  return (
    <>
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
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Trạng thái
            </th>
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
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {user.last_name}
              </td>
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
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === user.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto">
                        <li>
                          {user.role !== 'admin' && (
                            <>
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
                            </>
                          )}
                        </li>
                        <li>
                          <button
                            onClick={() => setUserEdit(user)}
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
      </table>
      {userEdit && (
        <Overlay handleClickOut={() => setUserEdit(null)}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Sửa người dùng</h4>
              <img
                onClick={() => setUserEdit(null)}
                className="cursor-pointer w-5 h-5 object-cover"
                src={CloseIcon}
                alt="X"
              />
            </div>
            <form
              method="post"
              action=""
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}
            >
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Họ và tên đệm*</label>
                <Input
                  placeholder="Nhập họ và tên đệm*"
                  value={formik.values.lastName}
                  handleChange={formik.handleChange}
                  type="text"
                  name="lastName"
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.lastName}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Tên*</label>
                <Input
                  placeholder="Nhập tên*"
                  value={formik.values.firstName}
                  handleChange={formik.handleChange}
                  type="text"
                  name="firstName"
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.firstName}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Email*</label>
                <Input
                  placeholder="Nhập email*"
                  value={formik.values.email}
                  handleChange={formik.handleChange}
                  type="text"
                  name="email"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.email}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
                <Input
                  placeholder="Nhập mật khẩu"
                  value={formik.values.password}
                  handleChange={formik.handleChange}
                  type="password"
                  name="password"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.password}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu</label>
                <Input
                  placeholder="Nhập lại mật khẩu"
                  value={formik.values.confirmPassword}
                  handleChange={formik.handleChange}
                  type="password"
                  name="confirmPassword"
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.confirmPassword}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Ảnh đại diện</label>
                <div className="h-[150px] px-10">
                  <ImageSelector handleSelect={(file) => setFile(file)} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Vai trò</label>
                <select
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  name="role"
                  className="h-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="subscriber">Thành viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div className="mt-6 flex space-x-2">
                <div className="flex-1">
                  <Button title="Reset" type="reset" />
                </div>
                <div className="flex-1">
                  <Button title="Xác nhận" type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </>
  );
}

UserTable.propTypes = {
  userRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
};

export default UserTable;
