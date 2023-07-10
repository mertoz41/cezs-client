import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducer'
// import userReducer from './userReducer';

// const rootReducer = combineReducers({
//     user: userReducer
// });
const store = createStore(reducer)
// const middleware = composeWithDevTools(applyMiddleware(thunk));

// const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),);

export default store;