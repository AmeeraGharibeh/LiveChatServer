import { BrowserRouter} from 'react-router-dom';
import React from 'react';
import {render} from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Redux/store";

const root = document.getElementById('root'); // <- This is the correct method call for React version 17
render(
<React.StrictMode>
<Provider store={store}>
    <PersistGate loading="null" persistor={persistor}>      
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </PersistGate>
  </Provider>
  </React.StrictMode>,
  root
);
//document.getElementsByTagName('html')[0].setAttribute("dir", "rtl");

