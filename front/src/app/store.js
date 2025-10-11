// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import personalInfoReducer from '../features/auth/personalInfoSlice'
import accountsReducer from '../features/accounts/accSlice'

const rootReducer = combineReducers({
    auth: authReducer, // ✅ теперь в стейте будет state.auth
    personalInfo: personalInfoReducer,
    accounts: accountsReducer
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/FLUSH',
                    'persist/PURGE',
                    'persist/REGISTER',
                ],
            },
        }),
})

export const persistor = persistStore(store)
