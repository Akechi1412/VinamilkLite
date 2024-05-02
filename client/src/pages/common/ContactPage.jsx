import { MainLayout } from '../../components/layout';
import AddressIcon from '../../assets/images/address.svg';
import PhoneIcon from '../../assets/images/phone.svg';
import FaxIcon from '../../assets/images/fax.svg';
import MailIcon from '../../assets/images/mail.svg';
import { useEffect, useState } from 'react';
import { Loading, Input, TextArea, Button } from '../../components/common';
import Swal from 'sweetalert2';
import { contactApi, optionApi } from '../../api';

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [contactImage, setContactImage] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactFax, setContactFax] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contentError, setContentError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
    const fullName = event.target.value.trim();
    const alphaRegex =
      /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    if (fullName === '') {
      setFullNameError('Họ và tên bắt buộc!');
      return;
    }
    if (fullName.length < 2 || fullName.length > 50) {
      setFullNameError('Họ và tên phải có độ dài từ 2 đến 50 ký tự!');
      return;
    }
    if (!alphaRegex.test(fullName)) {
      setFullNameError('Họ và tên không được chứa số hoặc ký tự đặc biệt!');
      return;
    }
    setFullNameError('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    const email = event.target.value.trim();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (email === '') {
      setEmailError('Email là bắt buộc!');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ!');
      return;
    }
    setEmailError('');
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    const content = event.target.value.trim();
    if (content === '') {
      setContentError('Nội dung là bắt buộc!');
      return;
    }
    if (content.length > 10000) {
      setContent('Nội dung có tối đa 10000 ký tự');
      return;
    }
    setContentError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await contactApi.submit({ full_name: fullName, email, content });
      setFullName('');
      setEmail('');
      setContent('');
      setLoading(false);
      await Swal.fire({
        icon: 'success',
        title: 'Gửi liên hệ thành công',
        text: 'Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất',
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
    if (!mounted) {
      setDisabled(true);
      setMounted(true);
      return;
    }
    if (fullNameError || emailError || contentError) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [fullNameError, emailError, contentError]);

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
        setContactImage(options['contact-image']);
        setContactAddress(options['contact-address']);
        setContactPhone(options['contact-phone']);
        setContactFax(options['contact-fax']);
        setContactEmail(options['contact-email']);

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

  return (
    <MainLayout>
      <div className="py-[64px] lg:py-[32px]">
        <div className="container-sm px-5 lg:px-4 text-primary">
          <div className="flex space-x-6 lg:block lg:space-x-0 lg:space-y-8">
            <div className="w-[312px] md:w-full shrink-0">
              <img
                className="rounded-2xl w-full aspect-[3/2]"
                src={contactImage}
                alt="Trụ sở chính Công ty cổ phần Vinamilk"
              />
              <div className="py-8">
                <p className="lora font-lora italic mb-2">Trụ sở chính</p>
                <h2 className="font-vs-std  font-semibold text-[2rem] md:text-[1.5rem] leading-[1]">
                  Công ty Cổ Phần Sữa Việt Nam (Vinamilk)
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex font-lora space-x-2">
                  <img className="w-6 h-6" src={AddressIcon} alt="Address" />
                  <p className="leading-[1.15]">{contactAddress}</p>
                </div>
                <div className="flex font-lora space-x-2">
                  <img className="w-6 h-6" src={PhoneIcon} alt="Address" />
                  <p className="leading-[1.15]">{contactPhone}</p>
                </div>
                <div className="flex font-lora space-x-2">
                  <img className="w-6 h-6" src={FaxIcon} alt="Address" />
                  <p className="leading-[1.15]">{contactFax}</p>
                </div>
                <div className="flex font-lora space-x-2">
                  <img className="w-6 h-6" src={MailIcon} alt="Address" />
                  <p className="leading-[1.15]">{contactEmail}</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl border border-primary p-[44px] md:p-[32px] sm:p-[24px]">
                <h3 className="font-vs-std  font-semibold text-[2rem] md:text-[1.5rem] leading-[1] mb-2">
                  Liên hệ với chúng tôi
                </h3>
                <p className="font-lora leading-[1.25] mb-6">
                  Mọi thắc mắc và yêu cầu cần hỗ trợ từ Vinamilk, vui lòng để lại thông tin tại đây.
                  Chúng tôi sẽ xem xét và gửi phản hồi sớm nhất.
                </p>
                <form action="">
                  <div className="relative flex flex-col justify-center mb-[24px]">
                    <label
                      className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                      htmlFor="fullName"
                    >
                      Họ và tên*
                    </label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Nhập họ và tên*"
                        value={fullName}
                        handleChange={handleFullNameChange}
                      />
                      {fullNameError && (
                        <p className="text-red-600 mt-1 font-inter">{fullNameError}</p>
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
                        id="email"
                        type="text"
                        placeholder="Nhập địa chỉ email*"
                        value={email}
                        handleChange={handleEmailChange}
                      />
                      {emailError && <p className="text-red-600 mt-1 font-inter">{emailError}</p>}
                    </div>
                  </div>
                  <div className="relative flex flex-col justify-center mb-[24px]">
                    <label
                      className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                      htmlFor="content"
                    >
                      Nội dung*
                    </label>
                    <div className="relative">
                      <TextArea
                        id="content"
                        type="text"
                        placeholder="Nhập nội dung cho thông tin liên hệ*"
                        value={content}
                        handleChange={handleContentChange}
                      />
                      {contentError && (
                        <p className="text-red-600 mt-1 font-inter">{contentError}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-[230px] lg:w-full mt-4">
                    <Button
                      title="Gửi"
                      type="submit"
                      isDisable={disabled}
                      handleClick={handleSubmit}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default ContactPage;
