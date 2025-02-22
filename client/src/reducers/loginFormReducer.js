// Define action types
export const loginActionTypes = {
  SET_EMAIL: 'SET_EMAIL',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_EMAIL_CHECK: 'SET_EMAIL_CHECK',
  SET_PASSWORD_CHECK: 'SET_PASSWORD_CHECK',
};

// Define initial state
export const loginInitialState = {
  email: '',
  password: '',
  emailCheck: ' ',
  passwordCheck: ' ',
};

// Define reducer function
export const loginFormReducer = (state, action) => {
  switch (action.type) {
    case loginActionTypes.SET_EMAIL:
      return { ...state, email: action.payload };
    case loginActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case loginActionTypes.SET_EMAIL_CHECK:
      return { ...state, emailCheck: action.payload };
    case loginActionTypes.SET_PASSWORD_CHECK:
      return { ...state, passwordCheck: action.payload };
    default:
      return state;
  }
};
