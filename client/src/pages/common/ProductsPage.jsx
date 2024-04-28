import { MainLayout } from '../../components/layout';
// import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ProductsPage.scss';
import data from './mock/mock-image.json';
import collection from './mock/mock-collection.json';
import { useState } from 'react';
import brand from './mock/mock-brand.json';
import product from './mock/mock-product.json';
import producttype from './mock/mock-producttype.json';
import packing from './mock/mock-packingtype.json';

function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = product.slice(firstIndex, lastIndex);
  const npage = Math.ceil(product.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  function nextPage() {
    console.log(currentPage);
    console.log(lastIndex);
    if (currentPage != lastIndex) setCurrentPage(currentPage + 1);
  }

  function prePage() {
    console.log(currentPage);
    console.log(lastIndex);
    if (currentPage != firstIndex) setCurrentPage(currentPage - 1);
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  const [collec, setCollec] = useState(null);

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

  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <MainLayout>
      <div className="h-[60px] lg:h-[0px]"></div>
      <div className="font-vs-std text-vinamilk-blue bg-secondary">
        <div className="bg-vinamilk-blue text-vinamilk-cream">
          <div className="transition-all slider-container w-[90%] m-auto py-[20px]">
            <Slider {...settings}>
              <div className="text-center" onClick={() => setCollec(null)}>
                Tất cả sản phẩm
              </div>
              {collection.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="text-center"
                    id={item.id}
                    onClick={() => setCollec(item.name)}
                  >
                    {item.name}
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
        <div className="h-auto w-[90%] m-auto">
          <Slider {...settings2}>
            {data.map((data) => (
              <img src={data.image} alt="" key={data.id} />
            ))}
          </Slider>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="col-span-2 text-[60px]">{collec ? collec : 'Tất cả sản phẩm'}</div>
          <div className="self-center font-inter italic">
            Xếp theo:
            <select name="" id="sort" className="font-vs-std text-[19px] bg-secondary">
              <option value="hot">Bán chạy nhất</option>
              <option value="new">Sảm phẩm mới</option>
              <option value="price-low">Giá: Thấp - Cao</option>
              <option value="price-high">Giá: Cao - Thấp</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <select
            name=""
            id=""
            className="bg-secondary font-vs-std border border-vinamilk-blue rounded-3xl p-[10px] cursor-pointer"
          >
            <option value="all">Thương hiệu</option>
            {brand.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            className="bg-secondary font-vs-std border border-vinamilk-blue rounded-3xl p-[10px] cursor-pointer"
          >
            <option value="all">Loại sản phẩm</option>
            {producttype.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            className="bg-secondary font-vs-std border border-vinamilk-blue rounded-3xl p-[10px] cursor-pointer"
          >
            <option value="all">Quy cách đóng gói</option>
            {packing.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <div
            name=""
            id=""
            className="bg-secondary font-vs-std border border-vinamilk-blue rounded-3xl p-[10px] cursor-pointer"
          >
            Xem toàn bộ
          </div>
          <div name="" id="" className="bg-secondary font-vs-std p-[10px] cursor-pointer">
            Xóa bộ lọc
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {records.map((data) => (
            <div key={data.id} className="border border-vinamilk-blue rounded-3xl overflow-hidden">
              <a href="#">
                <img src={data.image} alt="" key={data.id} />
              </a>
              <p className="pl-4 text-[30px]">{data.name}</p>
              <div className="flex pl-4">
                <p className="pr-4 line-through">{data.price} VNĐ</p>
                <p>{data.sale} VNĐ</p>
              </div>
              <div className="w-[50%] h-[50px] m-auto border flex items-center justify-center border-vinamilk-blue rounded-3xl cursor-pointer bg-vinamilk-blue text-vinamilk-cream">
                <div className="text-[18px]">Thêm vào giỏ hàng</div>
              </div>
              <div className="p-1"></div>
            </div>
          ))}
        </div>
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <a
                href=""
                onClick={() => prePage()}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </a>
            </li>
            {numbers.map((n, i) => (
              <li key={i} aria-current={currentPage == n ? 'page' : ''}>
                <a
                  href=""
                  onClick={() => changeCPage(n)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {n}
                </a>
              </li>
            ))}
            <li>
              <a
                href=""
                onClick={() => nextPage()}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </MainLayout>
  );
}

export default ProductsPage;
