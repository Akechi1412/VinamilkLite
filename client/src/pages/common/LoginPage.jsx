import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost/VinamilkLite/api/core/Request.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data === 'true') {
        // Đăng nhập thành công, chuyển hướng đến trang chính
        navigate('/', { replace: true });
      } else {
        // Đăng nhập thất bại, hiển thị thông báo lỗi từ server
        setError(data);
      }
    } catch (error) {
      // Xử lý lỗi từ yêu cầu AJAX
      console.error('Error:', error);
      setError('Đã xảy ra lỗi, vui lòng thử lại sau.');
    }
  };

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleLogin} noValidate>
        <input
          onChange={handleEmailChange}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}

export default LoginPage;
