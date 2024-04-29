import { MainLayout } from '../../components/layout';
// import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ProductsPage.scss';
import data from './mock/mock-image.json';
import collection from './mock/mock-collection.json';
import brand from './mock/mock-brand.json';
import product from './mock/mock-product.json';
import producttype from './mock/mock-producttype.json';
import packing from './mock/mock-packingtype.json';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

function ProductsPage() {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(product.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(product.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, product]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % product.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

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
        <div className="grid grid-cols-3 gap-4 pt-4 mx-10">
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
        <div className="flex gap-4 pt-4 mx-10">
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
        <div className="flex flex-wrap justify-center gap-4 py-4">
          {currentItems.map((data) => (
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
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="active"
        />
      </div>
    </MainLayout>
  );
}

export default ProductsPage;
