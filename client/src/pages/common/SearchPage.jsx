import { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout';
import { useLocation } from 'react-router-dom';
import { newsApi, productApi } from '../../api';
import Swal from 'sweetalert2';
import { Loading, NewsList, ProductList, Tab } from '../../components/common';

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('q');
  const [productList, setProductList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: productData } = await productApi.getProducts(
          `hidden_ne=1&name_like=${keyword}&_page=1&_per_page=20`
        );
        setProductList(productData.rows);
        setTotalProducts(productData.pagination?.totalRows || 0);
        const { data: newsData } = await newsApi.getNews(
          `status=published&title_like=${keyword}&_page=1&_per_page=20`
        );
        setNewsList(newsData.rows);
        setTotalNews(newsData.pagination?.totalRows || 0);
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
  }, [location]);

  return (
    <MainLayout>
      <div className="container">
        <div className="text-[2rem] text-primary text-center font-vs-std mt-[80px] mb-[40px] font-[600]">
          Kết quả tìm kiếm cho: {`"${keyword}"`}
        </div>
        <div className="flex space-x-3 my-6 justify-center">
          <Tab
            title={`Sản phẩm (${totalProducts})`}
            isActive={activeTab === 0}
            handleClick={() => setActiveTab(0)}
          />
          <Tab
            title={`Tin tức (${totalNews})`}
            isActive={activeTab === 1}
            handleClick={() => setActiveTab(1)}
          />
        </div>
        <div className="mb-10">
          {activeTab === 0 && (
            <div>
              <ProductList productList={productList} />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <NewsList newsList={newsList} />
            </div>
          )}
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </MainLayout>
  );
}

export default SearchPage;
