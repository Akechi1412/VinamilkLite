import { AdminLayout } from '../../components/layout';
import { collectionApi, firebaseApi, productApi } from '../../api';
import { useEffect, useState } from 'react';
import { Button, ImageSelector, Input, ProductTable } from '../../components/admin';
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

function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  const [productRows, setProductRows] = useState([]);
  const [collectionList, setCollectionlist] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
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

  const mutateProducts = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&name_like=${searchValue.trim()}`;
      }
      const { data: productData } = await productApi.getProducts(paramString);
      setProductRows(productData.rows);
      setTotalPages(productData.pagination?.totalPages || 0);
      setTotalRows(productData.pagination?.totalRows || 0);
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
        await productApi.create({
          name: values.name.trim(),
          slug: values.slug.trim(),
          thumbnail,
          hidden: values.hidden,
          description: description.trim(),
          price: values.price,
          sale_price: values.salePrice,
          collection_id: values.collectionId || undefined,
        });
        setLoading(false);
        mutateProducts();
        Swal.fire({
          icon: 'success',
          title: 'Thêm sản phẩm thành công!',
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
        const { data: collectionData } = await collectionApi.getCollections();
        setCollectionlist(collectionData.rows);
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
    mutateProducts();
    return mutateProducts.cancel;
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
              placeholder="Tìm theo tên..."
              value={searchValue}
              handleChange={(event) => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <ProductTable
            productRows={productRows}
            handleMutate={mutateProducts}
            collectionList={collectionList}
          />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {productRows.length} trên tổng số {totalRows}
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
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Thêm sản phẩm</h4>
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
                  <ImageSelector handleSelect={(file) => setFile(file)} />
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
    </AdminLayout>
  );
}

export default AdminProductsPage;
