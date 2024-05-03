import { AdminLayout } from '../../components/layout';
import { userApi } from '../../api';
import { useEffect, useState } from 'react';
import { UserTable } from '../../components/admin';
import { Loading } from '../../components/common';
import Swal from 'sweetalert2';

function AdminUsersPage() {
  const [loading, setLoading] = useState(false);
  const [userRows, setUserRows] = useState([]);

  const mutateUsers = async () => {
    setLoading(true);
    try {
      const { data: userData } = await userApi.getUsers();
      setUserRows(userData.rows);
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: userData } = await userApi.getUsers();
        setUserRows(userData.rows);
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
        <div className="my-5">
          <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500">
            Thêm
          </button>
        </div>
        <div className="overflow-x-auto">
          <UserTable userRows={userRows} handleMutate={mutateUsers} />
          {/* <Pagination
          className="pagination justify-content-center mt-4"
          pageRangeDisplayed={3}
          pageLinkClassName="page-link"
          activeClassName="page-link active"
          pageCount={Math.ceil(users.length / itemsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        /> */}
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </AdminLayout>
  );
}

export default AdminUsersPage;
