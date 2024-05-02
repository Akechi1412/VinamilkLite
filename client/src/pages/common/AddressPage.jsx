import { AccountLayout } from '../../components/layout';

function AddressPage() {
  return (
    <AccountLayout>
      <div className="text-primary">
        <h3 className="py-2 font-vs-std font-semibold text-[2rem] sm:text-[1.7rem] border-b border-primary">
          Địa chỉ
        </h3>
        <div className="flex space-x-3 my-6"></div>
      </div>
    </AccountLayout>
  );
}

export default AddressPage;
