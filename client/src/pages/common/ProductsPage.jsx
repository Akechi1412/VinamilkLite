import { MainLayout } from '../../components/layout';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { collectionApi, productApi } from '../../api';
import { Loading, ProductList } from '../../components/common';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

function ProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collectionList, setCollectionList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [collection, setCollection] = useState(null);

  const mutateProducts = async () => {
    setLoading(true);
    try {
      const { data: productData } = await productApi.getProducts(
        `_page=${currentPage}&_per_page=12`
      );
      setProductList(productData.rows);
      setTotalPages(productData.pagination?.totalPages || 0);
      setTotalRows(productData.pagination?.totalRows || 0);
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

  const handlePageChange = (event) => {
    setCurrentPage(event.selected + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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
        const { data: collectionData } = await collectionApi.getCollections(
          '_sort=collection_order'
        );
        setCollectionList(collectionData.rows);
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
    if (!slug || slug === 'all-products') {
      navigate('/collections/all-products');
      setCollection(null);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const { data } = await collectionApi.getCollections(`slug=${slug}`);
        const collection = data.rows?.[0];
        if (collection) {
          setCollection(collection);
        } else {
          setCollection(null);
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
    (async () => {
      let paramString = '';
      if (collection) {
        navigate(`/collections/${collection.slug}`);
        paramString = `_page=${currentPage}&_per_page=12&collection_id=${collection.id}&hidden_ne=1`;
      } else {
        navigate('/collections/all-products');
        paramString = `_page=${currentPage}&_per_page=12&hidden_ne=1`;
      }
      const { data: productData } = await productApi.getProducts(paramString);
      setProductList(productData.rows);
      setTotalPages(productData.pagination?.totalPages || 0);
      setTotalRows(productData.pagination?.totalRows || 0);
      setLoading(false);
    })();
  }, [collection]);

  useEffect(() => {
    mutateProducts();
    return mutateProducts.cancel;
  }, [currentPage]);

  return (
    <MainLayout>
      <div className="font-inter text-vinamilk-blue bg-secondary">
        <div className="bg-vinamilk-blue text-secondary">
          <div className="transition-all slider-container w-[90%] mx-auto py-4 px-6">
            <Slider {...settings}>
              <div onClick={() => setCollection(null)} className="cursor-pointer text-center">
                Tất cả sản phẩm
              </div>
              {collectionList.map((collection) => {
                return (
                  <div
                    onClick={() => setCollection(collection)}
                    key={collection.id}
                    className="cursor-pointer text-center"
                    id={collection.id}
                  >
                    {collection.name}
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
      <div>
        <div className="container-sm px-5 md:py-4 py-10">
          <h1 className="font-vs-std font-semibold text-[3rem] text-primary mb-5">
            {collection?.name || 'Tất cả sản phẩm'}
          </h1>
          <ProductList productList={productList} />
          <div className="text-primary font-inter font-[500] mt-6 flex items-end justify-between md:flex-col lg:space-y-4">
            <p>
              Đang hiển thị {productList.length} trên tổng số {totalRows}
            </p>
            <ReactPaginate
              activeClassName={'text-primary'}
              breakClassName={'text-vinamilk-blue-light'}
              breakLabel={'...'}
              containerClassName={'flex items-center'}
              disabledLinkClassName={'text-vinamilk-blue-light cursor-default'}
              disabledClassName={'bg-gray-50'}
              marginPagesDisplayed={2}
              nextClassName={'mx-2 rounded'}
              nextLabel={'›'}
              onPageChange={handlePageChange}
              pageCount={totalPages}
              pageClassName={'mx-2 text-vinamilk-blue-light'}
              pageRangeDisplayed={3}
              previousClassName={'mx-2 rounded'}
              previousLabel={'‹'}
              previousLinkClassName={'block p-2 text-primary'}
              nextLinkClassName={'block p-2 text-primary'}
              pageLinkClassName={'block p-2 rounded'}
              activeLinkClassName={'text-primary'}
            />
          </div>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default ProductsPage;
