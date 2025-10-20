import axios from "./axios";

// 📋 Получить полный профиль
export const getMyProfile = async () => {
    try {
        const res = await axios.get('/profile/me');
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось получить профиль';
        return { data: null, error: detail };
    }
};

// ✏️ Обновить основную информацию профиля (имя, фамилия, отчество)
export const updateProfile = async (profileData) => {
    try {
        const res = await axios.patch('/profile/update', profileData);
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось обновить профиль';
        return { data: null, error: detail };
    }
};

// 🔐 Изменить пароль
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const res = await axios.post('/profile/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось изменить пароль';
        return { data: null, error: detail };
    }
};

// 📧 Изменить email
export const changeEmail = async (newEmail, password) => {
    try {
        const res = await axios.post('/profile/change-email', {
            new_email: newEmail,
            password: password
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось изменить email';
        return { data: null, error: detail };
    }
};

// 📱 Изменить телефон
export const changePhone = async (newPhone, password) => {
    try {
        const res = await axios.post('/profile/change-phone', {
            new_phone: newPhone,
            password: password
        });
        return { data: res.data, error: null };
    } catch (err) {
        const detail = err.response?.data?.detail || 'Не удалось изменить телефон';
        return { data: null, error: detail };
    }
};