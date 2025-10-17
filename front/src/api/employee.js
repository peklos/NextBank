import axios from "./axios";

// Логин сотрудника
export const loginEmployee = async (email, password) => {
    if (!email || !password) {
        return { data: null, error: 'Заполните все поля' };
    }

    try {
        const res = await axios.post('/admin/auth/login', { email, password });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Ошибка входа';
        return { data: null, error: detail };
    }
};

// Регистрация сотрудника (только для Admin)
export const registerEmployee = async (employeeData) => {
    try {
        const res = await axios.post('/admin/auth/register', employeeData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Ошибка регистрации';
        return { data: null, error: detail };
    }
};

// Получить текущего сотрудника (автологин)
export const getEmployeeMe = async () => {
    try {
        const res = await axios.get('/admin/auth/me');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить данные';
        return { data: null, error: detail };
    }
};