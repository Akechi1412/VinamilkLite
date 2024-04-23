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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
//vcl
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
    <div>
      <form className="flex flex-col" action="">
        <input onChange={handleEmailChange} value={email} type="email" placeholder="email" />
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="password"
        />
        <button onClick={handleLogin} type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
