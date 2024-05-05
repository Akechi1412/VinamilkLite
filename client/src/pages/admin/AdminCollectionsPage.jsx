import { AdminLayout } from '../../components/layout';
import { firebaseApi, collectionApi } from '../../api';
import { useEffect, useState } from 'react';
import { Button, ImageSelector, Input, CollectionTable } from '../../components/admin';
import { Loading, SearchBar } from '../../components/admin';
import { Overlay } from '../../components/common';
import Swal from 'sweetalert2';
import CloseIcon from '../../assets/images/close-dark.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';
import { DraggableOrder } from '../../components/admin';

function AdminCollectionsPage() {
  const [loading, setLoading] = useState(false);
  const [collectionRows, setCollectionRows] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [file, setFile] = useState(null);
  const [collectionList, setCollectionList] = useState(0);
  const [newCollectionList, setNewCollectionList] = useState([]);

  const fetchCollectionList = async () => {
    setLoading(true);
    try {
      const { data } = await collectionApi.getCollections('_sort=collection_order');
      setCollectionList(data.rows);
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

  const mutateCollections = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&name_like=${searchValue.trim()}`;
      }
      const { data: collectionData } = await collectionApi.getCollections(paramString);
      setCollectionRows(collectionData.rows);
      setTotalPages(collectionData.pagination?.totalPages || 0);
      setTotalRows(collectionData.pagination?.totalRows || 0);
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

      for await (const [index, collection] of newCollectionList.entries()) {
        if (index !== collection.collection_order) {
          const updateRequest = collectionApi.update(collection.id, {
            collection_order: index,
          });
          updateRequests.push(updateRequest);
        }
      }

      await Promise.all(updateRequests);
      setLoading(false);
      mutateCollections();
      fetchCollectionList();
      Swal.fire({
        icon: 'success',
        title: 'Thêm bộ sưu tập thành công!',
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
      let image = null;
      if (file) {
        const url = await firebaseApi.upload(file, `collections/${Date.now()}_${file.name}`);
        image = url;
      }
      let order = 0;
      if (collectionList.length > 0) {
        order = collectionList[collectionList.length - 1].collection_order + 1;
      }
      try {
        await collectionApi.create({
          name: values.name.trim(),
          slug: values.slug.trim(),
          image,
          collection_order: order,
        });
        setLoading(false);
        mutateCollections();
        Swal.fire({
          icon: 'success',
          title: 'Thêm bộ sưu tập thành công!',
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
    fetchCollectionList();
  }, []);

  useEffect(() => {
    mutateCollections();
    return mutateCollections.cancel;
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
          <CollectionTable collectionRows={collectionRows} handleMutate={mutateCollections} />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {collectionRows.length} trên tổng số {totalRows}
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
              <h4 className="text-2xl font-semibold">Thêm bộ sưu tập</h4>
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
                  <ImageSelector handleSelect={(file) => setFile(file)} />
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
                dataList={collectionList}
                onChange={(orderList) => setNewCollectionList(orderList)}
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

export default AdminCollectionsPage;
