
import React from 'react';
import ReactDOM from 'react-dom';
/*import 'babel-polyfill'*/
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import appStore from '../app/reducers/demo.js'
import App from '../app/component/demo/Index.jsx';
/*import Header from '../app/component/common/Header';
import Footer from '../app/component/common/Footer';*/

let store = createStore(appStore)

ReactDOM.render(
  <Provider store={store}>

       <App />

  </Provider>,
  document.getElementById('app')
)
