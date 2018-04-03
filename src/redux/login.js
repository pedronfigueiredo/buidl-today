// Action Types
const USER_IS_NEW = 'USER_IS_NEW';
const USER_FOUND_IN_DB = 'USER_FOUND_IN_DB';
const STORE_WEB3 = 'STORE_WEB3';
const STORE_USERACCOUNT = 'STORE_USERACCOUNT';
const CLEAR_LOGIN_FORM = 'CLEAR__LOGIN_FORM';
const UPDATE_LOGIN_FORM = 'UPDATE_LOGIN_FORM';

// Action Creators
export const userIsNew = () => {
  return {
    type: USER_IS_NEW,
  };
};

export const userFoundInDb = payload => {
  return {
    type: USER_FOUND_IN_DB,
    payload,
  };
};

export const storeWeb3 = payload => {
  return {
    type: STORE_WEB3,
    payload,
  };
};

export const storeUserAccount = payload => {
  return {
    type: STORE_USERACCOUNT,
    payload,
  };
};

export const clearLoginForm = () => {
  return {
    type: CLEAR_LOGIN_FORM,
  };
};

export const updateLoginForm = (name, value) => {
  return {
    type: UPDATE_LOGIN_FORM,
    name,
    value,
  };
};

// Initial State
const initialState = {
  web3: '',
  userAccount: '',
  loginFormState: {
    emailAddress: '',
    nickname: '',
  },
  isLoading: true,
};

// Reducers
const login = (state = initialState, action) => {
  switch (action.type) {
    case USER_IS_NEW:
      return {
        ...state,
        isLoading: false,
      };
    case USER_FOUND_IN_DB:
      return {
        ...state,
        loginFormState: {
          emailAddress: action.payload., //JSON STRINGIFY
          nickname: '',
        },
        isLoading: false,
      };
    case CLEAR_LOGIN_FORM:
      return {
        ...state,
        loginFormState: {
          emailAddress: '',
          nickname: '',
        },
      };
    case UPDATE_LOGIN_FORM:
      return {
        ...state,
        loginFormState: {
          ...state.loginFormState,
          [action.name]: action.value,
        },
      };
    case STORE_WEB3:
      return {
        ...state,
        web3: action.payload,
      };
    case STORE_USERACCOUNT:
      return {
        ...state,
        userAccount: action.payload,
      };
    default:
      return state;
  }
};

export default login;
