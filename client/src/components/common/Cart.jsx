import { useCart } from '../../hooks';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CloseIcon from '../../assets/images/close-blue.svg';
import TrashBinBlue from '../../assets/images/trash-bin-blue.svg';
import DefaultProduct from '../../assets/images/default-product.png';
import CartEmpty from '../../assets/images/cart-empty.png';
import Button from './Button';
import AlternatingStripes from './AlternatingStripes';

function Cart({ handleClose }) {
  const navigate = useNavigate();
  const {
    cartData,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    calTotalPrice,
    getQuantityFromCart,
  } = useCart();

  return (
    <div className="ml-auto bg-secondary h-full w-[600px] max-w-full flex flex-col">
      <div className="flex items-center justify-between p-6 md:p-4">
        <h4 className="text-xl font-vs-std text-primary">Giỏ hàng</h4>
        <img
          onClick={() => handleClose()}
          className="cursor-pointer w-10 h-10 object-cover transition-all hover:bg-tertiary rounded-md"
          src={CloseIcon}
          alt="X"
        />
      </div>
      {cartData?.length > 0 ? (
        <div className="flex flex-col flex-1 overflow-y-hidden">
          <ul className="flex-1 overflow-auto mb-3">
            {cartData.map((item) => (
              <li
                className="flex justify-start px-6 sm:px-4 py-3 last:pb-0 [&:not(:last-child)]:border-b border-dashed border-[#999]"
                key={item.id}
              >
                <img
                  className="w-20 h-20 p-2 sm:w-10 sm:h-10 sm:p-1"
                  src={item.thumbnail || DefaultProduct}
                  alt={item.name}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-x-3">
                    <h6 className="text-sm font-lora font-semibold text-primary mb-2">
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </h6>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center h-8 px-3 flex-shrink-0 transition-all hover:bg-tertiary rounded-md"
                    >
                      <img className="w-4 h-4" src={TrashBinBlue} alt="Xóa" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-x-3">
                    <div className="border border-primary rounded-[6px] text-primary flex items-center h-8 leading-[1] w-fit">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className={`ml-1 px-3 py-1 transition-all rounded-md${
                          getQuantityFromCart(item.id) > 1
                            ? ' hover:bg-tertiary'
                            : ' text-gray-400 cursor-default'
                        }`}
                      >
                        –
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="mr-1 px-3 py-1 rounded-md transition-all hover:bg-tertiary"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs font-bold">
                      {item.sale_price ? (
                        <>
                          <p className="text-[#999] line-through">
                            {(item.price * item.quantity).toLocaleString()}₫
                          </p>
                          <p className="text-primary">
                            {(item.sale_price * item.quantity).toLocaleString()}₫
                          </p>
                        </>
                      ) : (
                        <p className="text-primary">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <div className="h-6">
              <AlternatingStripes firstColor="#D3E1FF" secondColor="transparent" stripeWith={5} />
            </div>
            <div className="p-6 md:p-4 bg-tertiary">
              <div className="flex justify-between text-primary font-bold mb-3">
                <span>Tạm tính</span>
                <span>{calTotalPrice().toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-primary font-bold mb-3">
                <span>Giảm giá</span>
                <span>0₫</span>
              </div>
              <div className="flex justify-between text-primary font-bold mb-3">
                <span>Tổng</span>
                <span>{calTotalPrice().toLocaleString()}₫</span>
              </div>
              <Button title="Thanh toán" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between flex-1 p-6 sm:p-4">
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center space-y-2">
              <img className="block w-48" src={CartEmpty} alt="Giỏ hàng trống" />
              <p className="text-primary font-lora font-semibold text-center text-xl sm:text-base">
                Chưa có sản phẩm trong giỏ hàng
              </p>
            </div>
          </div>
          <Button
            title="Tiếp tục mua sắm"
            handleClick={() => {
              handleClose();
              navigate('/collections/all-products');
            }}
          />
        </div>
      )}
    </div>
  );
}

Cart.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default Cart;
