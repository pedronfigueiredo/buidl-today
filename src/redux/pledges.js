// Action Types
const UPDATE_ETH_RATE = 'UPDATE_ETH_RATE';
const UPDATE_PLEDGE_FORM = 'UPDATE_PLEDGE_FORM';
const CLEAR_PLEDGE_FORM = 'CLEAR_PLEDGE_FORM';
const REQUEST_SUBMIT_PLEDGE = 'REQUEST_SUBMIT_PLEDGE';
const ERROR_SUBMIT_PLEDGE = 'ERROR_SUBMIT_PLEDGE';
const SUCCESS_SUBMIT_PLEDGE = 'SUCCESS_SUBMIT_PLEDGE';

const GET_ALL_PLEDGES_FROM_USER = 'GET_ALL_PLEDGES_FROM_USER';
const GET_ALL_PLEDGES_FROM_USER_EMPTY = 'GET_ALL_PLEDGES_FROM_USER_EMPTY';
const GET_ALL_PLEDGES_FROM_USER_ERROR = 'GET_ALL_PLEDGES_FROM_USER_ERROR';
const GET_ALL_PLEDGES_FROM_USER_SUCCESS = 'GET_ALL_PLEDGES_FROM_USER_SUCCESS';

// Action Creators
export const updateETHRate = payload => {
  return {
    type: UPDATE_ETH_RATE,
    payload,
  };
};

export const updatePledgeForm = (name, value) => {
  return {
    type: UPDATE_PLEDGE_FORM,
    name,
    value,
  };
};

export const clearPledgeForm = () => {
  return {
    type: CLEAR_PLEDGE_FORM,
  };
};

export const requestSubmitPledge = () => {
  return {
    type: REQUEST_SUBMIT_PLEDGE,
  };
};

export const errorSubmitPledge = payload => {
  return {
    type: ERROR_SUBMIT_PLEDGE,
    payload,
  };
};

export const successSubmitPledge = payload => {
  return {
    type: SUCCESS_SUBMIT_PLEDGE,
    payload,
  };
};

export const getAllPledgesFromUser = payload => {
  return {
    type: GET_ALL_PLEDGES_FROM_USER,
    payload,
  };
};

export const getAllPledgesFromUserEmpty = payload => {
  return {
    type: GET_ALL_PLEDGES_FROM_USER_EMPTY,
    payload,
  };
};

export const getAllPledgesFromUserError = payload => {
  return {
    type: GET_ALL_PLEDGES_FROM_USER_ERROR,
    payload,
  };
};

export const getAllPledgesFromUserSuccess = payload => {
  return {
    type: GET_ALL_PLEDGES_FROM_USER_SUCCESS,
    payload,
  };
};

// Initial State
const initialState = {
  ethRate: null,
  submittingPledge: false,
  pledgeFormState: {
    description: '',
    deadline: '',
    stake: '',
    referee: '',
    recipient: '',
  },
  pledges: [],
  retrievingUsers: false,
};

// Reducers
const pledges = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ETH_RATE:
      return {
        ...state,
        ethRate: action.payload,
      };
    case UPDATE_PLEDGE_FORM:
      return {
        ...state,
        pledgeFormState: {
          ...state.pledgeFormState,
          [action.name]: action.value,
        },
      };
    case CLEAR_PLEDGE_FORM:
      return {
        ...state,
        pledgeFormState: {
          description: '',
          deadline: '',
          stake: '',
          referee: '',
          recipient: '',
        },
      };
    case REQUEST_SUBMIT_PLEDGE:
      return {
        ...state,
        submittingPledge: true,
      };
    case ERROR_SUBMIT_PLEDGE:
      return {
        ...state,
        submittingPledge: false,
      };
    case SUCCESS_SUBMIT_PLEDGE:
      return {
        ...state,
        submittingPledge: false,
        pledges: [...state.pledges, action.payload],
      };
    case GET_ALL_PLEDGES_FROM_USER:
      return {
        ...state,
        retrievingPledges: false,
      };
    case GET_ALL_PLEDGES_FROM_USER_EMPTY:
      return {
        ...state,
        retrievingPledges: false,
      };
    case GET_ALL_PLEDGES_FROM_USER_ERROR:
      return {
        ...state,
        retrievingPledges: false,
      };
    case GET_ALL_PLEDGES_FROM_USER_SUCCESS:
      return {
        ...state,
        retrievingPledges: false,
        pledges: action.payload,
      };
    default:
      return state;
  }
};

export default pledges;
