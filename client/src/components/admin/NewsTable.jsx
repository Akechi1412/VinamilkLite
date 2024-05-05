import PropTypes from 'prop-types';
import DefaultNews from '../../assets/images/default.jpg';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { firebaseApi, newsApi } from '../../api';
import { Button, ImageSelector, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../assets/images/close-dark.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function NewsTable({ newsRows, handleMutate, newsCategoryList }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [newsEdit, setNewsEdit] = useState(null);
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
        .max(255, 'Tiêu đề có nhiều nhất 255 ký tự'),
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
        const data = {
          title: values.title.trim(),
          slug: values.slug.trim(),
          status: values.status,
          content: content.trim(),
        };
        if (thumbnail) {
          data.thumbnail = thumbnail;
          data.category_id = values.category_id;
        }
        await newsApi.update(newsEdit.id, data);
        setLoading(false);
        handleMutate();
        Swal.fire({
          icon: 'success',
          title: 'Sửa tin tức thành công!',
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa tin tức này',
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
        await newsApi.delete(id);
        setActionsExpandedId(null);
        handleMutate();
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
    if (newsEdit && newsEdit.content) {
      setContent(newsEdit.content);
    }
  }, [newsEdit]);

  useEffect(() => {
    if (!newsEdit) return;

    formik.setValues({
      title: newsEdit.title || '',
      slug: newsEdit.slug || '',
      status: newsEdit.status || 'hidden',
      categoryId: newsEdit.category_id || '',
    });
  }, [newsEdit]);

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Category ID
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tiêu đề</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Slug</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thumbnail</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Trạng thái
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tác giả</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ngày cập nhật
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {newsRows.map((news) => (
            <tr key={news.id}>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {news.id}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <p className="text-center">{news.category_id || 'Chưa có'}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="line-clamp-2">{news.title}</div>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="line-clamp-2">{news.slug}</div>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="flex justify-center">
                  <img
                    className="w-14 h-14 md:w-12 md:h-12 object-cover"
                    src={news.thumbnail || DefaultNews}
                    alt=""
                  />
                </div>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {news.status === 'hidden' && 'Ẩn'}
                {news.dvistatus === 'published' && 'Công khai'}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {news.author_id}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {news.created_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {news.updated_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="h-full relative flex justify-center items-center">
                  <div
                    onClick={() => setActionsExpandedId((id) => (news.id === id ? null : news.id))}
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === news.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto">
                        <li>
                          <button
                            onClick={() => setNewsEdit(news)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                          >
                            Sửa
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(news.id)}
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
      {newsEdit && (
        <Overlay handleClickOut={() => setNewsEdit(null)}>
          {console.log(newsEdit)}
          <div className="ml-auto bg-secondary min-h-full w-[1000px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Sửa tin tức</h4>
              <img
                onClick={() => setNewsEdit(null)}
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
                  <ImageSelector
                    handleSelect={(file) => setFile(file)}
                    initialImage={newsEdit.thumbnail || ''}
                  />
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
    </>
  );
}

NewsTable.propTypes = {
  newsRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
  newsCategoryList: PropTypes.array.isRequired,
};

export default NewsTable;
