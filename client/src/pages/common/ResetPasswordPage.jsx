import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { Loading } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/common';
import Swal from 'sweetalert2';
import { MainLayout } from '../../components/layout';
import { authApi } from '../../api';

function ResetPasswordPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const { profile, refresh } = useAuth();
  const navigate = useNavigate();
  const [emailCheck, setEmailCheck] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailCheck('Email là bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email: email.trim() });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Reset password thành công',
        text: 'Vui lòng kiểm tra email và đăng nhập lại',
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
            Reset mật khẩu
          </span>
          <h3 className="transition-all font-vs-std text-[36px] md:text-[32px] leading-[36px] md:leading-[32px] text-vinamilk-blue font-semibold not-italic mb-[48px] md:mb-8">
            Yêu cầu cấp lại mật khẩu mới
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
            <div className="flex items-center justify-center mt-[32px] md:justify-between">
              <Button
                title="Xác nhận"
                type="submit"
                isDisable={Boolean(emailCheck)}
                handleClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default ResetPasswordPage;
