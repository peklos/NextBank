// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import personalInfoReducer from '../features/auth/personalInfoSlice'
import accountsReducer from '../features/accounts/accSlice'
import cardReducer from '../features/cards/cardSlice'
import loansReducer from '../features/loans/loansSlice'
import processesReducer from '../features/processes/processesSlice'
import transactionsReducer from '../features/transactions/transactionsSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    personalInfo: personalInfoReducer,
    accounts: accountsReducer,
    cards: cardReducer,
    loans: loansReducer,
    processes: processesReducer,
    transactions: transactionsReducer
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