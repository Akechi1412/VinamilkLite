import { MainLayout } from '../../components/layout';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { newsCategoryApi, newsApi, userApi, commentApi } from '../../api';
import { Loading, CommentBlock, CommentInput } from '../../components/common';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';
import { UserCacheProvider } from '../../contexts';

function NewsDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [news, setNews] = useState(null);
  const [author, setAuthor] = useState(null);
  const [category, setCatgory] = useState(null);
  const [parentComments, setParentComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchComments = async () => {
    if (!news) return;

    try {
      setCommentLoading(true);
      const { data: commentData } = await commentApi.getComments(
        `news_id=${news.id}&parent_id_null&&_sort=-created_at&_page=${currentPage}&_per_page=10`
      );
      setParentComments((prevComments) => {
        const existingIds = new Set(prevComments.map((c) => c.id));
        const newComments = commentData.rows.filter((c) => !existingIds.has(c.id));

        return [...prevComments, ...newComments];
      });
      setTotalPages(commentData.pagination?.totalPages || 0);
      setCommentLoading(false);
    } catch (error) {
      setCommentLoading(false);
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const fetchParentComments = async () => {
    if (currentPage === 1) {
      await fetchComments();
    } else {
      setCurrentPage(1);
    }
  };

  const handleSubmit = async (comment) => {
    try {
      await commentApi.create({ news_id: news.id, content: comment });
      Swal.fire({
        title: 'Đã gửi!',
        text: 'Bình luận đã được gửi thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchParentComments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

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

  useEffect(() => {
    fetchComments();
  }, [news?.id, currentPage]);

  return (
    <MainLayout>
      <div className="my-20">
        <div className="container-sm px-5 md:px-4">
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
          <UserCacheProvider>
            <div className="text-primary mb-10">
              <h2 className="mb-5 font-vsd-regular text-[2.5rem] sm:text-[2rem]">Bình luận</h2>
              <div className="mx-auto max-w-5xl">
                <CommentInput type={'comment'} handleSubmit={handleSubmit} />
                {commentLoading ? (
                  <Loading />
                ) : (
                  <>
                    {parentComments.map((comment) => (
                      <CommentBlock
                        key={comment.id}
                        parentComment={comment}
                        fetchParentComments={fetchParentComments}
                        inNews
                      />
                    ))}
                  </>
                )}
              </div>
              {currentPage < totalPages && !commentLoading && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setCurrentPage((page) => page + 1)}
                    className="px-4 py-2 text-vinamilk-blue-light"
                  >
                    Xem bình luận cũ hơn
                  </button>
                </div>
              )}
            </div>
          </UserCacheProvider>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default NewsDetailPage;
