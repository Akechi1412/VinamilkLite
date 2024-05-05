import { AdminLayout } from '../../components/layout';
import { newsCategoryApi, firebaseApi, newsApi } from '../../api';
import { useEffect, useState } from 'react';
import { Button, ImageSelector, Input, NewsTable } from '../../components/admin';
import { Loading, SearchBar } from '../../components/admin';
import { Overlay } from '../../components/common';
import Swal from 'sweetalert2';
import CloseIcon from '../../assets/images/close-dark.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AdminNewsPage() {
  const [loading, setLoading] = useState(false);
  const [newsRows, setNewsRows] = useState([]);
  const [newsCategoryList, setNewsCategoryList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };
  const mutateNews = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&title_like=${searchValue.trim()}`;
      }
      const { data: newsData } = await newsApi.getNews(paramString);
      setNewsRows(newsData.rows);
      setTotalPages(newsData.pagination?.totalPages || 0);
      setTotalRows(newsData.pagination?.totalRows || 0);
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

  const formik = useFormik({
    initialValues: {
      title: '',
      slug: '',
      status: 'hidden',
      salePrice: 'category_id',
      categoryId: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .required('Tiêu đề là bắt buộc')
        .max(30, 'Tiêu đề có nhiều nhất 255 ký tự'),
      slug: Yup.string()
        .required('Slug là bắt buộc')
        .matches(/^[a-zA-Z0-9-]+$/, 'Slug chỉ bao gồm các ký tự a-z, A-Z, 0-9 và dấu gạch ngang')
        .max(255, 'Slug có nhiều nhất 255 ký tự'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let thumbnail = null;
      if (file) {
        const url = await firebaseApi.upload(file, `news/${Date.now()}_${file.name}`);
        thumbnail = url;
      }

      try {
        await newsApi.create({
          title: values.title.trim(),
          slug: values.slug.trim(),
          thumbnail,
          status: values.status,
          content: content.trim(),
          category_id: values.categoryId || undefined,
        });
        setLoading(false);
        mutateNews();
        Swal.fire({
          icon: 'success',
          title: 'Thêm tin tức thành công!',
        });
      } catch (error) {
        console.log(error);
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
    (async () => {
      setLoading(true);
      try {
        const { data: newsCategoryData } = await newsCategoryApi.getCategories();
        setNewsCategoryList(newsCategoryData.rows);
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

  const handlePageChange = (event) => {
    setCurrentPage(event.selected + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    mutateNews();
    return mutateNews.cancel;
  }, [currentPage, searchValue]);

  return (
    <AdminLayout>
      <div className="container px-5 md:px-4 mb-8 md:mb-5">
        <div className="my-5 flex items-center space-x-4 sm:flex-col sm:items-start sm:space-x-0 sm:space-y-4">
          <div className="w-[80px">
            <Button handleClick={() => setShowAddForm(true)} title="Thêm" />
          </div>
          <div className="w-[320px] sm:w-full">
            <SearchBar
              placeholder="Tìm theo tiêu đề..."
              value={searchValue}
              handleChange={(event) => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <NewsTable
            newsRows={newsRows}
            handleMutate={mutateNews}
            newsCategoryList={newsCategoryList}
          />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {newsRows.length} trên tổng số {totalRows}
          </p>
          <ReactPaginate
            activeClassName={'border-none bg-blue-500 text-white'}
            breakClassName={'text-gray-500'}
            breakLabel={'...'}
            containerClassName={'flex items-center'}
            disabledLinkClassName={'cursor-default'}
            disabledClassName={'border-none bg-[#e5e5e5] cursor-default text-gray-400'}
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
          <div className="ml-auto bg-secondary min-h-full w-[1000px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Thêm tin tức</h4>
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
                <label className="block text-gray-700 font-medium mb-2">Tiêu đề*</label>
                <Input
                  placeholder="Nhập tiêu đề tin tức*"
                  value={formik.values.title}
                  handleChange={formik.handleChange}
                  type="text"
                  name="title"
                />
                {formik.errors.title && formik.touched.title && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.title}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Slug*</label>
                <Input
                  placeholder="Nhập slug của tin tức*"
                  value={formik.values.slug}
                  handleChange={formik.handleChange}
                  type="text"
                  name="slug"
                />
                {formik.errors.slug && formik.touched.slug && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.slug}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Thumbnail tin tức</label>
                <div className="h-[150px] px-10">
                  <ImageSelector handleSelect={(file) => setFile(file)} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Trạng thái</p>
                <div className="flex items-center space-x-4">
                  <input
                    id="hidden"
                    name="status"
                    type="radio"
                    value="hidden"
                    checked={formik.values.status === 'hidden'}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="hidden" className="block text-gray-700 font-medium">
                    Ẩn
                  </label>

                  <input
                    id="published"
                    name="status"
                    type="radio"
                    value="published"
                    checked={formik.values.status === 'published'}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="published" className="block text-gray-700 font-medium">
                    Công khai
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Nội dung</p>
                <ReactQuill
                  theme="snow"
                  id="content"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Danh mục</label>
                <select
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  name="categoryId"
                  className="h-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="">--Chọn danh mục--</option>
                  {newsCategoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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

export default AdminNewsPage;
