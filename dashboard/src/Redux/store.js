import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthRedux";
import countryReducer from "./CountriesRedux";
import roomReducer from "./RoomsRedux";
import usersReducer from "./UsersRedux";
import logsReducer from "./LogsRedux";
import imagesReducer from "./ImagesRedux";
import emojieReducer from "./EmojieRedux";
import noticeReducer from "./NoticeRedux";

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
  log: logsReducer,
  image: imagesReducer,
  emojie: emojieReducer,
  notice: noticeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer); // Pass persistConfig to persistReducer

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
