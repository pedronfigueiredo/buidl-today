// Action Types
const USER_IS_NEW = 'USER_IS_NEW';
const USER_FOUND_IN_DB = 'USER_FOUND_IN_DB';
const STORE_WEB3 = 'STORE_WEB3';
const STORE_USERACCOUNT = 'STORE_USERACCOUNT';

// Action Creators
export const userIsNew = () => {
  return {
    type: USER_IS_NEW,
  };
};

export const userFoundInDb = payload => {
  return {
    type: USER_IS_NEW,
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

// Initial State
const initialState = {
  web3: '',
  userAccount: '',
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

        isLoading: false,
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
