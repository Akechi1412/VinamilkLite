import { AdminLayout } from '../../components/layout';
import { firebaseApi, userApi } from '../../api';
import { useEffect, useState } from 'react';
import { Button, ImageSelector, Input, UserTable } from '../../components/admin';
import { Loading, SearchBar } from '../../components/admin';
import { Overlay } from '../../components/common';
import Swal from 'sweetalert2';
import CloseIcon from '../../assets/images/close-dark.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';

function AdminUsersPage() {
  const [loading, setLoading] = useState(false);
  const [userRows, setUserRows] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [file, setFile] = useState(null);

  const mutateUsers = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&first_name_like=${searchValue.trim()}`;
      }
      const { data: userData } = await userApi.getUsers(paramString);
      setUserRows(userData.rows);
      setTotalPages(userData.pagination?.totalPages || 0);
      setTotalRows(userData.pagination?.totalRows || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  }, 500);

  const handlePageChange = (event) => {
    setCurrentPage(event.selected + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

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
        .required('Mật khẩu là bắt buộc')
        .matches(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
          'Mật khẩu phải có ít nhất 8 ký tự, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt'
        )
        .max(20, 'Mật khẩu dài tối đa 20 ký tự'),
      confirmPassword: Yup.string()
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp'),
      email: Yup.string().required('Email là bắt buộc').email('Hãy nhập đúng định dạng email'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let avatar = null;
      if (file) {
        const url = await firebaseApi.upload(file, `users/${Date.now()}_${file.name}`);
        avatar = url;
      }

      try {
        await userApi.create({
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          email: values.email.trim(),
          password: values.password,
          avatar,
          role: values.role,
        });
        setLoading(false);
        mutateUsers();
        Swal.fire({
          icon: 'success',
          title: 'Thêm người dùng thành công!',
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

  useEffect(() => {
    mutateUsers();
    return mutateUsers.cancel;
  }, [currentPage, searchValue]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: userData } = await userApi.getUsers(`_page=${currentPage}`);
        setUserRows(userData.rows);
        setTotalPages(userData.pagination?.totalPages || 0);
        setTotalRows(userData.pagination?.totalRows || 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="container px-5 md:px-4">
        <div className="my-5 flex items-center space-x-4 sm:flex-col sm:items-start sm:space-x-0 sm:space-y-4">
          <div className="w-[80px">
            <Button title="Thêm" handleClick={() => setShowAddForm(true)} />
          </div>
          <div className="w-[320px] sm:w-full">
            <SearchBar
              placeholder="Tìm theo tên..."
              value={searchValue}
              handleChange={(event) => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <UserTable userRows={userRows} handleMutate={mutateUsers} />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {userRows.length} trên tổng số {totalRows}
          </p>
          <ReactPaginate
            activeClassName={'border-none bg-blue-500 text-white'}
            breakClassName={'break-me '}
            breakLabel={'...'}
            containerClassName={'flex items-center'}
            disabledClassName={'border-none bg-[#e4e4e4] cursor-default'}
            marginPagesDisplayed={2}
            nextClassName={'border border-ghost mx-2 rounded'}
            nextLabel={'›'}
            onPageChange={handlePageChange}
            pageCount={totalPages}
            pageClassName={'rounded border border-ghost mx-2'}
            pageRangeDisplayed={3}
            previousClassName={'border border-ghost mx-2 rounded'}
            previousLabel={'‹'}
            previousLinkClassName={'block p-2'}
            nextLinkClassName={'block p-2'}
            pageLinkClassName={'block p-2 border rounded'}
          />
        </div>
      </div>
      {showAddForm && (
        <Overlay handleClickOut={() => {}}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Thêm người dùng</h4>
              <img
                onClick={() => setShowAddForm(false)}
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
                <label className="block text-gray-700 font-medium mb-2">Mật khẩu*</label>
                <Input
                  placeholder="Nhập mật khẩu*"
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
                <label className="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu*</label>
                <Input
                  placeholder="Nhập lại mật khẩu*"
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
    </AdminLayout>
  );
}

export default AdminUsersPage;
