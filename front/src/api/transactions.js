import axios from "./axios";

// 📜 Получить все транзакции текущего пользователя
export const getMyTransactions = async (params = {}) => {
    try {
        const res = await axios.get('/transactions/me', { params });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить транзакции';
        return { data: null, error: detail };
    }
};

// 🔍 Получить детали конкретной транзакции
export const getTransactionDetails = async (transactionId) => {
    try {
        const res = await axios.get(`/transactions/${transactionId}`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить информацию о транзакции';
        return { data: null, error: detail };
    }
};

// 📊 Получить статистику по транзакциям
export const getMyTransactionsStats = async () => {
    try {
        const res = await axios.get('/transactions/me/stats');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить статистику';
        return { data: null, error: detail };
    }
};

// 🔎 Поиск транзакций
export const searchTransactions = async (query) => {
    try {
        const res = await axios.get('/transactions/search/', { params: { query } });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось выполнить поиск';
        return { data: null, error: detail };
    }
};