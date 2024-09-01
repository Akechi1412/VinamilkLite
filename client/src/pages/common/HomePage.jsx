import { MainLayout } from '../../components/layout';
import {
  AlternatingStripes,
  CollectionDesktop,
  CollectionMobile,
  Loading,
} from '../../components/common';
import { useEffect, useState } from 'react';
import { collectionApi, optionApi } from '../../api';
import Swal from 'sweetalert2';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState('');
  const [identityContent, setIdentityContent] = useState('');
  const [identityImage, setIdentityImage] = useState('');
  const [collectionList, setColllectionList] = useState([]);
  const { ref, inView } = useInView({ threshold: 0.5 });

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
        setHeroImage(options['hero-image']);
        setIdentityContent(options['identity-content']);
        setIdentityImage(options['identity-image']);

        const { data: colectionData } = await collectionApi.getCollections(
          '_sort=collection_order'
        );
        setColllectionList(colectionData.rows);

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
    <MainLayout hasTransitionHeader>
      <section id="hero">
        <div className="relative">
          <img className="max-h-screen w-full object-cover" src={heroImage} alt="Hero" />
          <h2 className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-vsd-bold text-[8rem] lg:text-[5rem] md:text-[3rem] sm:text-[2.5rem] text-secondary uppercase leading-[0.94] lg:leading-[0.95] animate-appear">
            <p>để tâm. đổi mới</p>
            <p>để tâm. Sáng tạo</p>
            <p>luôn là thế</p>
            <p>từ 1976</p>
          </h2>
          <div className="absolute w-full bottom-0 left-0 h-[26px]">
            <AlternatingStripes firstColor="transparent" secondColor="#D3E1FF" stripeWith={4} />
          </div>
        </div>
      </section>
      <section id="achievement">
        <div className="bg-tertiary">
          <div className="container py-[124px] md:py-[80px]">
            <h2 className="font-vsd-bold uppercase px-4 mb-[124px] md:mb-[30px] text-[5rem] lg:text-[4rem] md:text-[3rem] text-center text-primary leading-[0.95]">
              <p>48 năm vun đắp sức khoẻ người việt</p>
              <p>từ nam ra bắc</p>
            </h2>
            <div className="flex flex-wrap">
              <div className="w-1/4 md:w-1/2 flex flex-col px-6 md:px-4 md:pt-4 text-primary text-center">
                <div
                  ref={ref}
                  className={`transition-opacity duration-500 ${
                    inView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {inView && (
                    <div className="h-[128px] lg:h-[108px] md:h-[92px] mb-3 md:mb-0 text-[5rem] lg:text-[4rem] md:text-[3rem] font-vsd-bold uppercase leading-[1]">
                      <CountUp start={1} end={50} duration={2} />
                      <span>+</span>
                    </div>
                  )}
                </div>

                <p className="font-lora leading-[20px]">
                  Nhà máy, trang trại và đơn vị kinh doanh khắp cả nước
                </p>
              </div>
              <div className="w-1/4 md:w-1/2 flex flex-col px-6 md:px-4 md:pt-4 text-primary text-center">
                <div
                  ref={ref}
                  className={`transition-opacity duration-500 ${
                    inView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {inView && (
                    <div className="h-[128px] lg:h-[108px] md:h-[92px] mb-3 md:mb-0 text-[5rem] lg:text-[4rem] md:text-[3rem] font-vsd-bold uppercase leading-[1]">
                      <CountUp start={1} end={60} duration={2} />
                    </div>
                  )}
                </div>
                <p className="font-lora leading-[20px]">
                  Có mặt tại 60 quốc gia trên toàn thế giới
                </p>
              </div>
              <div className="w-1/4 md:w-1/2 flex flex-col px-6 md:px-4 md:pt-4 text-primary text-center">
                <div
                  ref={ref}
                  className={`transition-opacity duration-500 ${
                    inView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {inView && (
                    <div className="h-[128px] lg:h-[38px] md:h-[92px] mb-3 md:mb-0 text-[5rem] lg:text-[4rem] md:text-[3rem] font-vsd-bold uppercase leading-[1] flex flex-col items-center">
                      <CountUp start={1} end={500} duration={2} />
                      <span className="text-[3rem] lg:text-[2.8rem] md:text-[2.5rem] mt-2">
                        triệu
                      </span>
                    </div>
                  )}
                </div>
                <p className="font-lora leading-[20px]">Trẻ em được nuôi dưỡng bằng cả tấm lòng</p>
              </div>
              <div className="w-1/4 md:w-1/2 flex flex-col px-6 md:px-4 md:pt-4 text-primary text-center">
                <div
                  ref={ref}
                  className={`transition-opacity duration-500 ${
                    inView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="h-[128px] lg:h-[108px] md:h-[92px] mb-3 md:mb-0 text-[5rem] lg:text-[4rem] md:text-[3rem] font-vsd-bold uppercase leading-[1]">
                    <span className="relative after:absolute after:right-[-20px] md:after:right-[-15px] after:top-[10px] after:content-['st'] after:text-[1.875rem] after:md:text-[1.25rem]">
                      1
                    </span>
                  </div>
                </div>
                <p className="font-lora leading-[20px]">
                  Nhà máy net-zero bền vững đầu tiên của Châu Á
                </p>
              </div>
            </div>
          </div>
          <div className="h-[26px]">
            <AlternatingStripes firstColor="#FFFFF1" secondColor="#D3E1FF" stripeWith={4} />
          </div>
        </div>
      </section>
      <section id="indentity">
        <div className="container py-[90px] px-[42px]">
          <h2 className="font-vsd-bold uppercase px-4 mb-[48px] mt-[155px] lg:mt-0 md:mb-[30px] text-[5rem] lg:text-[4rem] md:text-[3rem] text-center text-primary leading-[0.95]">
            tận tay. tận tâm
          </h2>
          <div className="flex items-center -mx-4 lg:-mx-2 md:mx-0 md:flex-col md:space-y-5">
            <div className="w-2/3 px-3 lg:px-2 md:px-0 md:w-full">
              <div className="border border-primary p-5 md:p-4 rounded-lg text-primary font-inter text-justify">
                {identityContent}
              </div>
            </div>
            <div className="w-1/3 px-3 lg:px-2 md:w-full h-auto md:flex md:justify-center">
              <img
                className="object-fill md:w-[250px]"
                src={identityImage}
                alt="Tận tay, tận tâm"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="collections">
        <div className="container px-10 lg:px-6 md:px-4 pb-[90px]">
          <div className="md:hidden">
            <CollectionDesktop collectionList={collectionList} />
          </div>
          <div className="hidden md:block">
            <CollectionMobile collectionList={collectionList} />
          </div>
        </div>
      </section>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default HomePage;
