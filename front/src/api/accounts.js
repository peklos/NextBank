import axios from "./axios";

// Получить все счета текущего пользователя
export const fetchMyAccounts = async () => {
    try {
        const res = await axios.get(`/accounts/me`)
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось найти счета'
        return { data: null, error: detail }
    }
}

// Создать новый счет для текущего пользователя
export const createClientAccount = async () => {
    try {
        const res = await axios.post(`/accounts/`)
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось создать счет'
        return { data: null, error: detail }
    }
}

// Удалить счет текущего пользователя
export const deleteClientAccount = async (account_id) => {
    try {
        const res = await axios.delete(`/accounts/${account_id}`)
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось удалить счет'
        return { data: null, error: detail }
    }
}
