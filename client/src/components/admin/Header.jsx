import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import MenuIcon from '../../assets/images/menu-dark.svg';
import { useAuth } from '../../hooks';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const adminPages = {
  users: 'Người dùng',
  products: 'Sản phẩm',
  collections: 'Bộ sưu tập',
  brands: 'Thương thiệu',
  'product-types': 'Loại sản phẩm',
  packing: 'Đóng gói',
  orders: 'Đơn hàng',
  news: 'Tin tức',
  'news-categories': 'Danh mục',
  comments: 'Bình luận',
  contacts: 'Liên hệ',
  options: 'Tùy chỉnh',
  profile: 'Profile',
};

function Header({ handleToggle, toggled }) {
  const [currentPage, setCurrentPage] = useState('');
  const { profile, logout } = useAuth();
  const [dropdownOpened, setDropdownOpend] = useState(false);
  const [active, setActive] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    setActive(false);
    handleToggle(false);
  }, [toggled]);

  useEffect(() => {
    const lastPath = location.pathname.split('/').pop();
    setCurrentPage(lastPath);
  }, [location.pathname]);

  return (
    <header className="sticky left-0 top-0 w-full h-[60px] shadow-md z-30">
      <div className="h-full container px-5 md:py-4">
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center">
            <img
              onClick={() => {
                setActive((active) => !active);
                handleToggle(!active);
              }}
              className="w-6 h-6 mr-2 cursor-pointer"
              src={MenuIcon}
              alt=""
            />
            {currentPage === 'admin' ? (
              <span className="text-gray-900">Dashboard</span>
            ) : (
              <Link className="text-gray-600 hover:text-gray-800" to="/admin">
                Dashboard
              </Link>
            )}
            {currentPage !== 'admin' && <span className="mx-2 text-gray-900">/</span>}
            {currentPage !== 'admin' && (
              <span className="text-gray-900">{adminPages[currentPage]}</span>
            )}
          </div>
          <div className="relative flex h-full items-center">
            <img
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              src={profile.avatar || DefaultAvatar}
              onClick={() => setDropdownOpend((opened) => !opened)}
              alt=""
            ></img>
            {dropdownOpened && (
              <div className="absolute top-full translate-y-[1px] right-0 w-[150px] rounded-md shadow-md bg-secondary py-2">
                <ul className="overflow-y-auto">
                  <li>
                    <Link
                      className="block py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                      to="/admin/profile"
                    >
                      Profle
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default Header;
