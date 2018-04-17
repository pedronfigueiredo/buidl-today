// Action Types
const STORE_WEB3 = 'STORE_WEB3';
const STORE_USERACCOUNT = 'STORE_USERACCOUNT';

const REQUEST_REGISTER_USER = 'REQUEST_REGISTER_USER';
const ERROR_REGISTERING_USER = 'ERROR_REGISTERING_USER';
const AUTHENTICATE = 'AUTHENTICATE';
const SIGNOUT = 'SIGNOUT';
const CHECK_IF_USER_EXISTS = 'CHECK_IF_USER_EXISTS';
const IDENTIFIED_NEW_USER = 'IDENTIFIED_NEW_USER';
const IDENTIFIED_RETURNING_USER = 'IDENTIFIED_RETURNING_USER';
const CHECK_IF_USER_EXISTS_ERROR = 'CHECK_IF_USER_EXISTS_ERROR';

const CLEAR_REGISTRATION_FORM = 'CLEAR__REGISTRATION_FORM';
const UPDATE_REGISTRATION_FORM = 'UPDATE_REGISTRATION_FORM';

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

export const requestRegisterUser = payload => {
  return {
    type: REQUEST_REGISTER_USER,
    payload,
  };
};
export const errorRegisteringUser = () => {
  return {
    type: ERROR_REGISTERING_USER,
  };
};
export const authenticate = () => {
  return {
    type: AUTHENTICATE,
  };
};
export const signout = () => {
  return {
    type: SIGNOUT,
  };
};
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

export const clearRegistrationForm = () => {
  return {
    type: CLEAR_REGISTRATION_FORM,
  };
};
export const updateRegistrationForm = (name, value) => {
  return {
    type: UPDATE_REGISTRATION_FORM,
    name,
    value,
  };
};

// Initial State
const initialState = {
  web3: '',
  user: {
    userAccount: '',
    emailAddress: '',
    nickname: '',
  },
  registrationFormState: {
    emailAddress: '',
    nickname: '',
  },
  registering: false,
  isAuthenticated: false,
  isCheckingIfUserExists: false,
};

// Reducers
const registration = (state = initialState, action) => {
  switch (action.type) {
    case STORE_WEB3:
      return {
        ...state,
        web3: action.payload,
      };
    case STORE_USERACCOUNT:
      return {
        ...state,
        user: {
          ...state.user,
          userAccount: action.payload,
        },
      };
    case REQUEST_REGISTER_USER:
      return {
        ...state,
        registering: true,
        user: {
          ...state.user,
          nickname: action.payload.nickname,
          emailAddress: action.payload.emailAddress,
        },
      };
    case ERROR_REGISTERING_USER:
      return {
        ...state,
        registering: false,
      };
    case AUTHENTICATE:
      return {
        ...state,
        registering: false,
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
        user: {
          userAccount: action.payload.address,
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
    case CLEAR_REGISTRATION_FORM:
      return {
        ...state,
        registrationFormState: {
          emailAddress: '',
          nickname: '',
        },
      };
    case UPDATE_REGISTRATION_FORM:
      return {
        ...state,
        registrationFormState: {
          ...state.registrationFormState,
          [action.name]: action.value,
        },
      };
    default:
      return state;
  }
};

export default registration;
