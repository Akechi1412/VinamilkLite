// Define action types
export const contactActionTypes = {
  SET_FULL_NAME: 'SET_FULL_NAME',
  SET_EMAIL: 'SET_EMAIL',
  SET_CONTENT: 'SET_CONTENT',
  SET_FULL_NAME_ERROR: 'SET_FULL_NAME_ERROR',
  SET_EMAIL_ERROR: 'SET_EMAIL_ERROR',
  SET_CONTENT_ERROR: 'SET_CONTENT_ERROR',
  RESET_FORM: 'RESET_FORM',
};

// Define initial state
export const contactInitialState = {
  fullName: '',
  email: '',
  content: '',
  fullNameError: ' ',
  emailError: ' ',
  contentErrror: ' ',
};

// Define reducer function
export const contactFormReducer = (state, action) => {
  switch (action.type) {
    case contactActionTypes.SET_FULL_NAME:
      return { ...state, fullName: action.payload };
    case contactActionTypes.SET_EMAIL:
      return { ...state, email: action.payload };
    case contactActionTypes.SET_CONTENT:
      return { ...state, content: action.payload };
    case contactActionTypes.SET_FULL_NAME_ERROR:
      return { ...state, fullNameError: action.payload };
    case contactActionTypes.SET_EMAIL_ERROR:
      return { ...state, emailError: action.payload };
    case contactActionTypes.SET_PASSWORD_CHECK:
      return { ...state, contentError: action.payload };
    case contactActionTypes.RESET_FORM:
      return { ...state, fullName: '', email: '', content: '' };
    default:
      return state;
  }
};
