import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { Loading } from '../../components/common';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { profile, login, refresh } = useAuth();
  const navigate = useNavigate();
  const [emailCheck, setEmailCheck] = useState('');
  const [passwordCheck, setPasswordCheck] = useState(''); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (email.trim() === '') {
      setEmailCheck('Email la bat buoc');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailCheck('Email khong hop le');
      return;
    }
    setEmailCheck('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (password === '') {
      setPasswordCheck('Mat khau la bat buoc');
      return;
    }
    setPasswordCheck('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login({ email, password });
    } catch (error) {
      console.log(error);
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

  if (loading) return <Loading fullScreen />;

  return (
    <div className='flex items-center justify-center min-h-screen flex-col'>
      <div className='w-1/4 md:w-32 lg:w-48 p-12 m-2 justify-self-auto border min-h-3/4 border-blue-400 border-solid rounded-lg'>
        <p className='italic text-blue-400'>Tài khoản Vinamilk</p>
        <p className='text-xl font-bold text-blue-400'>Đăng nhập vào tài khoản thành viên</p><br></br>
        <form className="flex flex-col" action="">
        <p className='italic text-blue-400'>Email</p>
          <input 
            className='border border-blue-400 border-solid rounded-lg'
            onChange={handleEmailChange} 
            value={email} 
            type="email" 
            placeholder="email"
          />{emailCheck && <p className='text-red-600'>{emailCheck}</p>}
          <br></br>
          <p className='italic text-blue-400'>Mật khẩu</p>
          <input
            className='border border-blue-400 border-solid rounded-lg'
            onChange={handlePasswordChange}
            value={password}
            type="password"
            placeholder="password"
          />{passwordCheck && <p className='text-red-600'>{passwordCheck}</p>}
          <br></br>
          <button onClick={handleLogin} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Đăng nhập
          </button>
        </form>
      </div><br></br>
      <div className='min-w-screen'>
      Bạn chưa có tài khoản? <a className='italic underline' href='register'>Đăng ký</a>
      </div>
      
    </div>
  );
}

export default LoginPage;