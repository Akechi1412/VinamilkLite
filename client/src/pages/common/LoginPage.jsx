import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks';
import { Loading } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/common';
import eye from '../../assets/images/eye-solid.svg';
import eyeslash from '../../assets/images/eye-slash-solid.svg';
import Swal from 'sweetalert2';
import { MainLayout } from '../../components/layout';

function LoginPage() {
  const eyeiconRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { profile, login, refresh } = useAuth();
  const navigate = useNavigate();
  const [emailCheck, setEmailCheck] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const changePasswordType = () => {
    if (passwordRef) {
      if (passwordRef.current.type == 'password') {
        passwordRef.current.type = 'text';
        if (eyeiconRef) {
          eyeiconRef.current.src = eye;
        }
      } else {
        passwordRef.current.type = 'password';
        if (eyeiconRef) {
          eyeiconRef.current.src = eyeslash;
        }
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    const email = event.target.value.trim();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (email === '') {
      setEmailCheck('Email là bắt buộc!');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailCheck('Email không hợp lệ!');
      return;
    }
    setEmailCheck('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    const password = event.target.value;
    if (password === '') {
      setPasswordCheck('Mật khẩu là bắt buộc!');
      return;
    }
    setPasswordCheck('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailCheck('Email là bắt buộc!');
      return;
    }
    if (!password) {
      setPassword('Mật khẩu là bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        text: 'Đang chuyển hướng đến trang chủ...',
        timer: 2000,
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

  useEffect(() => {
    if (profile) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [profile]);

  return (
    <MainLayout>
      <div className="my-10 md:px-4">
        <div className="w-full max-w-[438px] mx-auto p-[44px] border border-vinamilk-blue rounded-[16px] md:px-[24px] md:py-8">
          <span className="block transition-all font-lora text-[16px] md:text-[14px] text-vinamilk-blue font-semi-medium italic mb-4 leading-[19px] md:leading-[16.8px]">
            Tài khoản Vinamilk
          </span>
          <h3 className="transition-all font-vs-std text-[36px] md:text-[32px] leading-[36px] md:leading-[32px] text-vinamilk-blue font-semibold not-italic mb-[48px] md:mb-8">
            Đăng nhập vào tài khoản thành viên
          </h3>
          <form action="">
            <div className="relative flex flex-col justify-center mb-[24px]">
              <label
                className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                htmlFor="email"
              >
                Email*
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="text"
                  placeholder="Nhập email*"
                  value={email}
                  handleChange={handleEmailChange}
                />
                {emailCheck && <p className="text-red-600 mt-1 font-inter">{emailCheck}</p>}
              </div>
            </div>
            <div className="relative flex flex-col justify-center mb-[24px]">
              <label
                className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                htmlFor="password"
              >
                Mật khẩu*
              </label>
              <div className="inline-block">
                <Input
                  type="password"
                  value={password}
                  placeholder="Nhập mật khẩu*"
                  handleChange={handlePasswordChange}
                  id="password"
                  ref={passwordRef}
                />
                <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                  <img ref={eyeiconRef} src={eyeslash} alt="()" onClick={changePasswordType} />
                </div>
                {passwordCheck && <p className="text-red-600 mt-1 font-inter">{passwordCheck}</p>}
              </div>
            </div>
            <div className="flex items-center justify-center mt-[32px] md:justify-between">
              <Button
                title="Đăng nhập"
                type="submit"
                isDisable={Boolean(emailCheck || passwordCheck)}
                handleClick={handleLogin}
              />
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center mt-[32px]">
          <p className="transition-all font-lora md:text-[16px] text-vinamilk-blue font-semi-medium not-italic leading-[19px]">
            Bạn chưa có tài khoản?
          </p>
          <a href="/register">
            <p className="transition-all font-lora text-[16px] md-max:text-[14px] text-vinamilk-blue font-semi-medium italic ml-[2px] underline cursor-pointer">
              Đăng ký
            </p>
          </a>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default LoginPage;
