import {combineReducers} from 'redux';
import registration from './registration';
import pledges from './pledges';

const rootReducer = combineReducers({
  registration,
  pledges
});

export default rootReducer;
