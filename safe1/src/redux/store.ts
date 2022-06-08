import { applyMiddleware, createStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducer from '@/redux/reducers';

const store = createStore(reducer, applyMiddleware(thunk));

export default store;