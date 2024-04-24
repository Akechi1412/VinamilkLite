import { useFormik } from 'formik';
import * as Yup from 'yup';
import eye from '../../assets/images/eye-solid.svg';
import eyeslash from '../../assets/images/eye-slash-solid.svg';
import { MainLayout } from '../../components/layout';

function RegisterPage() {
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      email: '',
      termsofuse: false,
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string()
        .required('Tên là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Vui lòng đặt tên'
        )
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(30, 'Tên có nhiều nhất 30 ký tự'),
      lastname: Yup.string()
        .required('Họ là bắt buộc')
        .matches(
          '^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$',
          'Vui lòng đặt tên'
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
        .oneOf([Yup.ref('password')], 'Mật khẩu không tương đồng'),
      email: Yup.string().required('Email là bắt buộc').email('Hãy nhập đúng định dạng email'),
      termsofuse: Yup.bool().oneOf(
        [true],
        'Bạn cần đồng ý với Chính sách bảo mật và Điều khoản sử dụng'
      ),
    }),
    onSubmit: (values) => {
      console.log(values);
      alert('Đăng ký thành công');
    },
  });
  const changeType = () => {
    let eyeicon = document.getElementById('eyeicon');
    let password = document.getElementById('password');
    if (password.type == 'password') {
      password.type = 'text';
      eyeicon.src = eyeslash;
    } else {
      password.type = 'password';
      eyeicon.src = eye;
    }
  };

  const changeType2 = () => {
    let eyeicon = document.getElementById('eyeicon2');
    let password = document.getElementById('confirmPassword');
    if (password.type == 'password') {
      password.type = 'text';
      eyeicon.src = eyeslash;
    } else {
      password.type = 'password';
      eyeicon.src = eye;
    }
  };

  return (
    <MainLayout hasTransitionHeader>
      <div className="h-[40px]"></div>
      <div className="flex-grow text-vinamilk-blue bg-secondary pt-0">
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
              Một tài khoản. Hàng tấn lợi ích. Khả năng vô tận. Thành viên của chúng tôi bao gồm các
              lợi ích sau:
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
                  <p className="leading-10 transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
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
                  <p className="leading-10 transition-all font-vs-std text-[16px] leading-tight text-vinamilk-blue font-[450] not-italic mb-[36px]">
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
                  className="transition-all font-vs-std text-[16px] text-vinamilk-blue font-normal italic mb-[8px] flex !font-[450] leading-[19px]"
                  htmlFor="firstName"
                >
                  Tên*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px]"
                    placeholder="Nhập tên*"
                    // id="email"
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    // required
                    // aria-label="Nhập email"
                    // variant="default"
                  />
                  {formik.errors.firstname && formik.touched.firstname && (
                    <p className="errorMsg text-red-500">{formik.errors.firstname}</p>
                  )}
                </div>
              </div>
              <div className="relative flex flex-col justify-center mb-[24px]">
                <label
                  className="transition-all font-vs-std text-[16px] text-vinamilk-blue font-normal italic mb-[8px] flex !font-[450] leading-[19px]"
                  htmlFor="lastName"
                >
                  Họ*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px]"
                    placeholder="Nhập họ*"
                    // id="email"
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    // required
                    // aria-label="Nhập email"
                    // variant="default"
                  />
                  {formik.errors.lastname && formik.touched.lastname && (
                    <p className="errorMsg text-red-500">{formik.errors.lastname}</p>
                  )}
                </div>
              </div>
              <div className="relative flex flex-col justify-center mb-[24px]">
                <label
                  className="transition-all font-vs-std text-[16px] text-vinamilk-blue font-normal italic mb-[8px] flex !font-[450] leading-[19px]"
                  htmlFor="password"
                >
                  Mật khẩu*
                </label>
                <div className="inline-block">
                  <input
                    type="password"
                    className="w-full h-[51px] rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px]"
                    placeholder="Nhập mật khẩu*"
                    // id="password"
                    name="password"
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    // required
                    // aria-label="Nhập mật khẩu"
                    // variant="default"
                  />
                  <div className="h-auto w-[24px] cursor-pointer absolute right-0 top-10 right-2">
                    <img id="eyeicon" src={eye} alt="eyeicon" onClick={changeType} />
                  </div>
                  {formik.errors.password && formik.touched.password && (
                    <p className="errorMsg text-red-500">{formik.errors.password}</p>
                  )}
                </div>
              </div>

              <div className="relative flex flex-col justify-center mb-[24px]">
                <label
                  className="transition-all font-vs-std text-[16px] text-vinamilk-blue font-normal italic mb-[8px] flex !font-[450] leading-[19px]"
                  htmlFor=""
                >
                  Xác nhận mật khẩu*
                </label>
                <div className="inline-block">
                  <input
                    type="password"
                    className="w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px]"
                    placeholder="Nhập mật khẩu bên trên*"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    // required
                    // aria-label="Xác nhận mật khẩu"
                    // variant="default"
                  />
                  <div className="h-auto w-[24px] cursor-pointer absolute right-0 top-10 right-2">
                    <img id="eyeicon2" src={eye} alt="eyeicon" onClick={changeType2} />
                  </div>
                  {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                    <p className="errorMsg text-red-500">{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="relative flex flex-col justify-center mb-[24px]">
                <label
                  className="transition-all font-vs-std text-[16px] text-vinamilk-blue font-normal italic mb-[8px] flex !font-[450] leading-[19px]"
                  htmlFor=""
                >
                  Email*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px]"
                    placeholder="Nhập email*"
                    // id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    // required
                    // aria-label="Nhập email"
                    // variant="default"
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="errorMsg text-red-500">{formik.errors.email}</p>
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
                    <p className="transition-all font-inter text-[16px] text-vinamilk-blue font-normal not-italic !font-[450] leading-[19px]">
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
                  <p className="errorMsg text-red-500">{formik.errors.termsofuse}</p>
                )}
              </div>
              <div className="w-full mt-[32px] text-vinamilk-blue font-vs-std">
                <label className="flex select-none items-start cursor-pointer">
                  <input
                    name="formoreinformation"
                    required=""
                    type="checkbox"
                    className="w-[18px] h-[18px] mt-[1px] rounded-sm border border-vinamilk-blue focus:ring-vinamilk-blue dark:focus:ring-vinamilk-blue text-vinamilk-blue cursor-pointer"
                  />
                  <div className="ml-2 (font-vs-std)">
                    <p className="transition-all font-inter text-[16px] text-vinamilk-blue font-normal not-italic !font-[450] leading-[19px]">
                      Cho phép Vinamilk liên hệ với bạn về các chương trình khuyến mãi, ưu đãi và
                      mục đích tiếp thị
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-center mt-[32px] md:justify-between">
                <button
                  // disabled={!(formik.isValid && formik.dirty)}
                  type="submit"
                  className="hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white border-[1px] transition-all duration-200 rounded-full text-paragraph min-w-12 inline-flex items-center outline-none justify-center px-[32px] py-[15px] min-h-[56px] bg-[rgba(29,27,32,0.12)] border-transparent w-full h-[60px] font-normal cursor-pointer opacity-100 bg-black-400"
                  // cursor-not-allowed
                >
                  <div className="flex items-center text-center text-[16px] leading-[24px]">
                    Đăng ký
                  </div>{' '}
                </button>
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
    </MainLayout>
  );
}
export default RegisterPage;
