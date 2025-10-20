// src/utils/validation.js
export const validatePersonalInfo = (info) => {
    if (!info.passport_number || !info.address || !info.birth_date || !info.employment_status) {
        return 'Заполните все поля';
    }

    const passportRegex = /^\d{10}$/;
    if (!passportRegex.test(info.passport_number.replace(/\s/g, ''))) {
        return 'Паспортный номер должен содержать 10 цифр';
    }

    const birthDate = new Date(info.birth_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
        return 'Дата рождения не может быть в будущем';
    }

    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
    minAgeDate.setHours(0, 0, 0, 0);

    if (birthDate > minAgeDate) {
        return 'Вы должны быть не младше 18 лет';
    }

    if (info.address.length < 10) {
        return 'Адрес должен содержать не менее 10 символов';
    }

    if (info.address.length > 200) {
        return 'Адрес не может быть длиннее 200 символов';
    }

    if (!info.employment_status) {
        return 'Выберите статус занятости из списка';
    }

    return null;
};

export const validatePassword = (form) => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        return 'Заполните все поля';
    }

    if (form.newPassword.length < 6) {
        return 'Новый пароль должен содержать минимум 6 символов';
    }

    if (!/\d/.test(form.newPassword)) {
        return 'Новый пароль должен содержать хотя бы одну цифру';
    }

    if (!/[a-zA-Z]/.test(form.newPassword)) {
        return 'Новый пароль должен содержать хотя бы одну букву';
    }

    if (form.newPassword !== form.confirmPassword) {
        return 'Пароли не совпадают';
    }

    if (form.currentPassword === form.newPassword) {
        return 'Новый пароль должен отличаться от текущего';
    }

    return null;
};

export const validateEmail = (form, currentEmail) => {
    if (!form.newEmail || !form.password) {
        return 'Заполните все поля';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.newEmail)) {
        return 'Введите корректный email адрес';
    }

    if (form.newEmail.toLowerCase() === currentEmail.toLowerCase()) {
        return 'Новый email совпадает с текущим';
    }

    return null;
};

export const validatePhone = (form) => {
    if (!form.newPhone || !form.password) {
        return 'Заполните все поля';
    }

    const phoneDigits = form.newPhone.replace(/\D/g, '');

    if (phoneDigits.length !== 11) {
        return 'Номер телефона должен содержать 11 цифр';
    }

    if (!phoneDigits.startsWith('7')) {
        return 'Номер телефона должен начинаться с 7';
    }

    return null;
};

export const formatPhoneInput = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';

    let formatted = '+7';
    if (digits.length > 1) {
        formatted += ' (' + digits.substring(1, 4);
    }
    if (digits.length >= 4) {
        formatted += ') ' + digits.substring(4, 7);
    }
    if (digits.length >= 7) {
        formatted += '-' + digits.substring(7, 9);
    }
    if (digits.length >= 9) {
        formatted += '-' + digits.substring(9, 11);
    }

    return formatted;
};