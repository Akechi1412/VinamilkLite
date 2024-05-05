import { AdminLayout } from '../../components/layout';
import { newsCategoryApi } from '../../api';
import { useEffect, useState } from 'react';
import { Button, Input, NewsCategoryTable } from '../../components/admin';
import { Loading, SearchBar } from '../../components/admin';
import { Overlay } from '../../components/common';
import Swal from 'sweetalert2';
import CloseIcon from '../../assets/images/close-dark.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';
import { DraggableOrder } from '../../components/admin';

function AdminNewsCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [categoryRows, setCategoryRows] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [categoryList, setCategoryList] = useState(0);
  const [newCategoryList, setNewCategoryList] = useState([]);

  const fetchCategoryList = async () => {
    setLoading(true);
    try {
      const { data } = await newsCategoryApi.getCategories('_sort=cate_order');
      setCategoryList(data.rows);
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
  };

  const mutateCategories = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&name_like=${searchValue.trim()}`;
      }
      const { data: categoryData } = await newsCategoryApi.getCategories(paramString);
      setCategoryRows(categoryData.rows);
      setTotalPages(categoryData.pagination?.totalPages || 0);
      setTotalRows(categoryData.pagination?.totalRows || 0);
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

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const updateRequests = [];

      for await (const [index, category] of newCategoryList.entries()) {
        if (index !== category.cate_order) {
          const updateRequest = newsCategoryApi.update(category.id, {
            cate_order: index,
          });
          updateRequests.push(updateRequest);
        }
      }

      await Promise.all(updateRequests);
      setLoading(false);
      mutateCategories();
      fetchCategoryList();
      Swal.fire({
        icon: 'success',
        title: 'Thêm danh mục thành công!',
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
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên là bắt buộc').max(255, 'Tên có nhiều nhất 255 ký tự'),
      slug: Yup.string()
        .required('Slug là bắt buộc')
        .matches(/^[a-zA-Z0-9-]+$/, 'Slug chỉ bao gồm các ký tự a-z, A-Z, 0-9 và dấu gạch ngang')
        .max(255, 'Slug có nhiều nhất 255 ký tự'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let order = 0;
      if (categoryList.length > 0) {
        order = categoryList[categoryList.length - 1].cate_order + 1;
      }
      try {
        await newsCategoryApi.create({
          name: values.name.trim(),
          slug: values.slug.trim(),
          cate_order: order,
        });
        setLoading(false);
        mutateCategories();
        Swal.fire({
          icon: 'success',
          title: 'Thêm danh mục thành công!',
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
    fetchCategoryList();
  }, []);

  useEffect(() => {
    mutateCategories();
    return mutateCategories.cancel;
  }, [currentPage, searchValue]);

  return (
    <AdminLayout>
      <div className="container px-5 md:px-4">
        <div className="my-5 flex items-center space-x-4 sm:flex-col sm:items-start sm:space-x-0 sm:space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-[80px">
              <Button title="Thêm" handleClick={() => setShowAddForm(true)} />
            </div>
            <div className="w-[80px">
              <Button title="Chỉnh thứ tự" handleClick={() => setShowEditOrder(true)} />
            </div>
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
          <NewsCategoryTable categoryRows={categoryRows} handleMutate={mutateCategories} />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {categoryRows.length} trên tổng số {totalRows}
          </p>
          <ReactPaginate
            activeClassName={'border-none bg-blue-500 text-white'}
            breakClassName={'text-gray-500'}
            breakLabel={'...'}
            containerClassName={'flex items-center'}
            disabledLinkClassName={'cursor-default'}
            disabledClassName={'border-none bg-[#e5e5e5] text-gray-400'}
            marginPagesDisplayed={2}
            nextClassName={'border border-ghost mx-2 rounded text-gray-900'}
            nextLabel={'›'}
            onPageChange={handlePageChange}
            pageCount={totalPages}
            pageClassName={'rounded border border-ghost mx-2 text-gray-900'}
            pageRangeDisplayed={3}
            previousClassName={'border border-ghost mx-2 rounded text-gray-900'}
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
              <h4 className="text-2xl font-semibold">Thêm danh mục</h4>
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
                <label className="block text-gray-700 font-medium mb-2">Tên danh mục*</label>
                <Input
                  placeholder="Nhập tên danh mục*"
                  value={formik.values.name}
                  handleChange={formik.handleChange}
                  type="text"
                  name="name"
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.name}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Slug*</label>
                <Input
                  placeholder="Nhập slug của danh mục*"
                  value={formik.values.slug}
                  handleChange={formik.handleChange}
                  type="text"
                  name="slug"
                />
                {formik.errors.slug && formik.touched.slug && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.slug}</p>
                )}
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
      {showEditOrder && (
        <Overlay handleClickOut={() => {}}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Thay đổi thứ tự</h4>
              <img
                onClick={() => setShowEditOrder(false)}
                className="cursor-pointer w-5 h-5 object-cover"
                src={CloseIcon}
                alt="X"
              />
            </div>
            <div className="p-4">
              <DraggableOrder
                dataList={categoryList}
                onChange={(orderList) => setNewCategoryList(orderList)}
              />
              <div className="mt-4 w-[120px] sm-w-full">
                <Button title="Lưu thay đổi" handleClick={handleSubmitOrder} />
              </div>
            </div>
          </div>
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </AdminLayout>
  );
}

export default AdminNewsCategoriesPage;
