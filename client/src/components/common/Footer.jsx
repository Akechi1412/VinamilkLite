import AlternatingStripes from './AlternatingStripes';
import GooglePlayIcon from '../../assets/images/google-play.svg';
import AppStoreIcon from '../../assets/images/app-store.svg';
import FacebookIcon from '../../assets/images/facebook.svg';
import Instagram from '../../assets/images/instagram.svg';
import LinkedinIcon from '../../assets/images/linkedin.svg';
import YoutubeIcon from '../../assets/images/youtube.svg';
import TiktokIcon from '../../assets/images/tiktok.svg';
import CertificateImage from '../../assets/images/certificate.webp';
import { useEffect, useState } from 'react';
import { optionApi } from '../../api';

function Footer() {
  const [footerMenu, setFooterMenu] = useState([]);
  const [socialLink, setSocialLink] = useState([]);
  const [certificateInfo, setCertificateInfo] = useState('');
  const [certificateLink, setCertificateLink] = useState('/');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data: optionData } = await optionApi.getOptions();
        const optionArray = optionData.rows;
        const options = {};
        optionArray.forEach((option) => {
          options[option.option_key] = option.option_value;
        });
        setFooterMenu(JSON.parse(options['footer-menu'])?.slice(0, 4));
        setEmail(options['email']);
        setSocialLink(JSON.parse(options['social-link']));
        setCertificateInfo(options['certificate-info']);
        setCertificateLink(options['certificate-link']);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <footer>
      <div className="h-[60px]">
        <AlternatingStripes firstColor="#FFFFF1" secondColor="#0213AF" stripeWith={7.24} />
      </div>
      <div className="bg-primary">
        <div className="container px-10 lg:px-6 md:px-4">
          <div className="py-[64px] md:py-[48px] border-b border-secondary">
            <div className="flex space-x-[90px] lg:space-x-0 lg:block">
              <div>
                <div className="flex space-x-3 mb-10">
                  <img
                    className="w-[80px] h-auto object-contain"
                    src={GooglePlayIcon}
                    alt="Google Play"
                  />
                  <img
                    className="w-[80px] h-auto object-contain"
                    src={AppStoreIcon}
                    alt="App Store"
                  />
                </div>
                <div className="flex space-x-3 mb-4">
                  <a href={socialLink?.facebook || '/'}>
                    <img className="w-8 h-8" src={FacebookIcon} alt="Facebook" />
                  </a>
                  <a href={socialLink?.instagram || '/'}>
                    <img className="w-8 h-8" src={Instagram} alt="Instagram" />
                  </a>
                  <a href={socialLink?.linkedin || '/'}>
                    <img className="w-8 h-8" src={LinkedinIcon} alt="Linkedin" />
                  </a>
                  <a href={socialLink?.youtube || '/'}>
                    <img className="w-8 h-8" src={YoutubeIcon} alt="Youtube" />
                  </a>
                  <a href={socialLink?.tiktok || '/'}>
                    <img className="w-8 h-8" src={TiktokIcon} alt="Tiktok" />
                  </a>
                </div>
                <p className="text-white font-inter text-[0.75rem]">Email của CH: {email || ''}</p>
              </div>
              <div className="flex-1 flex flex-wrap justify-end -mx-4 text-white lg:justify-start lg:mt-5 md:space-y-4 sm:block sm:mx-0">
                {footerMenu.map((column, index) => (
                  <div className="w-1/4 px-2 md:w-1/2 sm:px-0" key={index}>
                    <h3 className="font-inter font-[600] mb-2">{column.title}</h3>
                    <ul>
                      {column.items?.map((item, index) => (
                        <li className="py-[6px]" key={index}>
                          <a className="font-lora hover:underline" href={item.href || '/'}>
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-6 space-x-3">
            <div className="text-white font-inter">
              <p className="mb-2">Bản quyền thuộc về Vinamilk &copy; 2023</p>
              {certificateInfo && <p>{certificateInfo}</p>}
            </div>
            <div className="shrink-0 sm:hidden">
              <a className="block" href={certificateLink || '/'}>
                <img
                  className="w-[140px] h-[50px] object-fill"
                  src={CertificateImage}
                  alt="Đăng ký với Bộ Công Thương"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
