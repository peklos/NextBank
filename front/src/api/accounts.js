import axios from "./axios";

export const fetchClientAccounts = async (id) => {
    try {
        const res = await axios.get(`/accounts/client/${id}`)
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось найти счета'
        return { data: null, error: detail }
    }
}

export const createClientAccount = async (client_id) => {
    try {
        const res = await axios.post(`/accounts/`, { client_id })
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось создать счет'
        return { data: null, error: detail }
    }
}

export const deleteClientAccount = async (account_id) => {
    try {
        const res = await axios.delete(`/accounts/${account_id}`)
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось удалить счет'
        return { data: null, error: detail }
    }
}