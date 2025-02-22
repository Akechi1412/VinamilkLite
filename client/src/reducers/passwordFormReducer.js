// Define action types
export const passwordActionTypes = {
  SET_CURRENT_PASSWORD: 'SET_CURRENT_PASSWORD',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_CONFIRM_PASSWORD: 'SET_CONFIRM_PASSWORD',
  SET_CURRENT_PASSWORD_ERROR: 'SET_CURRENT_PASSWORD_ERROR',
  SET_PASSWORD_ERROR: 'SET_PASSWORD_ERROR',
  SET_CONFIRM_PASSWORD_ERROR: 'SET_CONFIRM_PASSWORD_ERROR',
};

// Define initial state
export const passwordInitialState = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
  currentPasswordError: ' ',
  passwordError: ' ',
  confirmPasswordError: ' ',
};

// Define reducer function
export const passwordFormReducer = (state, action) => {
  switch (action.type) {
    case passwordActionTypes.SET_CURRENT_PASSWORD:
      return { ...state, currentPassword: action.payload };
    case passwordActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case passwordActionTypes.SET_CONFIRM_PASSWORD:
      return { ...state, confirmPassword: action.payload };
    case passwordActionTypes.SET_CURRENT_PASSWORD_ERROR:
      return { ...state, currentPasswordError: action.payload };
    case passwordActionTypes.SET_PASSWORD_ERROR:
      return { ...state, passwordError: action.payload };
    case passwordActionTypes.SET_CONFIRM_PASSWORD_ERROR:
      return { ...state, confirmPasswordError: action.payload };
    default:
      return state;
  }
};
