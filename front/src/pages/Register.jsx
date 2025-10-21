import { useState } from 'react';
import styles from '../styles/register.module.css';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleRegister } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '');

        if (digits.length === 0) return '';
        if (digits.length <= 1) return `+${digits}`;
        if (digits.length <= 4) return `+${digits[0]} ${digits.slice(1)}`;
        if (digits.length <= 7) return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4)}`;
        if (digits.length <= 9) return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) return 'Обязательное поле';
                if (value.length > 50) return 'Максимум 50 символов';
                if (!/^[а-яА-ЯёЁ\s\-]*$/.test(value)) return 'Только русские буквы';
                return '';

            case 'patronymic':
                if (value && value.length > 50) return 'Максимум 50 символов';
                if (value && !/^[а-яА-ЯёЁ\s\-]*$/.test(value)) return 'Только русские буквы';
                return '';

            case 'email':
                if (!value) return 'Обязательное поле';
                if (value.length > 100) return 'Максимум 100 символов';
                if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(value)) {
                    return 'Некорректный email';
                }
                return '';

            case 'phone':
                if (!value) return 'Обязательное поле';
                const digits = value.replace(/\D/g, '');
                if (digits.length !== 11) return 'Введите 11 цифр';
                if (!digits.startsWith('7')) return 'Номер должен начинаться с 7';
                return '';

            case 'password':
                if (!value) return 'Обязательное поле';
                if (value.length < 8) return 'Минимум 8 символов';
                if (!/[A-Z]/.test(value)) return 'Хотя бы одна заглавная буква';
                if (!/[a-z]/.test(value)) return 'Хотя бы одна строчная буква';
                if (!/\d/.test(value)) return 'Хотя бы одна цифра';
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Хотя бы один спецсимвол (!@#$%^&*...)';
                return '';

            case 'confirmPassword':
                if (!value) return 'Обязательное поле';
                if (value !== formData.password) return 'Пароли не совпадают';
                return '';

            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        // Форматирование телефона
        if (name === 'phone') {
            newValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (type !== 'checkbox') {
            const error = validateField(name, newValue);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'agreeTerms') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'Необходимо согласие';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Убираем форматирование перед отправкой
            const dataToSend = {
                ...formData,
                phone: formData.phone.replace(/\D/g, '')
            };

            const res = await handleRegister(dispatch, dataToSend);
            if (!res.success) {
                setErrors({ submit: res.error });
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
                <div className={`${styles.blob} ${styles.blob3}`}></div>
            </div>

            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L3 7V21H21V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16V12M8 12H16" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>NEXT</h1>
                    <p className={styles.subtitle}>Создание аккаунта</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Фамилия *"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? styles.inputError : styles.input}
                            />
                            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                        </div>

                        <div className={styles.field}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Имя *"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? styles.inputError : styles.input}
                            />
                            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <input
                            type="text"
                            name="patronymic"
                            placeholder="Отчество"
                            value={formData.patronymic}
                            onChange={handleChange}
                            className={errors.patronymic ? styles.inputError : styles.input}
                        />
                        {errors.patronymic && <span className={styles.error}>{errors.patronymic}</span>}
                    </div>

                    <div className={styles.field}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : styles.input}
                        />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+7 900 123 45 67"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? styles.inputError : styles.input}
                            maxLength="16"
                        />
                        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Пароль *"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? styles.inputError : styles.input}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.eyeButton}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <span className={styles.error}>{errors.password}</span>}
                        </div>

                        <div className={styles.field}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Повторите пароль *"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? styles.inputError : styles.input}
                            />
                            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                        />
                        <span className={styles.checkboxCustom}></span>
                        <span>
                            Я соглашаюсь с{' '}
                            <a href="#">условиями обслуживания</a>
                            {' '}и{' '}
                            <a href="#">политикой конфиденциальности</a>
                        </span>
                    </label>
                    {errors.agreeTerms && <span className={styles.error}>{errors.agreeTerms}</span>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.button}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Создать аккаунт'}
                        <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    {errors.submit && (
                        <div className={styles.submitError}>
                            {errors.submit}
                        </div>
                    )}
                </form>

                <div className={styles.footer}>
                    <p>
                        Уже есть аккаунт?{' '}
                        <NavLink to="/login">Войти</NavLink>
                    </p>
                    <div className={styles.securityBadge}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span>Ваши данные защищены</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;