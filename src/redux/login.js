// Action Types
const STORE_WEB3 = 'STORE_WEB3';
const STORE_USERACCOUNT = 'STORE_USERACCOUNT';

const AUTHENTICATE = 'AUTHENTICATE';
const SIGNOUT = 'SIGNOUT';
const CHECK_IF_USER_EXISTS = 'CHECK_IF_USER_EXISTS';
const IDENTIFIED_NEW_USER = 'IDENTIFIED_NEW_USER';
const IDENTIFIED_RETURNING_USER = 'IDENTIFIED_RETURNING_USER';
const CHECK_IF_USER_EXISTS_ERROR = 'CHECK_IF_USER_EXISTS_ERROR';

const CLEAR_LOGIN_FORM = 'CLEAR__LOGIN_FORM';
const UPDATE_LOGIN_FORM = 'UPDATE_LOGIN_FORM';

// Action Creators
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

export const authenticate = () => {
  return {
    type: AUTHENTICATE,
  };
}
export const signout = () => {
  return {
    type: SIGNOUT,
  };
}
export const checkIfUserExists = () => {
  return {
    type: CHECK_IF_USER_EXISTS,
  };
};
export const identifiedNewUser = () => {
  return {
    type: IDENTIFIED_NEW_USER,
  };
};
export const identifiedReturningUser = payload => {
  return {
    type: IDENTIFIED_RETURNING_USER,
    payload,
  };
};
export const checkIfUserExistsError = () => {
  return {
    type: CHECK_IF_USER_EXISTS_ERROR,
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
  isAuthenticated: false,
  isCheckingIfUserExists: false,
};

// Reducers
const login = (state = initialState, action) => {
  switch (action.type) {
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
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true,
      };
    case SIGNOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case CHECK_IF_USER_EXISTS:
      return {
        ...state,
        isCheckingIfUserExists: true,
      };
    case IDENTIFIED_NEW_USER:
      return {
        ...state,
        isAuthenticated: false,
        isCheckingIfUserExists: false,
      };
    case IDENTIFIED_RETURNING_USER:
      return {
        ...state,
        loginFormState: {
          emailAddress: action.payload.email,
          nickname: action.payload.nickname,
        },
        isAuthenticated: true,
        isCheckingIfUserExists: false,
      };
    case CHECK_IF_USER_EXISTS_ERROR:
      return {
        ...state,
        isCheckingIfUserExists: false,
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
    default:
      return state;
  }
};

export default login;
