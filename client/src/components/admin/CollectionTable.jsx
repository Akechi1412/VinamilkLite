import PropTypes from 'prop-types';
import Default from '../../assets/images/default.jpg';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { firebaseApi, collectionApi } from '../../api';
import { Button, ImageSelector, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../assets/images/close-dark.svg';

function CollectionTable({ collectionRows, handleMutate }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [collectionEdit, setCollectionEdit] = useState(null);
  const [file, setFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      order: '',
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
      let image = null;
      if (file) {
        const url = await firebaseApi.upload(file, `collections/${Date.now()}_${file.name}`);
        image = url;
      }

      try {
        const data = {
          name: values.name.trim(),
          slug: values.slug.trim(),
        };
        if (image) {
          data.image = image;
        }
        await collectionApi.update(collectionEdit.id, data);
        setLoading(false);
        handleMutate();
        Swal.fire({
          icon: 'success',
          title: 'Sửa bộ sưu tập thành công!',
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa bộ sưu tập này',
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
        await collectionApi.delete(id);
        handleMutate();
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
    if (!collectionEdit) return;

    formik.setValues({
      name: collectionEdit.name || '',
      slug: collectionEdit.slug || '',
    });
  }, [collectionEdit]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tên</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Slug</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thứ tự</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ảnh đại diện
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ngày cập nhật
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {collectionRows.map((collection) => (
            <tr key={collection.id}>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {collection.id}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {collection.name}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {collection.slug}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {collection.collection_order}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="flex justify-center">
                  <img
                    className="w-14 h-14 md:w-12 md:h-12 object-cover"
                    src={collection.image || Default}
                    alt=""
                  />
                </div>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {collection.created_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {collection.updated_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="h-full relative flex justify-center items-center">
                  <div
                    onClick={() =>
                      setActionsExpandedId((id) => (collection.id === id ? null : collection.id))
                    }
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === collection.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto">
                        <li>
                          <button
                            onClick={() => setCollectionEdit(collection)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                          >
                            Sửa
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(collection.id)}
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
      {collectionEdit && (
        <Overlay handleClickOut={() => setCollectionEdit(null)}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Sửa bộ sưu tập</h4>
              <img
                onClick={() => setCollectionEdit(null)}
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
                <label className="block text-gray-700 font-medium mb-2">Tên bộ sưu tập*</label>
                <Input
                  placeholder="Nhập tên bộ sưu tập*"
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
                  placeholder="Nhập slug của bộ sưu tập*"
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
                <label className="block text-gray-700 font-medium mb-2">Ảnh đại diện</label>
                <div className="h-[150px] px-10">
                  <ImageSelector
                    handleSelect={(file) => setFile(file)}
                    initialImage={collectionEdit.image || ''}
                  />
                </div>
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

CollectionTable.propTypes = {
  collectionRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
};

export default CollectionTable;
