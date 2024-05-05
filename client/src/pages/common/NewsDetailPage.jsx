import { MainLayout } from '../../components/layout';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { newsCategoryApi, newsApi, userApi } from '../../api';
import { Loading } from '../../components/common';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';

function NewsDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);
  const [author, setAuthor] = useState(null);
  const [category, setCatgory] = useState(null);

  function formatDate(inputDate) {
    if (!inputDate) return '';
    const dateObj = new Date(inputDate);
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '/' + month + '/' + year;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: newsData } = await newsApi.getNews(`slug=${slug}`);
        const news = newsData.rows?.[0];
        setLoading(false);
        if (news) {
          setNews(news);
          if (news.author_id) {
            (async () => {
              const { data: authorData } = await userApi.getById(news.author_id);
              if (authorData) {
                setAuthor(authorData);
              }
              const { data: categoryData } = await newsCategoryApi.getById(news.category_id);
              if (categoryData) {
                setCatgory(categoryData);
              }
            })();
          }
        } else {
          navigate('/news-categories/all-news', { replace: true });
          return;
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

  return (
    <MainLayout>
      <div className="my-20">
        <div className="container-sm">
          <div>
            <p className="italic text-primary font-lora">{category?.name || 'Tin tức'}</p>
            <h1 className="font-vs-std font-bold text-[4rem] md:text-[2.8rem] text-primary my-4 uppercase leading-[1]">
              {news?.title || ''}
            </h1>
            <p className="font-inter text-primary space-x-4">
              <span>Ngày đăng: {formatDate(news?.created_at)}</span>
              {author && (
                <span>
                  Tác giả: {author.last_name} {author.first_name}
                </span>
              )}
            </p>
          </div>
          <div className="-mx-4 text-primary mt-8">
            <ReactQuill value={news?.content || ''} readOnly={true} theme={'bubble'} />
          </div>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default NewsDetailPage;
