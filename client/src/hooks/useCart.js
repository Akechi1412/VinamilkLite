import { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { CartContext } from '../contexts';

const useCart = () => {
  const { cartData, setCartData } = useContext(CartContext);

  useEffect(() => {
    const savedCart = Cookies.get('cart');
    setCartData(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  const updateCart = (newCart) => {
    setCartData(newCart);
    Cookies.set('cart', JSON.stringify(newCart));
  };

  const addToCart = (item, quantity) => {
    const { id, name, thumbnail, price, sale_price, slug } = item;
    const reducedItem = { id, name, thumbnail, price, sale_price, slug };
    reducedItem.quantity = quantity || 1;
    const updatedCart = [...cartData, reducedItem];
    updateCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartData.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
  };

  const increaseQuantity = (itemId, increase) => {
    const updatedCart = cartData.map((item) => {
      if (item.id === itemId) {
        item.quantity += increase || 1;
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemId, decrease) => {
    const updatedCart = cartData.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        item.quantity -= decrease || 1;
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const getQuantityFromCart = (itemId) => {
    const item = cartData.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const calTotalQuantity = () => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
  };

  const calTotalPrice = () => {
    return cartData.reduce(
      (total, item) =>
        item.sale_price
          ? total + item.sale_price * item.quantity
          : total + item.price * item.quantity,
      0
    );
  };

  return {
    cartData,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getQuantityFromCart,
    calTotalQuantity,
    calTotalPrice,
  };
};

export default useCart;
