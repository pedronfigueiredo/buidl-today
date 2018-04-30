// Action Types
const UPDATE_ETH_RATE = 'UPDATE_ETH_RATE';
const UPDATE_PLEDGE_FORM = 'UPDATE_PLEDGE_FORM';
const CLEAR_PLEDGE_FORM = 'CLEAR_PLEDGE_FORM';
const REQUEST_SUBMIT_PLEDGE = 'REQUEST_SUBMIT_PLEDGE';
const ERROR_SUBMIT_PLEDGE = 'ERROR_SUBMIT_PLEDGE';

const GET_ALL_PLEDGES_FROM_USER = 'GET_ALL_PLEDGES_FROM_USER';
const GET_ALL_PLEDGES_FROM_USER_EMPTY = 'GET_ALL_PLEDGES_FROM_USER_EMPTY';
const GET_ALL_PLEDGES_FROM_USER_ERROR = 'GET_ALL_PLEDGES_FROM_USER_ERROR';
const GET_ALL_PLEDGES_FROM_USER_SUCCESS = 'GET_ALL_PLEDGES_FROM_USER_SUCCESS';

const REQUEST_CREATE_AGREEMENT = 'REQUEST_CREATE_AGREEMENT';
const CREATE_AGREEMENT_CONFIRMED = 'CREATE_AGREEMENT_CONFIRMED';

const UPDATE_PLEDGE_ITEM = 'UPDATE_PLEDGE_ITEM ';
const REQUEST_WITHDRAW_PLEDGE = 'REQUEST_WITHDRAW_PLEDGE';
const CONFIRM_WITHDRAW_PLEDGE = 'CONFIRM_WITHDRAW_PLEDGE';
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

export const requestSubmitPledge = payload => {
  return {
    type: REQUEST_SUBMIT_PLEDGE,
    payload,
  };
};

export const errorSubmitPledge = payload => {
  return {
    type: ERROR_SUBMIT_PLEDGE,
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

export const requestCreateAgreement = newPledge => {
  return {
    type: REQUEST_CREATE_AGREEMENT,
    newPledge,
  };
};

export const createAgreementConfirmed = updatedPledge => {
  return {
    type: CREATE_AGREEMENT_CONFIRMED,
    updatedPledge,
  };
};

export const updatePledgeItem = payload => {
  return {
    type: UPDATE_PLEDGE_ITEM,
    payload,
  };
};

export const requestWithdrawPledge = data => {
  return {
    type: REQUEST_WITHDRAW_PLEDGE,
    data,
  };
};

export const confirmWithdrawPledge = data => {
  return {
    type: CONFIRM_WITHDRAW_PLEDGE,
    data,
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
  userAcceptedTransaction: false,
  newPledgeDetails: {},
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
        newPledgeDetails: action.payload,
      };
    case ERROR_SUBMIT_PLEDGE:
      return {
        ...state,
        submittingPledge: false,
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
    case REQUEST_CREATE_AGREEMENT:
      return {
        ...state,
        userAcceptedTransaction: true,
        pledges: [...state.pledges, action.newPledge],
      };
    case CREATE_AGREEMENT_CONFIRMED:
      let updateCounter;
      for (let i = 0; i < state.pledges.length; i += 1) {
        if (
          state.pledges[i] &&
          state.pledges[i].agreementId === action.updatedPledge.agreementId
        ) {
          updateCounter = i;
          break;
        }
      }
      if (updateCounter) {
        return {
          ...state,
          userAcceptedTransaction: false,
          submittingPledge: false,
          pledges: [
            ...state.pledges.slice(0, updateCounter),
            action.updatedPledge,
            ...state.pledges.slice(updateCounter + 1),
          ],
        };
      } else {
        return {
          ...state,
          userAcceptedTransaction: false,
          txTimeStamp: action.timestamp,
        };
      }
    case UPDATE_PLEDGE_ITEM:
      let confirmPledgeCounter;
      for (let i = 0; i < state.pledges.length; i += 1) {
        if (
          state.pledges[i] &&
          state.pledges[i].agreementId === action.payload.agreementId
        ) {
          confirmPledgeCounter = i;
          break;
        }
      }
      if (confirmPledgeCounter) {
        return {
          ...state,
          pledges: [
            ...state.pledges.slice(0, confirmPledgeCounter),
            action.payload,
            ...state.pledges.slice(confirmPledgeCounter + 1),
          ],
        };
      } else {
        return {
          ...state,
        };
      }

    case REQUEST_WITHDRAW_PLEDGE:
      let requestWithdrawPledgeCounter;
      for (let i = 0; i < state.pledges.length; i += 1) {
        if (
          state.pledges[i] &&
          state.pledges[i].agreementId === action.data.agreementId
        ) {
          requestWithdrawPledgeCounter = i;
          break;
        }
      }
      if (requestWithdrawPledgeCounter) {
        return {
          ...state,
          pledges: [
            ...state.pledges.slice(0, requestWithdrawPledgeCounter),
            action.data,
            ...state.pledges.slice(requestWithdrawPledgeCounter + 1),
          ],
        };
      } else {
        return {
          ...state,
        };
      }
    case CONFIRM_WITHDRAW_PLEDGE:
      let confirmWithdrawPledgeCounter;
      for (let i = 0; i < state.pledges.length; i += 1) {
        if (
          state.pledges[i] &&
          state.pledges[i].agreementId === action.data.agreementId
        ) {
          confirmWithdrawPledgeCounter = i;
          break;
        }
      }
      if (confirmWithdrawPledgeCounter) {
        return {
          ...state,
          pledges: [
            ...state.pledges.slice(0, confirmWithdrawPledgeCounter),
            ...state.pledges.slice(confirmWithdrawPledgeCounter + 1),
          ],
        };
      } else {
        return {
          ...state,
        };
      }
    default:
      return state;
  }
};

export default pledges;
