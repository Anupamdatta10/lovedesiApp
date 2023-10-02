import { createStore, combineReducers,applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';

import mainReducer from '../../Reducers/mainReducer';

const rootReducer = combineReducers({ mainReducer });

const configureStore = () => {
    return createStore(rootReducer,applyMiddleware(thunk))
}

export default configureStore;