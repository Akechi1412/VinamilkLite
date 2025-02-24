import { MainLayout } from '../../components/layout';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { productApi, productImageApi, commentApi } from '../../api';
import {
  Button,
  Cart,
  Loading,
  Overlay,
  CommentBlock,
  CommentInput,
} from '../../components/common';
import parse from 'html-react-parser';
import { useCart } from '../../hooks';
import { UserCacheProvider } from '../../contexts';

function ProductDetailPage() {
  const { addToCart, getQuantityFromCart, increaseQuantity } = useCart();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [parentComments, setParentComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleAdd = () => {
    if (getQuantityFromCart(product.id) > 0) {
      increaseQuantity(product.id, count);
    } else {
      addToCart(product, count);
    }
    setCount(1);
    setShowCart(true);
  };

  const fetchComments = async () => {
    if (!product) return;

    try {
      setCommentLoading(true);
      const { data: commentData } = await commentApi.getComments(
        `product_id=${product.id}&parent_id_null&&_sort=-created_at&_page=${currentPage}&_per_page=10`
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
      await commentApi.create({ product_id: product.id, content: comment });
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
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: productData } = await productApi.getProducts(`slug=${slug}`);
        const product = productData.rows?.[0];
        if (product) {
          setProduct(product);
        } else {
          navigate('/collections/all-products', { replace: true });
          return;
        }
        const { data: imageData } = await productImageApi.getProductImages(
          `product_id=${product.id}`
        );
        let productImages = imageData.rows;
        if (product.thumbnail) {
          productImages = [{ id: 0, src: product.thumbnail }, ...productImages];
        }
        setProductImages(productImages);
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
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [product?.id, currentPage]);

  return (
    <MainLayout>
      <div className="container-sm px-5">
        <div className="flex lg:flex-col pb-12">
          <div className="slider-container overflow-hidden w-1/2 lg:w-full pt-4 pr-4 border-r lg:border-0 border-primary">
            <div style={{ width: '100%', aspectRatio: '1/1', padding: '0 24px' }}>
              <Slider
                asNavFor={nav2}
                ref={(slider) => (sliderRef1 = slider)}
                beforeChange={(oldIndex, newIndex) => setCurrentIndex(newIndex)}
              >
                {productImages.map((image) => (
                  <div key={image.id}>
                    <img
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      src={image.src}
                      alt={product.name}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div>
              <Slider
                asNavFor={nav1}
                ref={(slider) => (sliderRef2 = slider)}
                slidesToShow={5}
                swipeToSlide={true}
                focusOnSelect={true}
                className="-mt-12"
              >
                {productImages.map((image, index) => (
                  <div
                    className={`border rounded-lg !w-[70px] md:!w-[56px] ${
                      currentIndex === index ? 'border-primary' : 'border-tertiary'
                    }`}
                    key={image.id}
                  >
                    <img
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      src={image.src}
                      alt={product.name}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="w-1/2 lg:w-full flex-1 pl-4 border-l lg:border-0 border-primary pt-12">
            <h1 className="text-[5rem] font-[700] uppercase text-primary leading-[1] font-vsd-bold text-center lg:text-[3.5rem] sm:text-[2rem]">
              {product?.name}
            </h1>
            {product?.description && (
              <div className="mt-4 text-primary font-lora text-center p-1">
                {parse(product?.description)}
              </div>
            )}
            <div className="flex flex-col items-center mt-4 sm:flex-row">
              {product?.sale_price ? (
                <p className="flex-1 font-inter text-[28px] sm:text-[20px] mt-auto flex space-x-2 sm:space-x-0 items-baseline sm:flex-col sm:space-y-1 sm:mt-0">
                  <span className="text-[18px] sm:text-[20px] line-through text-[#999]">
                    {(product?.price * count).toLocaleString()}₫
                  </span>
                  <span className="text-primary">
                    {(product?.sale_price * count).toLocaleString()}₫
                  </span>
                </p>
              ) : (
                <p className="flex-1 font-inter text-[28px] sm:text-[20px] text-primary">
                  {(product?.price * count).toLocaleString()}₫
                </p>
              )}
              <div className="flex flex-1 items-center space-x-3 mt-3 sm:flex-col sm:space-x-0 sm:space-y-2">
                <div className="w-[140px] sm:w-[170px]">
                  <button className="w-full flex items-center px-8 py-3 text-[20px] rounded-full border border-primary text-primary">
                    <span
                      onClick={() =>
                        setCount((count) => {
                          if (count === 1) return count;
                          return count - 1;
                        })
                      }
                      className={'flex-1' + (count === 1 ? ' text-gray-400 cursor-default' : '')}
                    >
                      –
                    </span>
                    <span className="flex-1">{count}</span>
                    <span
                      onClick={() => {
                        setCount((count) => count + 1);
                      }}
                      className="flex-1"
                    >
                      +
                    </span>
                  </button>
                </div>
                <div className="w-[170px]">
                  <Button title="Thêm vào giỏ" handleClick={handleAdd} />
                </div>
              </div>
            </div>
          </div>
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
      {showCart && (
        <Overlay handleClickOut={() => setShowCart(false)}>
          <Cart handleClose={() => setShowCart(false)} />
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default ProductDetailPage;
