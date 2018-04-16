// Action Types
const UPDATE_ETH_RATE = 'UPDATE_ETH_RATE';
const UPDATE_ETH_RATE_IN_USD = 'UPDATE_ETH_RATE_IN_USD';
const UPDATE_PLEDGE_FORM = 'UPDATE_PLEDGE_FORM';
const CLEAR_PLEDGE_FORM = 'CLEAR_PLEDGE_FORM';
const REQUEST_SUBMIT_PLEDGE = 'REQUEST_SUBMIT_PLEDGE';
const ERROR_SUBMIT_PLEDGE = 'ERROR_SUBMIT_PLEDGE';
const SUCCESS_SUBMIT_PLEDGE = 'SUCCESS_SUBMIT_PLEDGE';

// Action Creators
export const updateETHRate = payload => {
  return {
    type: UPDATE_ETH_RATE,
    payload,
  };
};

export const updateETHRateInUSD = payload => {
  return {
    type: UPDATE_ETH_RATE_IN_USD,
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

// Initial State
const initialState = {
  ethRate: null,
  ethRateInUSD: null,
  submittingPledge: false,
  pledgeFormState: {
    description: '',
    deadline: '',
    stake: '',
    referee: '',
    recipient: '',
  },
  pledges: [],
};

// Reducers
const pledges = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ETH_RATE:
      return {
        ...state,
        ethRate: action.payload,
      };
    case UPDATE_ETH_RATE_IN_USD:
      return {
        ...state,
        ethRateInUSD: action.payload,
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
      console.log('action.payload', action.payload);
      return {
        ...state,
        submittingPledge: false,
        pledges: [...state.pledges, action.payload],
      };
    default:
      return state;
  }
};

export default pledges;
