import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthRedux";
import countryReducer from "./CountriesRedux";
import roomReducer from "./RoomsRedux";
import usersReducer from "./UsersRedux"
import logsReducer from "./LogsRedux"


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  country: countryReducer,
  room: roomReducer,
  user: usersReducer,
  log: logsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ PAUSE, PERSIST, REHYDRATE, PURGE, FLUSH, REGISTER ],
      },
    }),
});

export let persistor = persistStore(store);