import PropTypes from 'prop-types';
import DefaultProduct from '../../assets/images/default-product.png';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { firebaseApi, productApi, productImageApi } from '../../api';
import { Button, ImageSelector, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../assets/images/close-dark.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function ProductTable({ productRows, handleMutate, collectionList }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [productIdImages, setProductIdImages] = useState(null);
  const [productEdit, setProductEdit] = useState(null);
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState([]);

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 2 }],
        ['blockquote'],
        ['clean'],
      ],
    },
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      hidden: '0',
      price: '',
      salePrice: '',
      collectionId: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên là bắt buộc').max(255, 'Tên có nhiều nhất 255 ký tự'),
      slug: Yup.string()
        .required('Slug là bắt buộc')
        .matches(/^[a-zA-Z0-9-]+$/, 'Slug chỉ bao gồm các ký tự a-z, A-Z, 0-9 và dấu gạch ngang')
        .max(255, 'Slug có nhiều nhất 255 ký tự'),
      price: Yup.number().integer('Giá phải là số nguyên').min(0, 'Giá không được nhỏ hơn 0'),
      salePrice: Yup.number()
        .integer('Giá sale phải là số nguyên')
        .min(0, 'Giá sale không được nhỏ hơn 0'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let thumbnail = null;
      if (file) {
        const url = await firebaseApi.upload(file, `products/${Date.now()}_${file.name}`);
        thumbnail = url;
      }

      try {
        const data = {
          name: values.name.trim(),
          slug: values.slug.trim(),
          hidden: values.hidden,
        };
        if (thumbnail) {
          data.thumbnail = thumbnail;
        }
        if (description) {
          data.description = description;
        }
        if (values.price) {
          data.price = values.price;
        }
        if (values.collectionId) {
          data.collection_id = values.collectionId;
        }
        if (values.salePrice) {
          data.sale_price = values.salePrice;
        }
        await productApi.update(productEdit.id, data);
        setLoading(false);
        handleMutate();
        Swal.fire({
          icon: 'success',
          title: 'Sửa sản phẩm thành công!',
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

  const mutateProductImages = async () => {
    setLoading(true);
    try {
      const { data } = await productImageApi.getProductImages(`product_id=${productIdImages}`);
      setProductImages(data.rows);
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

  const handleDeleteImage = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa ảnh này',
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
        await productImageApi.delete(id);
        mutateProductImages();
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
    }
  };

  const handleSaveImage = async () => {
    setLoading(true);
    try {
      const url = await firebaseApi.upload(imageFile, `products/${Date.now()}_${imageFile.name}`);
      await productImageApi.create({ product_id: productIdImages, src: url });
      mutateProductImages();
      setImageFile(null);
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này',
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
        await productApi.delete(id);
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
    if (!productEdit) return;

    formik.setValues({
      name: productEdit.name || '',
      slug: productEdit.slug || '',
      hidden: productEdit.hidden.toString() || '0',
      price: productEdit.price || '',
      salePrice: productEdit.sale_price || '',
      collectionId: productEdit.collection_id || '',
    });
  }, [productEdit]);

  useEffect(() => {
    if (!productIdImages) return;

    (async () => {
      setLoading(true);
      try {
        const { data } = await productImageApi.getProductImages(`product_id=${productIdImages}`);
        setProductImages(data.rows);
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
  }, [productIdImages]);

  useEffect(() => {
    if (productEdit && productEdit.description) {
      setDescription(productEdit.description);
    }
  }, [productEdit]);

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Collection ID
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tên</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Slug</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thumbnail</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ẩn</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Giá</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Giá khuyến mãi
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ngày cập nhật
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {product.id}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                <p className="text-center">{product.collection_id || 'Chưa có'}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <p className="line-clamp-2">{product.name}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {' '}
                <p className="line-clamp-2">{product.slug}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <img
                  className="w-14 h-14 md:w-12 md:h-12 object-cover"
                  src={product.thumbnail || DefaultProduct}
                  alt=""
                />
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {product.hidden === 0 ? 'Không' : 'Có'}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                <p className="text-center"> {product.price || 0}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                <p className="text-center">{product.sale_price || 0}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {product.created_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {product.updated_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="h-full relative flex justify-center items-center">
                  <div
                    onClick={() =>
                      setActionsExpandedId((id) => (product.id === id ? null : product.id))
                    }
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === product.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto">
                        <li>
                          <button
                            onClick={() => setProductIdImages(product.id)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-green-500 hover:bg-gray-50"
                          >
                            Ảnh
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setProductEdit(product)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                          >
                            Sửa
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(product.id)}
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
      {productIdImages && (
        <Overlay handleClickOut={() => {}}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Ảnh sản phẩm</h4>
              <img
                onClick={() => setProductIdImages(null)}
                className="cursor-pointer w-5 h-5 object-cover"
                src={CloseIcon}
                alt="X"
              />
            </div>
            <div className="my-4">
              <div className="h-[150px] w-[300px] mx-auto">
                <ImageSelector handleSelect={(file) => setImageFile(file)} />
              </div>
              <div className="mx-auto w-[120px] mt-3">
                <Button handleClick={() => handleSaveImage()} title="Lưu ảnh" />
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ảnh</th>
                  <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {productImages.map((image) => (
                  <tr key={image.id}>
                    <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                      <div className="flex justify-center">
                        <img className="w-20 h-20 object-cover" src={image.src} alt="" />
                      </div>
                    </td>
                    <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="rounded px-4 py-2 bg-red-600 text-secondary"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Overlay>
      )}
      {productEdit && (
        <Overlay handleClickOut={() => setProductEdit(null)}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Sửa sản phẩm</h4>
              <img
                onClick={() => setProductEdit(null)}
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
                <label className="block text-gray-700 font-medium mb-2">Tên sản phẩm*</label>
                <Input
                  placeholder="Nhập tên sản phẩm*"
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
                  placeholder="Nhập slug của sản phẩm*"
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
                <label className="block text-gray-700 font-medium mb-2">Thumbnail sản phẩm</label>
                <div className="h-[150px] px-10">
                  <ImageSelector
                    handleSelect={(file) => setFile(file)}
                    initialImage={productEdit?.thumbnail || ''}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Giá sản phẩm</label>
                <Input
                  placeholder="Nhập giá của sản phẩm"
                  value={formik.values.price}
                  handleChange={formik.handleChange}
                  type="text"
                  name="price"
                />
                {formik.errors.price && formik.touched.price && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.price}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Giá khuyến mãi</label>
                <Input
                  placeholder="Nhập giá khuyến mãi của sản phẩm"
                  value={formik.values.salePrice}
                  handleChange={formik.handleChange}
                  type="text"
                  name="salePrice"
                />
                {formik.errors.salePrice && formik.touched.salePrice && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.salePrice}</p>
                )}
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Chọn ẩn sản phẩm</p>
                <div className="flex items-center space-x-4">
                  <input
                    id="hiddenTrue"
                    name="hidden"
                    type="radio"
                    value="1"
                    checked={formik.values.hidden === '1'}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="hiddenTrue" className="block text-gray-700 font-medium">
                    Có
                  </label>

                  <input
                    id="hiddenFalse"
                    name="hidden"
                    type="radio"
                    value="0"
                    checked={formik.values.hidden === '0'}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="hiddenFalse" className="block text-gray-700 font-medium">
                    Không
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Mô tả sản phẩm</p>
                <ReactQuill
                  theme="snow"
                  id="description"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Bộ sưu tập</label>
                <select
                  value={formik.values.collectionId}
                  onChange={formik.handleChange}
                  name="collectionId"
                  className="h-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="">--Chọn bộ sưu tập--</option>
                  {collectionList.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
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

ProductTable.propTypes = {
  productRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
  collectionList: PropTypes.array.isRequired,
};

export default ProductTable;
