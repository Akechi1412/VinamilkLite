import PropTypes from 'prop-types';
import CloseIcon from '../../assets/images/close-blue.svg';
import { useState, useEffect, useReducer } from 'react';
import Input from './Input';
import { addressApi } from '../../api';
import Swal from 'sweetalert2';
import ArrowBottom from '../../assets/images/arrow-bottom.svg';
import Button from './Button';
import {
  addressActionTypes,
  addressInitialState,
  addressFormReducer,
} from '../../reducers/addressFormReducer';

function AddressForm({ type = 'create', handleClose, address, fetchAddresses }) {
  const [heading, setHeading] = useState('Thêm địa chỉ mới');
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [addressState, addressDispatch] = useReducer(addressFormReducer, addressInitialState);
  const {
    provinceId,
    districtId,
    wardId,
    detail,
    phone,
    asDefault,
    wardError,
    detailError,
    phoneError,
  } = addressState;

  const handleChangeProvince = (event) => {
    const provinceId = +event.target.value;
    addressDispatch({
      type: addressActionTypes.SET_PROVINCE_ID,
      payload: provinceId,
    });
  };

  const handleChangeDistrict = (event) => {
    const districtId = +event.target.value;
    addressDispatch({
      type: addressActionTypes.SET_DISTRICT_ID,
      payload: districtId,
    });
  };

  const handleChangeWard = (event) => {
    const wardId = +event.target.value;
    if (wardId === 0) {
      addressDispatch({
        type: addressActionTypes.SET_WARD_ERROR,
        payload: 'Chưa chọn phường/xã!',
      });
    } else {
      addressDispatch({
        type: addressActionTypes.SET_WARD_ERROR,
        payload: '',
      });
    }

    addressDispatch({
      type: addressActionTypes.SET_WARD_ID,
      payload: event.target.value,
    });
  };

  const handleChangeDetail = (event) => {
    const detail = event.target.value;
    addressDispatch({
      type: addressActionTypes.SET_DETAIL,
      payload: detail,
    });

    if (detail.trim() === '') {
      addressDispatch({
        type: addressActionTypes.SET_DETAIL_ERROR,
        payload: 'Địa chỉ cụ thể là bắt buộc!',
      });
      return;
    }
    if (detail.length > 255) {
      addressDispatch({
        type: addressActionTypes.SET_DETAIL_ERROR,
        payload: 'Địa chỉ cụ thể không quá 255 ký tự!',
      });
      return;
    }
    addressDispatch({
      type: addressActionTypes.SET_DETAIL_ERROR,
      payload: '',
    });
  };

  const handleChangePhone = (event) => {
    const phone = event.target.value;
    addressDispatch({
      type: addressActionTypes.SET_PHONE,
      payload: phone,
    });

    if (phone.trim() === '') {
      addressDispatch({
        type: addressActionTypes.SET_PHONE_ERROR,
        payload: 'Số điện thoại là bắt buộc!',
      });
      return;
    }
    if (!/^(?:\+84|0)[1-9][0-9]{8,9}$/.test(phone)) {
      addressDispatch({
        type: addressActionTypes.SET_PHONE_ERROR,
        payload: 'Số điện thoại không hợp lệ!',
      });
      return;
    }
    addressDispatch({
      type: addressActionTypes.SET_PHONE_ERROR,
      payload: '',
    });
  };

  const handleCheckboxChange = () =>
    addressDispatch({
      type: addressActionTypes.SET_AS_DEFAULT,
      payload: !asDefault,
    });

  const handleConfirm = async () => {
    const payload = {
      ward_id: wardId,
      detail: detail.trim(),
      phone: phone.trim(),
      as_default: asDefault ? 1 : 0,
    };

    try {
      if (type === 'create') {
        await addressApi.create(payload);
        Swal.fire({
          icon: 'success',
          title: 'Xác nhận!',
          text: 'Thêm địa chỉ thành công',
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchAddresses();
        return;
      }

      if (type === 'edit') {
        await addressApi.update(address.id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Xác nhận!',
          text: 'Sửa địa chỉ thành công',
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchAddresses();
        return;
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

  useEffect(() => {
    if (address) {
      addressDispatch({
        type: addressActionTypes.SET_ADDRESS,
        payload: address,
      });
    }
  }, [address]);

  useEffect(() => {
    if (type === 'create') {
      addressDispatch({
        type: addressActionTypes.SET_ADDRESS,
        payload: {
          province_id: 0,
          district_id: 0,
          ward_id: 0,
          detail: '',
          phone: '',
          as_default: 0,
        },
      });
      setHeading('Thêm địa chỉ mới');
      return;
    }
    if (type === 'edit') {
      setHeading('Sửa địa chỉ');
    }
  }, [type]);

  useEffect(() => {
    (async () => {
      try {
        const { data: provinceData } = await addressApi.getProvinces();
        const provinceList = [{ id: 0, name: '--Chọn tỉnh/thành phố--' }, ...provinceData];
        setProvinceList(provinceList);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: districtData } = await addressApi.getDistricts(provinceId);
        const districtList = [{ id: 0, name: '--Chọn quận/huyện--' }, ...districtData];
        setDistrictList(districtList);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    })();
  }, [provinceId]);

  useEffect(() => {
    (async () => {
      try {
        const { data: wardData } = await addressApi.getWards(districtId);
        const wardList = [{ id: 0, name: '--Chọn phường/xã--' }, ...wardData];
        setWardList(wardList);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    })();
  }, [districtId]);

  return (
    <div className="ml-auto bg-secondary h-full w-[600px] max-w-full flex flex-col">
      <div className="flex items-center justify-between p-6 md:p-4">
        <h4 className="text-xl font-vs-std text-primary">{heading}</h4>
        <img
          onClick={() => handleClose()}
          className="cursor-pointer w-10 h-10 object-cover transition-all hover:bg-tertiary rounded-md"
          src={CloseIcon}
          alt="X"
        />
      </div>
      <div className="space-y-4 text-primary p-6 md:p-4">
        <div>
          <label
            className="transition-all font-vs-std text-[16px] text-primary italic mb-[8px] flex font-[450] leading-[19px]"
            htmlFor="province"
          >
            Chọn tỉnh/thành phố
          </label>
          <div className="relative">
            <select
              className="cursor-pointer block bg-secondary py-3 pl-2 pr-10 w-full rounded-md border border-primary focus:border-vinamilk-blue-light outline-none"
              value={provinceId}
              id="province"
              onChange={handleChangeProvince}
            >
              {provinceList?.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <img
              className="absolute bg-secondary top-1/2 -translate-y-1/2 right-2 w-[28px] h-[28px]"
              src={ArrowBottom}
              alt="\/"
            />
          </div>
        </div>
        <div>
          <label
            className="transition-all font-vs-std text-[16px] text-primary italic mb-[8px] flex font-[450] leading-[19px]"
            htmlFor="district"
          >
            Chọn quận/huyện
          </label>
          <div className="relative">
            <select
              className="cursor-pointer block bg-secondary py-3 pl-2 pr-10 w-full rounded-md border border-primary focus:border-vinamilk-blue-light outline-none"
              value={districtId}
              id="district"
              onChange={handleChangeDistrict}
            >
              {districtList?.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            <img
              className="absolute bg-secondary top-1/2 -translate-y-1/2 right-2 w-[28px] h-[28px]"
              src={ArrowBottom}
              alt="\/"
            />
          </div>
        </div>
        <div>
          <label
            className="transition-all font-vs-std text-[16px] text-primary italic mb-[8px] flex font-[450] leading-[19px]"
            htmlFor="ward"
          >
            Chọn phường/xã
          </label>
          <div className="relative">
            <select
              className="cursor-pointer block bg-secondary py-3 pl-2 pr-10 w-full rounded-md border border-primary focus:border-vinamilk-blue-light outline-none"
              value={wardId}
              id="ward"
              onChange={handleChangeWard}
            >
              {wardList?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
            <img
              className="absolute bg-secondary top-1/2 -translate-y-1/2 right-2 w-[28px] h-[28px]"
              src={ArrowBottom}
              alt="\/"
            />
          </div>
          {wardError && <p className="text-red-600 mt-1 font-inter">{wardError}</p>}
        </div>
        <div>
          <label
            className="transition-all font-vs-std text-[16px] text-primary mb-[8px] flex font-[450] leading-[19px]"
            htmlFor="detail"
          >
            Số nhà, tên đường, thôn/ấp,...
          </label>
          <div>
            <Input
              id="detail"
              type="text"
              value={detail}
              handleChange={handleChangeDetail}
              placeholder="Nhập địa chỉ cụ thể"
            />
          </div>
          {detailError && <p className="text-red-600 mt-1 font-inter">{detailError}</p>}
        </div>
        <div>
          <label
            className="transition-all font-vs-std text-[16px] text-primary mb-[8px] flex font-[450] leading-[19px]"
            htmlFor="phone"
          >
            Điện thoại
          </label>
          <div>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={phone}
              placeholder="Nhập số điện thoại"
              handleChange={handleChangePhone}
            />
          </div>
          {phoneError && <p className="text-red-600 mt-1 font-inter">{phoneError}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="default"
            name="default"
            value={asDefault}
            onChange={handleCheckboxChange}
          />
          <label
            className="transition-all font-vs-std text-[16px] text-primary flex font-[450] leading-[19px]"
            htmlFor="default"
          >
            Đặt làm mặc định
          </label>
        </div>
        <div className="pt-2">
          <Button
            isDisable={!!(wardError || detailError || phoneError)}
            handleClick={handleConfirm}
            title="Xác nhận"
          />
        </div>
      </div>
    </div>
  );
}

AddressForm.propTypes = {
  type: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  address: PropTypes.object,
  fetchAddresses: PropTypes.func,
};

export default AddressForm;
