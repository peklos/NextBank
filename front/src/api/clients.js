import axios from "./axios";


export const fetchClients = async () => {
    const res = await axios.get('/auth/allusers')
    return res.data
}

export const loginClient = async (email, password) => {
    if (email.length != 0 && password.length != 0) {
        try {
            const res = await axios.post('/auth/login', { email, password })
            return { data: res.data, error: null }
        } catch (err) {
            if (err.response) {
                const detail = err.response.data?.detail || err.response.data?.errors?.join(', ') || 'Неизвестная ошибка'
                return { data: null, error: detail }
            }
            return { data: null, error: 'Ошибка соединения с сервером' }
        }
    } else {
        return { data: null, error: 'Заполните все поля' }
    }

}