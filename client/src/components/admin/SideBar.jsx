import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { optionApi } from '../../api';
import Swal from 'sweetalert2';
import { Loading } from '../common';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../../assets/images/arrow-sm-left.svg';

const adminPages = {
  users: 'Người dùng',
  products: 'Sản phẩm',
  collections: 'Bộ sưu tập',
  orders: 'Đơn hàng',
  news: 'Tin tức',
  'news-categories': 'Danh mục',
  comments: 'Bình luận',
  contacts: 'Liên hệ',
  options: 'Tùy chỉnh',
};

function SideBar({ isExpand, handleClose }) {
  const [currentPage, setCurrentPage] = useState('');
  const [whiteLogo, setWhiteLogo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastPath = location.pathname.split('/').pop();
    setCurrentPage(lastPath);
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: optionData } = await optionApi.getOptions();
        const optionArray = optionData.rows;
        const options = {};
        optionArray.forEach((option) => {
          options[option.option_key] = option.option_value;
        });
        setWhiteLogo(options['white-logo']);
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
    <aside
      className={
        'transition-all duration-300 bg-gray-900 h-screen lg:fixed top-0 left-0 z-40 overflow-hidden text-secondary' +
        (isExpand ? ' w-[250px]' : ' w-0')
      }
    >
      <div className="p-4">
        <div className="flex justify-between items-center pb-4 border-b border-secondary">
          <Link to="/">
            <img className="w-[90px]" src={whiteLogo} alt="Vinamilk" />
          </Link>
          <div onClick={() => handleClose()} className="cursor-pointer">
            <img className="w-8 h-8 object-cover" src={ArrowLeftIcon} alt="<-" />
          </div>
        </div>
        <div className="mt-4">
          <ul>
            <li>
              <Link
                className={
                  'block py-2 px-4 rounded-md hover:bg-gray-950' +
                  (currentPage === 'admin' ? ' bg-gray-800' : '')
                }
                to="/admin"
              >
                Dashboard
              </Link>
            </li>
            {Object.keys(adminPages).map((item, index) => (
              <li key={index}>
                <Link
                  className={
                    'block py-2 px-4 rounded-md hover:bg-gray-950' +
                    (item === currentPage ? ' bg-gray-800' : '')
                  }
                  to={`/admin/${item}`}
                >
                  {adminPages[item]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </aside>
  );
}

SideBar.propTypes = {
  isExpand: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default SideBar;
