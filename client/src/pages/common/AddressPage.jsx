import { AccountLayout } from '../../components/layout';
import { useState, useEffect } from 'react';
import { addressApi } from '../../api';
import Swal from 'sweetalert2';
import { AddressForm, Overlay } from '../../components/common';

function AddressPage() {
  const [addressList, setAddressList] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [type, setType] = useState('create');
  const [address, setAddress] = useState({});

  const handleAddAddress = () => {
    setShowOverlay(true);
    setType('create');
  };

  const handleEditAddress = (address) => {
    setAddress(address);
    setShowOverlay(true);
    setType('edit');
  };

  const handleDeleteAddress = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa địa chỉ',
        text: 'Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy',
      });
      if (result.isConfirmed) {
        await addressApi.delete(id);
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Địa chỉ đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        const { data: addressData } = await addressApi.getUserAddresses();
        setAddressList(addressData);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data: addressData } = await addressApi.getUserAddresses();
      setAddressList(addressData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <AccountLayout>
      <div className="text-primary">
        <h3 className="py-2 font-vs-std font-semibold text-[2rem] sm:text-[1.7rem] border-b border-primary">
          Địa chỉ
        </h3>
        <div className="my-4">
          {addressList?.length > 0 ? (
            <ul className="space-y-4">
              {addressList?.map((address) => (
                <li className="p-3 border border-primary rounded-md" key={address.id}>
                  <div className="flex flex-col">
                    <p>
                      {`${address.detail}, ${address.ward_name}, ${address.district_name}, ${address.province_name} / Sđt: ${address.phone}`}
                      <span className="ml-2 text-italic text-vinamilk-blue-light">
                        {address.as_default ? 'Mặc định' : ''}
                      </span>
                    </p>
                    <div className="ml-auto flex space-x-3">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-vinamilk-blue-light">Chưa có địa chỉ nào</p>
          )}
        </div>
        <button
          onClick={handleAddAddress}
          className="px-3 py-2 bg-vinamilk-blue text-white rounded-md"
        >
          Thêm địa chỉ
        </button>
      </div>
      {showOverlay && (
        <Overlay handleClickOut={() => setShowOverlay(false)}>
          <AddressForm
            address={address}
            fetchAddresses={fetchAddresses}
            type={type}
            handleClose={() => setShowOverlay(false)}
          />
        </Overlay>
      )}
    </AccountLayout>
  );
}

export default AddressPage;
