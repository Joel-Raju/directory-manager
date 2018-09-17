import { 
  createStore,
  applyMiddleware,
  compose 
} from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';


export default function configureStore() {
  const middleware = [
    thunk,
  ];

  return createStore(
    rootReducer,
    compose(applyMiddleware(...middleware)),
  );
}
