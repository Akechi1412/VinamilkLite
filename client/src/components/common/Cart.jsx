import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartData = Cookies.get('cart');
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error("Dữ liệu trong cookie 'cart' không phải là một mảng JSON hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu từ cookie 'cart':", error);
      }
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart));
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.sale_price * item.quantity, 0);
  };

  return (
    <div>
      <div className="overflow-auto max-h-[400px] ">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b-2 py-4">
            <div className="flex items-center flex-grow-0">
              <img src={item.thumbnail} alt={item.name} className="w-14 h-14 object-cover mr-2" />
            </div>
            <div className="flex flex-col flex-grow">
              <div>
                <h3 className="font-bold text-sm">{item.name}</h3>
              </div>
              <div className="flex items-center mt-1">
                <div className="flex item space-x-3">
                  <button
                    onClick={() => decreaseQuantity(index)}
                    className="border border-primary text-primary rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="mx-1">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(index)}
                    className="border border-primary text-primary rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                <button onClick={() => removeFromCart(index)} className="text-red-500 ml-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    width="300"
                    height="300"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <title>Xóa</title>
                    <path
                      d="M262.502 84.1249C262.252 84.1249 261.877 84.1249 261.502 84.1249C195.377 77.4999 129.377 74.9999 64.0018 81.6249L38.5018 84.1249C33.2518 84.6249 28.6268 80.8749 28.1268 75.6249C27.6268 70.3749 31.3768 65.8749 36.5018 65.3749L62.0018 62.8749C128.502 56.1249 195.877 58.7499 263.377 65.3749C268.502 65.8749 272.252 70.4999 271.752 75.6249C271.377 80.4999 267.252 84.1249 262.502 84.1249Z"
                      fill="#3459FF"
                    ></path>
                    <path
                      d="M106.251 71.5C105.751 71.5 105.251 71.5 104.626 71.375C99.6265 70.5 96.1265 65.625 97.0015 60.625L99.7515 44.25C101.751 32.25 104.501 15.625 133.626 15.625H166.376C195.626 15.625 198.376 32.875 200.251 44.375L203.001 60.625C203.876 65.75 200.376 70.625 195.376 71.375C190.251 72.25 185.376 68.75 184.626 63.75L181.876 47.5C180.126 36.625 179.751 34.5 166.501 34.5H133.751C120.501 34.5 120.251 36.25 118.376 47.375L115.501 63.625C114.751 68.25 110.751 71.5 106.251 71.5Z"
                      fill="#3459FF"
                    ></path>
                    <path
                      d="M190.126 284.375H109.876C66.2509 284.375 64.5009 260.25 63.1259 240.75L55.0009 114.875C54.6259 109.75 58.6259 105.25 63.7509 104.875C69.0009 104.625 73.3759 108.5 73.7509 113.625L81.8759 239.5C83.2509 258.5 83.7509 265.625 109.876 265.625H190.126C216.376 265.625 216.876 258.5 218.126 239.5L226.251 113.625C226.626 108.5 231.126 104.625 236.251 104.875C241.376 105.25 245.376 109.625 245.001 114.875L236.876 240.75C235.501 260.25 233.751 284.375 190.126 284.375Z"
                      fill="#3459FF"
                    ></path>
                    <path
                      d="M170.75 215.625H129.125C124 215.625 119.75 211.375 119.75 206.25C119.75 201.125 124 196.875 129.125 196.875H170.75C175.875 196.875 180.125 201.125 180.125 206.25C180.125 211.375 175.875 215.625 170.75 215.625Z"
                      fill="#3459FF"
                    ></path>
                    <path
                      d="M181.25 165.625H118.75C113.625 165.625 109.375 161.375 109.375 156.25C109.375 151.125 113.625 146.875 118.75 146.875H181.25C186.375 146.875 190.625 151.125 190.625 156.25C190.625 161.375 186.375 165.625 181.25 165.625Z"
                      fill="#3459FF"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center flex-grow-0">
              <span className="font-bold">{item.sale_price}₫</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-2 flex items-center">
        <input
          className="border-2 p-2 flex-grow mr-2 text-sm outline-none focus:border-blue-500 rounded-md"
          placeholder="Nhập mã giảm giá"
        />
        <button className="bg-[#0213af] text-white p-2 rounded-md text-sm hover:bg-blue-800">
          Áp dụng
        </button>
      </div>

      <div className="flex justify-between font-bold mb-2">
        <span className="text-sm">Tổng tiền hàng</span>
        <span>{getTotalPrice()}₫</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">Phí vận chuyển</span>
        <span>0₫</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">Giảm giá</span>
        <span>0₫</span>
      </div>
      <div className="flex justify-between text-blue-500 mb-2">
        <span className="text-sm">Tổng thanh toán</span>
        <span>{getTotalPrice()}₫</span>
      </div>
    </div>
  );
}

export default Cart;
