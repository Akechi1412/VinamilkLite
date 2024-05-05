import { MainLayout } from '../../components/layout';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { newsCategoryApi, newsApi } from '../../api';
import { Loading, NewsList } from '../../components/common';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function NewsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newsCategoryList, setNewsCategoryList] = useState([]);
  const [newsMap, setNewsMap] = useState(new Map());
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsCategory, setNewsCategory] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const mutateNews = async () => {
    try {
      let paramString = '';
      if (newsCategory) {
        navigate(`/news-categories/${newsCategory.slug}`);
        paramString = `_page=${currentPage}&category_id=${newsCategory.id}&status=published&_sort=-created_at`;
      } else {
        navigate('/news-categories/all-news');
        paramString = `_page=${currentPage}&status=published&_sort=-created_at`;
      }
      const { data: newsData } = await newsApi.getNews(paramString);
      setTotalPages(newsData.pagination?.totalPages || 0);
      setNewsMap((newsMap) => {
        newsMap.set(currentPage, newsData.rows);
        setNewsList(Array.from(newsMap.values()).flat());
        return newsMap;
      });
      console.log(newsMap);
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: categoryData } = await newsCategoryApi.getCategories('_sort=cate_order');
        setNewsCategoryList(categoryData.rows);
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

  useEffect(() => {
    if (!slug || slug === 'all-news') {
      navigate('/news-categories/all-news');
      setNewsCategory(null);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const { data } = await newsCategoryApi.getCategories(`slug=${slug}`);
        const category = data.rows?.[0];
        if (category) {
          setNewsCategory(category);
        } else {
          setNewsCategory(null);
        }
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
  }, [slug]);

  useEffect(() => {
    mutateNews();
  }, [currentPage, newsCategory]);

  return (
    <MainLayout>
      <div className="font-inter text-vinamilk-blue bg-secondary">
        <div className="bg-vinamilk-blue text-secondary">
          <div className="transition-all slider-container w-[90%] mx-auto py-4 px-6">
            <Slider {...settings}>
              <div onClick={() => setNewsCategory(null)} className="cursor-pointer text-center">
                Tất cả tin tức
              </div>
              {newsCategoryList.map((newsCategory) => {
                return (
                  <div
                    onClick={() => setNewsCategory(newsCategory)}
                    key={newsCategory.id}
                    className="cursor-pointer text-center"
                    id={newsCategory.id}
                  >
                    {newsCategory.name}
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
      <div>
        <div className="container-sm px-5 md:py-4 py-10">
          <h1 className="font-vs-std font-semibold text-[3.5rem] md:text-[2.8rem] text-primary mt-10 mb-5 text-center uppercase">
            {newsCategory?.name ? 'Tin tức - ' + newsCategory?.name : 'Tất cả tin tức'}
          </h1>

          <NewsList newsList={newsList} />
          <div className="mt-5 flex justify-center mb-20">
            {currentPage < totalPages ? (
              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                className="px-8 py-4 rounded-full border border-primary text-primary"
              >
                Xem thêm tin tức
              </button>
            ) : (
              <p className="text-xl text-primary">Bạn đã xem hết tin</p>
            )}
          </div>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default NewsPage;
