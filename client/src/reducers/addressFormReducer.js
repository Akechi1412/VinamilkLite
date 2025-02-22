// Define action types
export const addressActionTypes = {
  SET_ADDRESS: 'SET_ADDRESS',
  SET_PROVINCE_ID: 'SET_PROVINCE_ID',
  SET_DISTRICT_ID: 'SET_DISTRICT_ID',
  SET_WARD_ID: 'SET_WARD_ID',
  SET_DETAIL: 'SET_DETAIL',
  SET_PHONE: 'SET_PHONE',
  SET_AS_DEFAULT: 'SET_AS_DEFAULT',
  SET_WARD_ERROR: 'SET_WARD_ERROR',
  SET_DETAIL_ERROR: 'SET_DETAIL_ERROR',
  SET_PHONE_ERROR: 'SET_EMAIL_ERROR',
};

// Define initial state
export const addressInitialState = {
  provinceId: 0,
  districtId: 0,
  wardId: 0,
  detail: '',
  phone: '',
  asDefault: false,
  wardError: ' ',
  detailError: ' ',
  phoneError: ' ',
};

// Define reducer function
export const addressFormReducer = (state, action) => {
  switch (action.type) {
    case addressActionTypes.SET_ADDRESS: {
      const address = action.payload;
      return {
        ...state,
        provinceId: address.province_id,
        districtId: address.district_id,
        wardId: address.ward_id,
        detail: address.detail,
        phone: address.phone,
        asDefault: address.as_default === 1,
        wardError: '',
        detailError: '',
        phoneError: '',
      };
    }
    case addressActionTypes.SET_PROVINCE_ID:
      return { ...state, provinceId: action.payload };
    case addressActionTypes.SET_DISTRICT_ID:
      return { ...state, districtId: action.payload };
    case addressActionTypes.SET_WARD_ID:
      return { ...state, wardId: action.payload };
    case addressActionTypes.SET_DETAIL:
      return { ...state, detail: action.payload };
    case addressActionTypes.SET_PHONE:
      return { ...state, phone: action.payload };
    case addressActionTypes.SET_AS_DEFAULT:
      return { ...state, asDefault: action.payload };
    case addressActionTypes.SET_WARD_ERROR:
      return { ...state, wardError: action.payload };
    case addressActionTypes.SET_DETAIL_ERROR:
      return { ...state, detailError: action.payload };
    case addressActionTypes.SET_PHONE_ERROR:
      return { ...state, phoneError: action.payload };
    default:
      return state;
  }
};
