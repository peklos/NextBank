import axios from "./axios";

// 🆕 Подать заявку на кредит
export const applyForLoan = async (loanData) => {
    try {
        const res = await axios.post('/loans/apply', loanData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось подать заявку на кредит';
        return { data: null, error: detail };
    }
};

// 📜 Получить все кредиты текущего пользователя
export const getMyLoans = async () => {
    try {
        const res = await axios.get('/loans/me');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить кредиты';
        return { data: null, error: detail };
    }
};

// 🔍 Получить детали конкретного кредита
export const getLoanDetails = async (loanId) => {
    try {
        const res = await axios.get(`/loans/${loanId}`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить информацию о кредите';
        return { data: null, error: detail };
    }
};

// 💰 Оплатить кредит
export const payLoan = async (loanId, paymentData) => {
    try {
        const res = await axios.post(`/loans/${loanId}/pay`, paymentData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось оплатить кредит';
        return { data: null, error: detail };
    }
};

// 📊 Получить график платежей
export const getLoanSchedule = async (loanId) => {
    try {
        const res = await axios.get(`/loans/${loanId}/schedule`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить график платежей';
        return { data: null, error: detail };
    }
};