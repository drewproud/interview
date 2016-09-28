/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import CartContainer from './components/CartContainer';

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    <CartContainer />
  </Provider>,
  document.getElementById('root')
);
