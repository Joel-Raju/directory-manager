import { combineReducers } from 'redux';
import fileSystemReducer from './fileSystemReducer';

const rootReducer = combineReducers({
  fileSystemReducer,
});

export default rootReducer;