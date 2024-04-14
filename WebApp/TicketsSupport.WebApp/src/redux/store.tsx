import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
//Slices
import authReducer from "./Slices/AuthSlice";
import languageReducer from "./Slices/LanguageSlice";

const persistConfig = {
  key: "auth",
  storage,
};
const authPersistedReducer = persistReducer(persistConfig, authReducer);

const persistLanguageConfig = {
  key: 'language',
  storage
}
const languagePersistedReducer = persistReducer(persistLanguageConfig, languageReducer)


export const store = configureStore({
  reducer: {
    auth: authPersistedReducer,
    language: languagePersistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
