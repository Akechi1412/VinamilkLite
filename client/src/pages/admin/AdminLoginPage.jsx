import { Loading } from '../../components/admin';
import { EmptyLayout } from '../../components/layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/admin';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailCheck, setEmailCheck] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, login, refresh } = useAuth();
  const navigate = useNavigate();

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
      setPasswordCheck('Mật khẩu là bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
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
    if (profile && profile.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }

    if (profile && profile.role !== 'admin') {
      setEmail('');
      setPassword('');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Không được phép truy cập trang này!',
      });
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
    <EmptyLayout className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl text-center font-bold text-gray-800">Đăng nhập</h2>
        <form action="">
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <Input placeholder="Nhập email" value={email} handleChange={handleEmailChange} />
            {emailCheck && <p className="text-red-600 mt-1 font-inter">{emailCheck}</p>}
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
            <Input
              placeholder="Nhập mật khẩu"
              value={password}
              handleChange={handlePasswordChange}
              type="password"
            />
            {passwordCheck && <p className="text-red-600 mt-1 font-inter">{passwordCheck}</p>}
          </div>
          <div className="mt-6">
            <Button title="Đăng nhập" type="submit" handleClick={handleLogin} />
          </div>
        </form>
      </div>
      {loading && <Loading fullScreen />}
    </EmptyLayout>
  );
}

export default AdminLoginPage;
