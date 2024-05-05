import { AdminLayout } from '../../components/layout';
import { contactApi } from '../../api';
import { useEffect, useState } from 'react';
import { ContactTable } from '../../components/admin';
import { Loading, SearchBar } from '../../components/admin';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';

function AdminContactPage() {
  const [loading, setLoading] = useState(false);
  const [contactRows, setContactRows] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const muateContacts = debounce(async () => {
    setLoading(true);
    try {
      let paramString = `_page=${currentPage}`;
      if (searchValue.trim()) {
        paramString += `&fullname_like=${searchValue.trim()}`;
      }
      const { data: contactData } = await contactApi.getContacts(paramString);
      setContactRows(contactData.rows);
      setTotalPages(contactData.pagination?.totalPages || 0);
      setTotalRows(contactData.pagination?.totalRows || 0);
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

  useEffect(() => {
    muateContacts();
    return muateContacts.cancel;
  }, [currentPage, searchValue]);

  return (
    <AdminLayout>
      <div className="container px-5 md:px-4">
        <div className="my-5 flex items-center space-x-4 sm:flex-col sm:items-start sm:space-x-0 sm:space-y-4">
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
          <ContactTable contactRows={contactRows} handleMutate={muateContacts} />
        </div>
        <div className="mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
          <p>
            Đang hiển thị {contactRows.length} trên tổng số {totalRows}
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
      {loading && <Loading fullScreen />}
    </AdminLayout>
  );
}

export default AdminContactPage;
