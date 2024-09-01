import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import AccountIcon from '../../assets/images/user-account.svg';
import DashboardIcon from '../../assets/images/dashboard.svg';
import OrderIcon from '../../assets/images/order.svg';
import LogoutIcon from '../../assets/images/logout.svg';
import LoginIcon from '../../assets/images/user-login.svg';
import CloseIcon from '../../assets/images/close.svg';
import ArrowRightIcon from '../../assets/images/arrow-right.svg';
import ArrowBottomIcon from '../../assets/images/arrow-bottom.svg';
import RegisterIcon from '../../assets/images/user-register.svg';
import { useAuth, useCart } from '../../hooks';
import { Overlay, SearchBar, Loading, Cart } from '../../components/common';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { optionApi } from '../../api';

function Header({ hasTransiton = false }) {
  const { calTotalQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState('');
  const [whiteLogo, setWhiteLogo] = useState('');
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [subMenuExpanded, setSubMenuExpanded] = useState(false);
  const [className, setClassName] = useState(
    'h-[80px] lg:h-[72px] bg-transparent lg:bg-secondary border-0 lg:border-b text-secondary lg:text-primary'
  );
  const [scrolled, setScrolled] = useState(false);
  const { profile, refresh, logout } = useAuth();
  const [showCart, setShowCart] = useState(false);

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
    (async () => {
      setLoading(true);
      try {
        const { data: optionData } = await optionApi.getOptions();
        const optionArray = optionData.rows;
        const options = {};
        optionArray.forEach((option) => {
          options[option.option_key] = option.option_value;
        });
        setMenu(JSON.parse(options['header-menu']));
        setLogo(options['logo']);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 40) {
        setClassName(
          'h-[80px] lg:h-[72px] bg-transparent lg:bg-secondary border-0 lg:border-b text-secondary lg:text-primary'
        );
        setScrolled(false);
      } else {
        setClassName('h-[72px] bg-secondary border-b text-primary');
        setScrolled(true);
      }
    };

    if (hasTransiton) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setClassName('h-[72px] bg-secondary border-b text-primary');
    }
  }, [hasTransiton]);

  useEffect(() => {
    if (profile) return;
    (async () => {
      await refresh();
    })();
  }, []);

  function handleSearchChange(keyword) {
    setSearchKeyword(keyword);
  }

  function handleSearchSubmit() {
    const keyword = searchKeyword.trim();
    if (keyword === '') return;

    navigate(`/search?q=${keyword.replace(/\s+/g, '+')}`);
  }

  return (
    <header id="header" className="fixed lg:sticky top-0 left-0 w-full z-30">
      <div className={`relative flex items-center transition-all border-primary ${className}`}>
        <div className="container-sm px-5 lg:px-4 flex items-center justify-between text-lg font-vs-std transition-all">
          <div className="flex animate-appear-from-left">
            {!menuExpanded ? (
              <div
                onClick={() => setMenuExpanded(true)}
                className="cursor-pointer p-1 w-8 h-8 hidden lg:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  className="transition-all"
                >
                  <title>Menu</title>
                  <line x1="2.25" y1="6.25" x2="21.75" y2="6.25" strokeWidth="1.5"></line>
                  <line x1="2.25" y1="11.25" x2="21.75" y2="11.25" strokeWidth="1.5"></line>
                  <line x1="2.25" y1="16.25" x2="21.75" y2="16.25" strokeWidth="1.5"></line>
                </svg>
              </div>
            ) : (
              <div
                onClick={() => setMenuExpanded(false)}
                className="cursor-pointer p-1 w-8 h-8 hidden lg:block"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.7128 16.773L7.22748 8.28777C6.93757 7.99785 6.93757 7.51702 7.22748 7.22711C7.5174 6.93719 7.99823 6.93719 8.28814 7.22711L16.7734 15.7124C17.0633 16.0023 17.0633 16.4831 16.7734 16.773C16.4835 17.063 16.0027 17.063 15.7128 16.773Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M7.22658 16.773C6.93666 16.4831 6.93666 16.0023 7.22658 15.7124L15.7119 7.22711C16.0018 6.93719 16.4826 6.93719 16.7725 7.22711C17.0624 7.51702 17.0624 7.99785 16.7725 8.28777L8.28724 16.773C7.99732 17.063 7.51649 17.063 7.22658 16.773Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            )}

            <Link className="lg:hidden" to={menu[0]?.href}>
              {menu[0]?.title}
            </Link>
            <Link className="ml-5 lg:hidden" to={menu[1]?.href}>
              {menu[1]?.title}
            </Link>
          </div>
          <Link
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-appear"
            to="/"
          >
            <img
              className="w-[122px] lg:w-[98px] h-[40px] md:h-[32px] object-fill lg:hidden"
              src={hasTransiton ? (scrolled ? logo : whiteLogo) : logo}
              alt="Vinamilk"
            />
            <img
              className="w-[122px] lg:w-[98px] h-[40px] md:h-[32px] object-fill hidden lg:block"
              src={logo}
              alt="Vinamilk"
            />
          </Link>
          <div className="flex animate-appear-from-right">
            <Link className="px-3 lg:hidden" to={menu[2]?.href}>
              {menu[2]?.title}
            </Link>
            <Link className="px-3 lg:hidden" to={menu[3]?.href}>
              {menu[3]?.title}
            </Link>
            <div
              onClick={() => setSearchExpanded(true)}
              className="cursor-pointer flex items-center justify-center w-6 h-6 ml-3 mr-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all"
              >
                <path
                  d="M11.5002 21.75C5.85024 21.75 1.25024 17.15 1.25024 11.5C1.25024 5.85 5.85024 1.25 11.5002 1.25C17.1502 1.25 21.7502 5.85 21.7502 11.5C21.7502 17.15 17.1502 21.75 11.5002 21.75ZM11.5002 2.75C6.67024 2.75 2.75024 6.68 2.75024 11.5C2.75024 16.32 6.67024 20.25 11.5002 20.25C16.3302 20.25 20.2502 16.32 20.2502 11.5C20.2502 6.68 16.3302 2.75 11.5002 2.75Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M22.0002 22.7499C21.8102 22.7499 21.6202 22.6799 21.4702 22.5299L19.4702 20.5299C19.1802 20.2399 19.1802 19.7599 19.4702 19.4699C19.7602 19.1799 20.2402 19.1799 20.5302 19.4699L22.5302 21.4699C22.8202 21.7599 22.8202 22.2399 22.5302 22.5299C22.3802 22.6799 22.1902 22.7499 22.0002 22.7499Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="relative flex items-center justify-center w-6 h-6 mx-2 lg:hidden group/item">
              <Link to={profile?.role === 'admin' ? '/admin/profile' : '/account'}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all"
                >
                  <path
                    d="M12.12 13.53C12.1 13.53 12.07 13.53 12.05 13.53C12.02 13.53 11.98 13.53 11.95 13.53C9.67998 13.46 7.97998 11.69 7.97998 9.50998C7.97998 7.28998 9.78998 5.47998 12.01 5.47998C14.23 5.47998 16.04 7.28998 16.04 9.50998C16.03 11.7 14.32 13.46 12.15 13.53C12.13 13.53 12.13 13.53 12.12 13.53ZM12 6.96998C10.6 6.96998 9.46998 8.10998 9.46998 9.49998C9.46998 10.87 10.54 11.98 11.9 12.03C11.93 12.02 12.03 12.02 12.13 12.03C13.47 11.96 14.52 10.86 14.53 9.49998C14.53 8.10998 13.4 6.96998 12 6.96998Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M12 22.7498C9.31002 22.7498 6.74002 21.7498 4.75002 19.9298C4.57002 19.7698 4.49002 19.5298 4.51002 19.2998C4.64002 18.1098 5.38002 16.9998 6.61002 16.1798C9.59002 14.1998 14.42 14.1998 17.39 16.1798C18.62 17.0098 19.36 18.1098 19.49 19.2998C19.52 19.5398 19.43 19.7698 19.25 19.9298C17.26 21.7498 14.69 22.7498 12 22.7498ZM6.08002 19.0998C7.74002 20.4898 9.83002 21.2498 12 21.2498C14.17 21.2498 16.26 20.4898 17.92 19.0998C17.74 18.4898 17.26 17.8998 16.55 17.4198C14.09 15.7798 9.92002 15.7798 7.44002 17.4198C6.73002 17.8998 6.26002 18.4898 6.08002 19.0998Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </Link>
              <div className="invisible transition-all group-hover/item:visible absolute right-[-40px] top-full min-w-[200px] w-max translate-y-[10px] bg-secondary rounded-md border border-slate-300 shadow-md after:absolute after:top-0 after:right-[42px] after:translate-y-[-10px] after:block after:border-l-[10px] after:border-r-[10px] after:border-b-[10px] after:border-transparent after:border-b-secondary before:absolute before:top-0 before:right-[39px] before:translate-y-[-11px] before:block before:border-l-[12px] before:border-r-[12px] before:border-b-[11px] before:border-transparent before:border-b-slate-300">
                {profile ? (
                  <div className="text-primary text-base font-inter">
                    <div className="flex items-center p-2 mb-1 border-b border-slate-300">
                      <img
                        className="w-6 h-6 rounded-full object-cover"
                        src={profile.avatar || DefaultAvatar}
                        alt="Avatar"
                      />
                      <span className="ml-3">Chào, {profile.first_name}</span>
                    </div>
                    <ul className="p-1">
                      {profile.role === 'admin' ? (
                        <li>
                          <Link
                            className="flex items-center p-2 rounded-md hover:bg-tertiary"
                            to="/admin"
                          >
                            <img
                              className="w-6 h-6 rounded-full object-cover"
                              src={DashboardIcon}
                              alt="Dashboard"
                            />
                            <span className="ml-3">Dashboard</span>
                          </Link>
                        </li>
                      ) : (
                        <>
                          <li>
                            <Link
                              className="flex items-center p-2 rounded-md hover:bg-tertiary"
                              to="/account"
                            >
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={AccountIcon}
                                alt="Account"
                              />
                              <span className="ml-3">Tài khoản</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="flex items-center p-2 rounded-md hover:bg-tertiary"
                              to="/account/orders"
                            >
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={OrderIcon}
                                alt="Orders"
                              />
                              <span className="ml-3">Đơn hàng</span>
                            </Link>
                          </li>
                        </>
                      )}
                      <li>
                        <div
                          onClick={handleLogout}
                          className="cursor-pointer flex items-center p-2 rounded-md hover:bg-tertiary"
                        >
                          <img
                            className="w-6 h-6 rounded-full object-cover"
                            src={LogoutIcon}
                            alt="Logout"
                          />
                          <span className="ml-3">Đăng xuất</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-primary text-base font-inter">
                    <ul className="p-1">
                      <li>
                        <Link
                          className="flex items-center p-2 rounded-md hover:bg-tertiary"
                          to="/login"
                        >
                          <img
                            className="w-6 h-6 rounded-full object-cover"
                            src={LoginIcon}
                            alt="Login"
                          />
                          <span className="ml-3">Đăng nhập</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center p-2 rounded-md hover:bg-tertiary"
                          to="/register"
                        >
                          <img
                            className="w-6 h-6 rounded-full object-cover"
                            src={RegisterIcon}
                            alt="Register"
                          />
                          <span className="ml-3">Đăng ký</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div
              onClick={() => setShowCart(true)}
              className="cursor-pointer flex items-center justify-center w-6 h-6 mx-2 relative"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all"
              >
                <path
                  d="M16.4899 22.75H7.49993C5.77993 22.75 4.48994 22.29 3.68994 21.38C2.88994 20.47 2.57993 19.15 2.78993 17.44L3.68994 9.94C3.94994 7.73 4.50994 5.75 8.40994 5.75H15.6099C19.4999 5.75 20.0599 7.73 20.3299 9.94L21.2299 17.44C21.4299 19.15 21.1299 20.48 20.3299 21.38C19.4999 22.29 18.2199 22.75 16.4899 22.75ZM8.39993 7.25C5.51993 7.25 5.37993 8.38999 5.16993 10.11L4.26994 17.61C4.11994 18.88 4.29993 19.81 4.80993 20.38C5.31993 20.95 6.21993 21.24 7.49993 21.24H16.4899C17.7699 21.24 18.6699 20.95 19.1799 20.38C19.6899 19.81 19.8699 18.88 19.7199 17.61L18.8199 10.11C18.6099 8.37999 18.4799 7.25 15.5899 7.25H8.39993Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M16 8.75C15.59 8.75 15.25 8.41 15.25 8V4.5C15.25 3.42 14.58 2.75 13.5 2.75H10.5C9.42 2.75 8.75 3.42 8.75 4.5V8C8.75 8.41 8.41 8.75 8 8.75C7.59 8.75 7.25 8.41 7.25 8V4.5C7.25 2.59 8.59 1.25 10.5 1.25H13.5C15.41 1.25 16.75 2.59 16.75 4.5V8C16.75 8.41 16.41 8.75 16 8.75Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M20.41 17.7793H8C7.59 17.7793 7.25 17.4393 7.25 17.0293C7.25 16.6193 7.59 16.2793 8 16.2793H20.41C20.82 16.2793 21.16 16.6193 21.16 17.0293C21.16 17.4393 20.82 17.7793 20.41 17.7793Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="text-secondary text-sm px-1 rounded-full bg-[#3459FF] absolute -top-1 left-4">
                {calTotalQuantity() < 100 ? calTotalQuantity() : '99+'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {searchExpanded && (
        <Overlay handleClickOut={() => setSearchExpanded(false)}>
          <div className="bg-secondary">
            <div className="container h-[80px] lg:h-[72px] px-5 lg:px-4">
              <div className="flex items-center justify-between h-full">
                <div className="md:hidden inline-block">
                  <img
                    className="w-[122px] h-[40px] lg:w-[98px] md:h-[32px]"
                    src={logo}
                    alt="VinaMilk"
                  />
                </div>
                <div className="md:flex-1">
                  <SearchBar handleChange={handleSearchChange} handleSubmit={handleSearchSubmit} />
                </div>
                <button onClick={() => setSearchExpanded(false)} className="w-8 h-8 md:w-6 md-h-6">
                  <img className="block w-full h-full object-fill" src={CloseIcon} alt="X" />
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
      {menuExpanded && (
        <Overlay excludeHeader handleClickOut={() => setMenuExpanded(false)}>
          <nav className="w-screen max-w-xl h-full bg-secondary overflow-y-auto">
            <ul className="text-primary text-[18px]">
              {menu.map((item, index) => (
                <li
                  key={index}
                  className="animate-appear-from-left border-b border-dashed border-vinamilk-blue-light"
                >
                  <Link
                    className="flex justify-between items-center font-vs-std py-5 px-4"
                    to={item.href}
                  >
                    <span>{item.title}</span>
                    <img src={ArrowRightIcon} alt="" />
                  </Link>
                </li>
              ))}
              <li className="cursor-pointer animate-appear-from-left border-b border-dashed border-vinamilk-blue-light">
                <div
                  onClick={() => setSubMenuExpanded((state) => !state)}
                  className="flex justify-between items-center font-vs-std py-5 px-4"
                >
                  <span>Tài khoản</span>
                  <img src={subMenuExpanded ? ArrowBottomIcon : ArrowRightIcon} alt="" />
                </div>
                {subMenuExpanded && (
                  <>
                    {profile ? (
                      <ul>
                        <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                          <div className="flex items-center font-vs-std pl-6 pr-4 py-4">
                            <img
                              className="w-6 h-6 rounded-full object-cover"
                              src={profile.avatar || DefaultAvatar}
                              alt="Avatar"
                            />
                            <span className="ml-3">Chào, {profile.first_name}</span>
                          </div>
                        </li>
                        {profile.role === 'admin' ? (
                          <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                            <Link
                              className="flex items-center font-vs-std pl-6 pr-4 py-4"
                              to="/admin"
                            >
                              <img className="w-6 h-6 mr-2" src={DashboardIcon} alt="" />
                              <span>Dashboard</span>
                            </Link>
                          </li>
                        ) : (
                          <>
                            <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                              <Link
                                className="flex items-center font-vs-std pl-6 pr-4 py-4"
                                to="/account"
                              >
                                <img className="w-6 h-6 mr-2" src={AccountIcon} alt="" />
                                <span>Tài khoản</span>
                              </Link>
                            </li>
                            <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                              <Link
                                className="flex items-center font-vs-std pl-6 pr-4 py-4"
                                to="/account/orders"
                              >
                                <img className="w-6 h-6 mr-2" src={OrderIcon} alt="" />
                                <span>Đơn hàng</span>
                              </Link>
                            </li>
                          </>
                        )}
                        <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                          <div
                            onClick={handleLogout}
                            className=" cursor-pointer flex items-center font-vs-std pl-6 pr-4 py-4"
                          >
                            <img className="w-6 h-6 mr-2" src={LogoutIcon} alt="" />
                            <span>Đăng xuất</span>
                          </div>
                        </li>
                      </ul>
                    ) : (
                      <ul>
                        <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                          <Link
                            className="flex items-center font-vs-std pl-6 pr-4 py-4"
                            to="/login"
                          >
                            <img className="w-6 h-6 mr-2" src={LoginIcon} alt="" />
                            <span>Đăng nhập</span>
                          </Link>
                        </li>
                        <li className="animate-appear-from-left border-t border-dashed border-vinamilk-blue-light">
                          <Link
                            className="flex items-center font-vs-std pl-6 pr-4 py-4"
                            to="/register"
                          >
                            <img className="w-6 h-6 mr-2" src={RegisterIcon} alt="" />
                            <span>Đăng ký</span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </>
                )}
              </li>
            </ul>
          </nav>
        </Overlay>
      )}
      {showCart && (
        <Overlay handleClickOut={() => setShowCart(false)}>
          <Cart handleClose={() => setShowCart(false)} />
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </header>
  );
}

Header.propTypes = {
  hasTransiton: PropTypes.bool,
};

export default Header;
