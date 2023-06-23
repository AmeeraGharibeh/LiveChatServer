import { BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<Provider store={store}>
    <PersistGate loading="null" persistor={persistor}>      
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </PersistGate>
  </Provider>  </React.StrictMode>
);
//document.getElementsByTagName('html')[0].setAttribute("dir", "rtl");

