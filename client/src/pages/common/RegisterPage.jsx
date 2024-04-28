import { useFormik } from 'formik';
import * as Yup from 'yup';
import eye from '../../assets/images/eye-solid.svg';
import eyeslash from '../../assets/images/eye-slash-solid.svg';
import { MainLayout } from '../../components/layout';
import { Input, Button, Loading } from '../../components/common';
import { useRef, useState, useEffect } from 'react';
import { authApi } from '../../api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const eyeiconRef = useRef(null);
  const passwordRef = useRef(null);
  const eyeicon1Ref = useRef(null);
  const confirmPasswordRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      email: '',
      termsofuse: false,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .required('Tên là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Tên không được chứa số hoặc ký tự đặc biệt'
        )
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(30, 'Tên có nhiều nhất 30 ký tự'),
      lastName: Yup.string()
        .required('Họ là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Họ không được chứa số hoặc ký tự đặc biệt'
        )
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(30, 'Tên có nhiều nhất 30 ký tự'),
      password: Yup.string()
        .required('Mật khẩu là bắt buộc')
        .matches(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
          'Mật khẩu phải có ít nhất 8 ký tự, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt'
        )
        .max(20, 'Mật khẩu dài tối đa 20 ký tự'),
      confirmPassword: Yup.string()
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp'),
      email: Yup.string().required('Email là bắt buộc').email('Hãy nhập đúng định dạng email'),
      termsofuse: Yup.bool().oneOf(
        [true],
        'Bạn cần đồng ý với Chính sách bảo mật và Điều khoản sử dụng'
      ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await authApi.register({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
        });

        setOtpSent(true);
        setTimeLeft(60);
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
    },
  });

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

  const changeConfirmPasswordType = () => {
    if (confirmPasswordRef) {
      if (confirmPasswordRef.current.type == 'password') {
        confirmPasswordRef.current.type = 'text';
        if (eyeicon1Ref) {
          eyeicon1Ref.current.src = eye;
        }
      } else {
        confirmPasswordRef.current.type = 'password';
        if (eyeicon1Ref) {
          eyeicon1Ref.current.src = eyeslash;
        }
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleChangeOtp = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    if (e.target.nextSibling && e.target.value) {
      e.target.nextSibling.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authApi.resendOtp();
      setTimeLeft(60);
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

  const handleSubmitOtp = async () => {
    const otpString = otp.join('').trim();

    if (!otpString) {
      setErrorText('Chưa nhập OTP!');
      return;
    }
    if (!/^\d+$/.test(otpString)) {
      setErrorText('OTP chỉ gồm các số!');
      return;
    }
    if (otpString.length < 6) {
      setErrorText('OTP phải có đủ 6 số!');
      return;
    }
    setErrorText('');

    setLoading(true);
    try {
      await authApi.verifyOtp({ otp: otpString });
      setLoading(false);
      await Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Đang chuyển hướng đến trang đăng nhập...',
        timer: 2000,
      });
      navigate('/login');
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

  return (
    <MainLayout>
      {!otpSent ? (
        <div className="my-10 flex-grow text-vinamilk-blue pt-0">
          <div className="flex justify-center gap-[115px] px-4 my-10 max-w-[898px] mx-auto lg:gap-[50px] md:flex-col md:items-center">
            <div>
              <p className="leading-10 transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[16px] flex !font-[450]">
                Mới về Vinamilk
              </p>
              <p className="transition-all font-vs-std text-[30px] lg:text-[24px] leading-none text-vinamilk-blue font-semibold not-italic mb-[16px] lg:mb-8">
                Giới thiệu chương trình khách hàng thân thiết Vinamilk.
              </p>
              <p className="transition-all font-vs-std text-[24px] lg:text-[20px] leading-none text-vinamilk-blue font-medium not-italic mb-[8px] lg:mb-4">
                Những lợi ích
              </p>
              <p className="transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
                Một tài khoản. Hàng tấn lợi ích. Khả năng vô tận. Thành viên của chúng tôi bao gồm
                các lợi ích sau:
              </p>
              <div className="flex flex-col">
                <div className="flex">
                  <div>
                    <picture>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9733048479d348d496c9d93dbf664b26%2F3cfc27f637974307a27818a2b880da35"
                        alt=""
                        className="h-auto max-w-xl"
                      />
                    </picture>
                  </div>
                  <div>
                    <p className="transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
                      Quyền truy cập của thành viên vào các sự kiện đặc biệt và hội thảo trực tuyến
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <picture>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9733048479d348d496c9d93dbf664b26%2F51b01cacefb34e79b8b771f4a4be64ae"
                        alt=""
                        className="h-auto max-w-xl"
                      />
                    </picture>
                  </div>
                  <div>
                    <p className="transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
                      Giảm giá và ưu đãi đặc biệt
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <picture>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9733048479d348d496c9d93dbf664b26%2Fc265ba400c7c4b99a00d121804c1b773"
                        alt=""
                        className="h-auto max-w-xl"
                      />
                    </picture>
                  </div>
                  <div>
                    <p className="transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
                      Ưu tiên tiếp cận lời khuyên của Chuyên gia
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <picture>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9733048479d348d496c9d93dbf664b26%2Fecc10c125cf648d6a28e25e25c6529d1"
                        alt=""
                        className="h-auto max-w-xl"
                      />
                    </picture>
                  </div>
                  <div>
                    <p className="transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
                      Theo dõi đơn hàng nhanh và chính xác
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[438px] border border-vinamilk-blue rounded-[18px] p-[44px] min-w-[40%] lg:px-[24px]">
              <p className="transition-all font-vs-std text-[36px] lg:text-[32px] leading-none text-vinamilk-blue font-semibold not-italic mb-[8px] lg:mb-4">
                Đăng ký tài khoản
              </p>
              <p className="transition-all font-vs-std lg:text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[48px] lg:mb-8">
                Vui lòng cung cấp thông tin để tạo tài khoản Vinamilk
              </p>
              <form action="" method="post" onSubmit={formik.handleSubmit}>
                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="firstName"
                  >
                    Tên*
                  </label>
                  <div className="relative">
                    <Input
                      value={formik.values.firstName}
                      placeholder="Nhập tên*"
                      handleChange={formik.handleChange}
                      id="firstName"
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                      <p className="text-red-600 mt-1 font-inter">{formik.errors.firstName}</p>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="lastName"
                  >
                    Họ*
                  </label>
                  <div className="relative">
                    <Input
                      value={formik.values.lastName}
                      placeholder="Nhập họ và tên đệm*"
                      handleChange={formik.handleChange}
                      id="lastName"
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                      <p className="text-red-600 mt-1 font-inter">{formik.errors.lastName}</p>
                    )}
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
                      value={formik.values.password}
                      placeholder="Nhập mật khẩu*"
                      handleChange={formik.handleChange}
                      id="password"
                      ref={passwordRef}
                    />
                    <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                      <img ref={eyeiconRef} src={eyeslash} alt="()" onClick={changePasswordType} />
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <p className="text-red-600 mt-1 font-inter">{formik.errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="confirmPassword"
                  >
                    Xác nhận mật khẩu*
                  </label>
                  <div className="inline-block">
                    <Input
                      type="password"
                      value={formik.values.confirmPassword}
                      placeholder="Nhập mật khẩu bên trên*"
                      handleChange={formik.handleChange}
                      id="confirmPassword"
                      ref={confirmPasswordRef}
                    />
                    <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                      <img
                        ref={eyeicon1Ref}
                        src={eyeslash}
                        alt="()"
                        onClick={changeConfirmPasswordType}
                      />
                    </div>
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                      <p className="text-red-600 mt-1 font-inter">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="email"
                  >
                    Email*
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Nhập email*"
                      value={formik.values.email}
                      handleChange={formik.handleChange}
                      id="email"
                    />
                    {formik.errors.email && formik.touched.email && (
                      <p className="text-red-600 mt-1 font-inter">{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="w-full mt-[32px] text-vinamilk-blue font-vs-std">
                  <label className="flex select-none items-start cursor-pointer">
                    <input
                      name="termsofuse"
                      value={formik.values.termsofuse}
                      onChange={formik.handleChange}
                      required=""
                      type="checkbox"
                      className="w-[18px] h-[18px] mt-[1px] rounded-sm border border-vinamilk-blue focus:ring-vinamilk-blue dark:focus:ring-vinamilk-blue text-vinamilk-blue cursor-pointer"
                    />
                    <div className="ml-2 font-vs-std">
                      <p className="transition-all font-inter text-[16px] text-vinamilk-blue not-italic font-[450] leading-[19px]">
                        Bằng việc tạo một tài khoản, bạn đồng ý với Vinamilk
                        <a className="inline italic underline font-vs-std" href="/">
                          Chính sách bảo mật
                        </a>{' '}
                        và{' '}
                        <a className="inline italic underline font-vs-std" href="/">
                          Điều khoản sử dụng
                        </a>
                        .
                      </p>
                    </div>
                  </label>
                  {formik.errors.termsofuse && formik.touched.termsofuse && (
                    <p className="text-red-600 mt-1 font-inter">{formik.errors.termsofuse}</p>
                  )}
                </div>
                <div className="flex items-center justify-center mt-[32px] md:justify-between">
                  <Button title="Đăng ký" type="submit" isDisable={!formik.values.termsofuse} />
                </div>
              </form>
              <div className="flex items-center justify-center mt-[32px]">
                <p className="transition-all font-vs-std lg:text-[16px] text-vinamilk-blue font-vinamilk-blue-light not-italic leading-[22.5px] lg:leading-[20px]">
                  Bạn đã có tài khoản?
                </p>
                <a href="/login">
                  <p className="transition-all font-vs-std text-vinamilk-blue font-vinamilk-blue-light italic ml-[2px] underline cursor-pointer">
                    Đăng nhập
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-10 text-vinamilk-blue px-4 h-full flex justify-center items-center">
          <div className="max-w-[500px] border border-vinamilk-blue rounded-[18px] p-[44px] lg:px-[24px]">
            <h4 className="transition-all text-center font-vs-std text-[36px] md:text-[32px] leading-[1] text-vinamilk-blue font-semibold not-italic mb-[48px] md:mb-8">
              Nhập mã OTP
            </h4>
            <p className="text-center font-medium mb-4 font-inter">
              Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác nhận đăng ký
            </p>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChangeOtp(e, index)}
                  className="w-8 h-8 text-center border border-vinamilk-blue focus:border-vinamilk-blue-light outline-none rounded"
                />
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4 sm:flex-col sm:space-x-0 sm:space-y-4">
              <Button
                title={'Gửi lại ' + (timeLeft !== null ? `(${timeLeft}s)` : '')}
                handleClick={handleResendOtp}
                isDisable={timeLeft !== null}
              />
              <Button title="Xác nhận" handleClick={handleSubmitOtp} />
            </div>
            {errorText && <p className="mt-6 font-inter text-red-600 text-center">{errorText}</p>}
          </div>
        </div>
      )}
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}
export default RegisterPage;
