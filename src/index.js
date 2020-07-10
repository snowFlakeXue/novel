import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router'
import './style/common.less'
import {Provider} from 'react-redux'
import store from './redux/store'
import {PersistGate} from 'redux-persist/lib/integration/react'
import {persistStore} from 'redux-persist'

ReactDOM.render(
  <Provider store={store}>
  <PersistGate persistor={persistStore(store)}>
  <Router />
  </PersistGate>

  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
