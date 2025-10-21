// front/src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Клиентские редьюсеры
import authReducer from '../features/auth/authSlice';
import personalInfoReducer from '../features/auth/personalInfoSlice';
import accountsReducer from '../features/accounts/accSlice';
import cardReducer from '../features/cards/cardSlice';
import loansReducer from '../features/loans/loansSlice';
import processesReducer from '../features/processes/processesSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';

// Админские редьюсеры
import employeeReducer from '../features/employee/employeeSlice';
import adminReducer from '../features/admin/adminSlice';

const rootReducer = combineReducers({
    // Клиентские состояния
    auth: authReducer,
    personalInfo: personalInfoReducer,
    accounts: accountsReducer,
    cards: cardReducer,
    loans: loansReducer,
    processes: processesReducer,
    transactions: transactionsReducer,

    // Админские состояния
    employee: employeeReducer,
    admin: adminReducer
});

export const store = configureStore({
    reducer: rootReducer,
});

// Убираем persistor - он больше не нужен
export const persistor = null;