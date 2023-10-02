/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './src/Utility/Store/configureStore';
const store = configureStore();
import React from 'react';
import FlashMessage from "react-native-flash-message";
// import 'react-native-reanimated/reanimated';


const RNRedux = () => (

  <Provider store={store}>
    <App />
    <FlashMessage position="top"/>
  </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
