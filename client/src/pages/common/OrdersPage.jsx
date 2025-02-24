import { AccountLayout } from '../../components/layout';

function OrdersPage() {
  return (
    <AccountLayout>
      <div className="text-primary">
        <h3 className="py-2 font-vs-std font-semibold text-[2rem] sm:text-[1.7rem] border-b border-primary">
          Đơn hàng
        </h3>
      </div>
    </AccountLayout>
  );
}

export default OrdersPage;
