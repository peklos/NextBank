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

export const registerClient = async (first_name, last_name, patronymic, email, phone, password) => {
    if (first_name.length != 0 && last_name.length != 0 && patronymic.length != 0 && email.length != 0 && phone.length != 0 && password.length != 0) {
        try {
            const res = await axios.post('/auth/register', { first_name, last_name, patronymic, email, phone, password })
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

export const getMe = async () => {
    try {
        const res = await axios.get('/auth/me')
        return { data: res.data, error: null }
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось авторизоваться'
        return { data: null, error: detail }
    }
}