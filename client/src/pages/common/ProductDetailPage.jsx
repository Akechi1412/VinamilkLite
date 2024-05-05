import { MainLayout } from '../../components/layout';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { productApi, productImageApi } from '../../api';
import { Button, Loading } from '../../components/common';
import parse from 'html-react-parser';

function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: productData } = await productApi.getProducts(`slug=${slug}`);
        setLoading(false);
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
      <div className="container px-10 py-10">
        <div className="flex lg:flex-col">
          <div className="slider-container overflow-hidden w-1/2 lg:w-full">
            <Slider className="!px-10" asNavFor={nav2} ref={(slider) => (sliderRef1 = slider)}>
              {productImages.map((image) => (
                <div className="border border-vinamilk-blue rounded-lg !h-[400px]" key={image.id}>
                  <img
                    className="!w-full !h-full !object-cover"
                    src={image.src}
                    alt={product.name}
                  />
                </div>
              ))}
            </Slider>
            <Slider
              className="!px-10 lg:hidden"
              asNavFor={nav1}
              ref={(slider) => (sliderRef2 = slider)}
              slidesToShow={5}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              {productImages.map((image) => (
                <div
                  className="!w-[100px] !aspect-square border border-vinamilk-blue-light rounded-lg"
                  key={image.id}
                >
                  <img src={image.src} alt={product.name} />
                </div>
              ))}
            </Slider>
          </div>
          <div className="w-1/2 lg:w-full flex-1 p-6">
            <h1 className="text-[5rem] font-[700] uppercase text-primary leading-[1] font-vsd-bold text-center">
              {product?.name}
            </h1>
            <div className="mt-4 text-primary">{parse(product?.description || '')}</div>
            <div className="flex flex-col items-center">
              {product?.sale_price !== null ? (
                <p className="font-inter text-[32px] mt-auto flex space-x-2">
                  <span className="line-through text-[#999]">{product?.price * count}₫</span>
                  <span className="text-primary">{product?.sale_price * count}₫</span>
                </p>
              ) : (
                <p className="font-light text-[32px] text-primary">{product?.price * count}</p>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-[140px]">
                  <button className="w-full flex items-center px-8 py-3 text-[20px] rounded-full border border-primary text-primary">
                    <span
                      onClick={() =>
                        setCount((count) => {
                          if (count === 1) return count;
                          return count - 1;
                        })
                      }
                      className={'flex-1' + (count === 1 ? ' text-gray-400' : '')}
                    >
                      -
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
                  <Button title="Thêm vào giỏ" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default ProductDetailPage;
