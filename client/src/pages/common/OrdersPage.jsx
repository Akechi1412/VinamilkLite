import React from 'react';
import Cart from '../../components/common/Cart.jsx';
import { AccountLayout } from '../../components/layout';

function OrdersPage() {
  const handleCheckout = (items) => {
    console.log('Thanh toán:', items);
  };

  return (
    <AccountLayout>
      <div className="text-primary">
        <h3 className="py-2 font-vs-std font-semibold text-[2rem] sm:text-[1.7rem] border-b border-primary">
          Đơn hàng
        </h3>

        <Cart handleCheckout={handleCheckout} cartItems={[]} removeFromCart={() => {}} />
        <div className="flex justify-end">
          <button className="bg-[#0213af] text-white px-4 py-2 rounded text-sm">Thanh toán</button>
        </div>
      </div>
    </AccountLayout>
  );
}

export default OrdersPage;
