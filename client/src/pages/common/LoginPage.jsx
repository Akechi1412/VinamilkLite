import { useState } from 'react';
import { authApi } from '../../api';
import Cookies from 'js-cookie';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
//vcl
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await authApi.login({ email, password });
      Cookies.set('access_token', data.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(data.accessExpiredAt),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form action="">
        <input onChange={handleEmailChange} value={email} type="email" placeholder="email" />
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="password"
        />
        <button onClick={handleSubmit} type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
