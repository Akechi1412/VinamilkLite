import { MainLayout } from '../../components/layout';
import { AboutSection, AlternatingStripes, Loading } from '../../components/common';
import { useState, useEffect } from 'react';
import LeftButterflyImage from '../../assets/images/left-butterfly.webp';
import RightButterflyImage from '../../assets/images/right-butterfly.webp';
import MouseImage from '../../assets/images/mouse.svg';
import { optionApi } from '../../api';
import Swal from 'sweetalert2';
import DefaultImage from '../../assets/images/default.jpg';
import QuoteImage from '../../assets/images/quote.svg';

function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [aboutImage, setAboutImage] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');
  const [aboutQuote, setAboutQuote] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const colorList = ['#3459ff', '#087e30', '#85249e'];

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
        setAboutImage(options['about-image']);
        setAboutTitle(options['about-title']);
        setAboutDesc(options['about-desc']);
        setAboutQuote(options['about-quote']);
        setSectionList(JSON.parse(options['about-sections']));
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
      <section className="">
        <div className="bg-primary h-[calc(100vh-72px)] relative">
          <div className="h-full flex justify-center items-center">
            <div className="relative">
              <h2 className="font-vsd-bold leading-[0.95] text-secondary text-center text-[10rem] lg:text-[8rem] md:text-[6rem] p-5 md:p-4">
                <p>Câu chuyện</p>
                <p>Vinamilk</p>
              </h2>
              <img
                className="absolute left-0 bottom-0 -translate-x-1/2 sm:translate-x-0 translate-y-1/2 w-[70px] md:w-[38px] md:max-h-[50px] max-h-[80px] object-contain"
                src={LeftButterflyImage}
                alt=""
              />
              <img
                className="absolute right-0 top-0 translate-x-1/2 sm:translate-x-0 -translate-y-1/2 w-[70px] md:w-[38px] md:max-h-[50px] max-h-[80px] object-contain"
                src={RightButterflyImage}
                alt=""
              />
            </div>
          </div>
          <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 lg:hidden">
            <img
              className="w-[52px] h-[52px] object-contain animate-bounce"
              src={MouseImage}
              alt="Mouse"
            />
          </div>
        </div>
        <div className="h-6">
          <AlternatingStripes firstColor="transparent" secondColor="#0213AF" stripeWith={10} />
        </div>
      </section>
      <section>
        <div className="container-sm px-[90px] py-[90px] lg:px-[64px] md:px-[48px] md:py-[64px]">
          <div className="flex flex-wrap md:flex-col md:items-center -mx-6 md:mx-0 md:space-y-5">
            <div className="w-1/2 px-3 md:px-0 md:w-full flex flex-col items-center text-primary space-y-4">
              <img
                className="w-[200px] aspect-square rounded-full"
                src={aboutImage || DefaultImage}
                alt={aboutTitle || ''}
              />
              <h4 className="font-vs-std text-[2rem] sm:text-[1.7rem]">{aboutTitle || ''}</h4>
              <p className="max-w-[250px] font-lora text-center">{aboutDesc || ''}</p>
            </div>
            <div className="w-1/2 px-3 md:px-0 md:w-full">
              <img className="w-[42px]" src={QuoteImage} alt="''" />
              <p className="font-vs-std text-[2rem] sm:text-[1.7rem] text-primary">
                {aboutQuote || ''}
              </p>
            </div>
          </div>
        </div>
      </section>
      {sectionList.map((section, index) => (
        <AboutSection
          key={index}
          bgColor={colorList[index % colorList.length]}
          sectionData={section}
        />
      ))}
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default AboutPage;
