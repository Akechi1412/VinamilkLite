import PropTypes from 'prop-types';
import { Header, Footer } from '../common';
import AccountIcon from '../../assets/images/user-account.svg';
import OrderIcon from '../../assets/images/order.svg';
import LogoutIcon from '../../assets/images/logout.svg';
import AddressIcon from '../../assets/images/address.svg';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ArrowBottom from '../../assets/images/arrow-bottom.svg';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks';
import { useNavigate, Link } from 'react-router-dom';

function AccountLayout({ children }) {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');
  const { logout } = useAuth();
  const options = [
    { value: 'account', text: 'Trang cá nhân' },
    { value: 'address', text: 'Địa chỉ' },
    { value: 'orders', text: 'Đơn hàng' },
    { value: 'logout', text: 'Đăng xuất' },
  ];
  const [selected, setSelected] = useState(options[0].value);
  const navigate = useNavigate();

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

  const handleChange = (event) => {
    const selected = event.target.value;
    if (selected === 'logout') {
      handleLogout();
      return;
    }

    if (selected === 'account') {
      navigate('/account');
    } else {
      navigate(`/account/${selected}`);
    }
  };

  useEffect(() => {
    const lastPath = location.pathname.split('/').pop();
    setCurrentPage(lastPath);
    setSelected(lastPath);
  }, [location.pathname]);

  return (
    <div className="min-h-screen before:block before:bg-transparent before:h-[72px] lg:before:hidden">
      <Header />
      <div className="container px-5 md:px-4">
        <div className="flex space-x-10 py-[64px] lg:pt-5 lg:flex-col lg:space-x-0 lg:space-y-5">
          <div className="w-[360px] lg:w-full text-primary font-inter">
            <div className="lg:hidden p-4 rounded-2xl border">
              <div className="mb-4">
                <h6 className="py-4 text-[1.125rem] font-semibold">Quản lý tài khoản</h6>
                <ul>
                  <li>
                    <Link to="/account">
                      <div
                        style={{
                          background: currentPage === 'account' ? '#D3E1FF' : 'transparent',
                        }}
                        className="flex items-center px-4 py-3 hover:font-semibold rounded-lg"
                      >
                        <img className="mr-3 w-6 h-6" src={AccountIcon} alt="" />
                        <span>Hồ sơ cá nhân</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/account/address">
                      <div
                        style={{
                          background: currentPage === 'address' ? '#D3E1FF' : 'transparent',
                        }}
                        className="flex items-center px-4 py-3 hover:font-semibold rounded-lg"
                      >
                        <img className="mr-3 w-6 h-6" src={AddressIcon} alt="" />
                        <span>Địa chỉ</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <h6 className="py-4 text-[1.125rem] font-semibold">Quản lý đơn hàng</h6>
                <ul>
                  <li>
                    <Link to="/account/orders">
                      <div
                        style={{ background: currentPage === 'orders' ? '#D3E1FF' : 'transparent' }}
                        className="flex items-center px-4 py-3 hover:font-semibold rounded-lg"
                      >
                        <img className="mr-3 w-6 h-6" src={OrderIcon} alt="" />
                        <span>Đơn hàng</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="py-4 text-[1.125rem] font-semibold">Cài đặt</h6>
                <ul>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 hover:font-semibold"
                    >
                      <img className="mr-3 w-6 h-6" src={LogoutIcon} alt="" />
                      <span>Đăng xuất</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <select
                className="cursor-pointer block bg-secondary py-4 pl-3 pr-10 w-full rounded-md border border-primary focus:border-vinamilk-blue-light"
                value={selected}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              <img
                className="absolute bg-secondary top-0 translate-y-1/2 right-1 w-[30px] h-[30px]"
                src={ArrowBottom}
                alt="\/"
              />
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

AccountLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountLayout;
