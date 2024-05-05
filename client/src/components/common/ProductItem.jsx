import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import DefaultProduct from '../../assets/images/default-product.png';
import AddIcon from '../../assets/images/add.svg';

function ProductItem({ product }) {
  const [quantityInCart, setQuantityInCart] = useState(0);

  useEffect(() => {
    setQuantityInCart(getQuantityFromCart());
  }, []);

  const addToCart = (product) => {
    const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    Cookies.set('cart', JSON.stringify(cart));

    setQuantityInCart(getQuantityFromCart());
  };

  const getQuantityFromCart = () => {
    const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
    const productInCart = cart.find((item) => item.id === product.id);
    return productInCart ? productInCart.quantity : 0;
  };

  return (
    <Link to={`/products/${product.slug}`} className="flex flex-col animate-appear">
      <div className="aspect-square relative rounded-2xl shadow-sm border overflow-hidden">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center ml-3 mt-3">
            <svg
              width="24"
              height="24"
              color="#0213AF"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all"
            >
              <path
                d="M16.4899 22.75H7.49993C5.77993 22.75 4.48994 22.29 3.68994 21.38C2.88994 20.47 2.57993 19.15 2.78993 17.44L3.68994 9.94C3.94994 7.73 4.50994 5.75 8.40994 5.75H15.6099C19.4999 5.75 20.0599 7.73 20.3299 9.94L21.2299 17.44C21.4299 19.15 21.1299 20.48 20.3299 21.38C19.4999 22.29 18.2199 22.75 16.4899 22.75ZM8.39993 7.25C5.51993 7.25 5.37993 8.38999 5.16993 10.11L4.26994 17.61C4.11994 18.88 4.29993 19.81 4.80993 20.38C5.31993 20.95 6.21993 21.24 7.49993 21.24H16.4899C17.7699 21.24 18.6699 20.95 19.1799 20.38C19.6899 19.81 19.8699 18.88 19.7199 17.61L18.8199 10.11C18.6099 8.37999 18.4799 7.25 15.5899 7.25H8.39993Z"
                fill="currentColor"
              ></path>
              <path
                d="M16 8.75C15.59 8.75 15.25 8.41 15.25 8V4.5C15.25 3.42 14.58 2.75 13.5 2.75H10.5C9.42 2.75 8.75 3.42 8.75 4.5V8C8.75 8.41 8.41 8.75 8 8.75C7.59 8.75 7.25 8.41 7.25 8V4.5C7.25 2.59 8.59 1.25 10.5 1.25H13.5C15.41 1.25 16.75 2.59 16.75 4.5V8C16.75 8.41 16.41 8.75 16 8.75Z"
                fill="currentColor"
              ></path>
              <path
                d="M20.41 17.7793H8C7.59 17.7793 7.25 17.4393 7.25 17.0293C7.25 16.6193 7.59 16.2793 8 16.2793H20.41C20.82 16.2793 21.16 16.6193 21.16 17.0293C21.16 17.4393 20.82 17.7793 20.41 17.7793Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <span>{quantityInCart}</span>
        </div>
        <img
          className="transition-all w-full h-full object-cover hover:scale-125"
          src={product.thumbnail || DefaultProduct}
          alt={product.name || ''}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            addToCart(product);
          }}
        >
          <img className="w-10 h-10 absolute right-4 bottom-4" src={AddIcon} alt="" />
        </button>
      </div>
      <div className="flex-1">
        <h5 className="line-clamp-2 font-inter font-[600] text-primary my-3 h-[3rem]">
          {product.name}
        </h5>

        {product.sale_price !== null ? (
          <p className="font-inter text-[18px] mt-auto flex space-x-2 h-[3rem]">
            <span className="line-through text-[#999]">{product.price}₫</span>
            <span className="text-primary">{product.sale_price}₫</span>
          </p>
        ) : (
          <p className="font-light text-[18px] text-primary h-[3rem]">{product.price}₫</p>
        )}
      </div>
    </Link>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductItem;
