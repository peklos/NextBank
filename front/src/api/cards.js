import axios from "./axios";

// 📜 Получить все карты текущего пользователя
export const getClientCards = async () => {
    try {
        const res = await axios.get(`/cards/me`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить карты';
        return { data: null, error: detail };
    }
};

// 🆕 Создать новую карту
export const createClientCard = async (payload) => {
    try {
        const res = await axios.post(`/cards/`, payload);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось создать карту';
        return { data: null, error: detail };
    }
};

// 🚫 Деактивировать карту
export const deactivateClientCard = async (card_id) => {
    try {
        const res = await axios.patch(`/cards/${card_id}/deactivate`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось деактивировать карту';
        return { data: null, error: detail };
    }
};

// 🗑️ Удалить карту
export const deleteClientCard = async (card_id) => {
    try {
        const res = await axios.delete(`/cards/${card_id}`);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось удалить карту';
        return { data: null, error: detail };
    }
};

// 💰 Пополнить карту
export const depositToCard = async (card_id, amount) => {
    try {
        const res = await axios.post(`/cards/${card_id}/deposit`, null, {
            params: { amount }
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось пополнить карту';
        return { data: null, error: detail };
    }
};

// 💸 Снять деньги с карты
export const withdrawFromCard = async (card_id, amount) => {
    try {
        const res = await axios.post(`/cards/${card_id}/withdraw`, null, {
            params: { amount }
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось снять деньги с карты';
        return { data: null, error: detail };
    }
};

// 🔁 Перевод между картами
export const transferBetweenCards = async (from_card_id, to_card_number, amount) => {
    try {
        const res = await axios.post(`/cards/transfer`, null, {
            params: { from_card_id, to_card_number, amount }
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось перевести средства';
        return { data: null, error: detail };
    }
};
