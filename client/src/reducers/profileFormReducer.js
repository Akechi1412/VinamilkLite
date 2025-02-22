// Define action types
export const profileActionTypes = {
  SET_PROFILE: 'SET_PROFILE',
  SET_FILE: 'SET_FILE',
  SET_IMAGE_URL: 'SET_IMAGE_URL',
  SET_PREVIEW_URL: 'SET_PREVIEW_URL',
  SET_EMAIL: 'SET_EMAIL',
  SET_FIRST_NAME: 'SET_FIRST_NAME',
  SET_LAST_NAME: 'SET_LAST_NAME',
  SET_FIRST_NAME_ERROR: 'SET_FIRST_NAME_ERROR',
  SET_LAST_NAME_ERROR: 'SET_LAST_NAME_ERROR',
  DELETE_IMAGE: 'DELETE_IMAGE',
};

// Define initial state
export const profileInitialState = {
  file: '',
  imageUrl: '',
  previewUrl: '',
  email: '',
  firstName: '',
  lastName: '',
  firstNameError: '',
  lastNameError: '',
};

// Define reducer function
export const profileFormReducer = (state, action) => {
  switch (action.type) {
    case profileActionTypes.SET_PROFILE: {
      const profile = action.payload;
      return {
        ...state,
        imageUrl: profile?.avatar || '',
        email: profile.email || '',
        firstName: profile.first_name,
        lastName: profile.last_name,
      };
    }
    case profileActionTypes.SET_FILE:
      return { ...state, file: action.payload };
    case profileActionTypes.SET_IMAGE_URL:
      return { ...state, imageUrl: action.payload };
    case profileActionTypes.SET_PREVIEW_URL:
      return { ...state, previewUrl: action.payload };
    case profileActionTypes.SET_EMAIL:
      return { ...state, email: action.payload };
    case profileActionTypes.SET_FIRST_NAME:
      return { ...state, firstName: action.payload };
    case profileActionTypes.SET_LAST_NAME:
      return { ...state, lastName: action.payload };
    case profileActionTypes.SET_FIRST_NAME_ERROR:
      return { ...state, firstNameError: action.payload };
    case profileActionTypes.SET_LAST_NAME_ERROR:
      return { ...state, lastNameError: action.payload };
    case profileActionTypes.DELETE_IMAGE:
      return { ...state, file: null, previewUrl: '', imageUrl: '' };
    default:
      return state;
  }
};
