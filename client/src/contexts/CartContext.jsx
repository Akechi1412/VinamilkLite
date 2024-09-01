import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext({
  cartData: [],
  setCartData: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);

  const value = {
    cartData,
    setCartData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node,
};

export default CartContext;
