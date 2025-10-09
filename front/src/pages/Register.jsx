import React, { useState } from 'react';
import styles from '../styles/register.module.css';
import { NavLink } from 'react-router-dom';
import { registerClient } from '../api/clients';
import { setUser } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { setPersonalInfo } from '../features/auth/personalInfoSlice';


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

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const dispatch = useDispatch()

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('')

        // 1. Проверка заполненности всех обязательных полей
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.password || !formData.confirmPassword) {
            setError('Заполните все поля')
            return
        }

        // 2. Проверка ФИО 
        if (formData.firstName.length > 50) {
            setError('Имя не может быть длиннее 50 символов')
            return
        }

        if (formData.lastName.length > 50) {
            setError('Фамилия не может быть длиннее 50 символов')
            return
        }

        const russianRegex = /^[а-яА-ЯёЁ\s\-]*$/;
        if (!russianRegex.test(formData.firstName) ||
            !russianRegex.test(formData.lastName) ||
            !russianRegex.test(formData.patronymic)) {
            setError('ФИО должно содержать только русские буквы')
            return
        }

        // 3. Проверка почты
        if (formData.email.length > 100) {
            setError('Почта не может быть длиннее 100 символов')
            return
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/
        if (!emailRegex.test(formData.email)) {
            setError('Некорректный email')
            return
        }

        // 4. Проверка телефона
        if (formData.phone.length > 20) {
            setError('Телефон не может быть длиннее 20 символов')
            return
        }

        const phoneRegex = /^\+?[0-9]+$/
        if (!phoneRegex.test(formData.phone)) {
            setError('Телефон должен содержать только цифры')
            return
        }

        // 5. Проверка пароля
        if (formData.password.length < 6) {
            setError('Пароль должен быть не менее 6 символов')
            return
        }

        const passwordRegex = /^[a-zA-Z0-9]+$/
        if (!passwordRegex.test(formData.password)) {
            setError('Пароль должен содержать только латинские буквы и цифры')
            return
        }

        const hasDigit = /\d/.test(formData.password)
        if (!hasDigit) {
            setError('Пароль должен содержать хотя бы одну цифру')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают')
            return
        }

        const res = await registerClient(
            formData.firstName,
            formData.lastName,
            formData.patronymic,
            formData.email,
            formData.phone,
            formData.password
        )

        if (res.data != null) {
            dispatch(setUser({
                access_token: res.data.access_token,
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                patronymic: res.data.patronymic,
                email: res.data.email,
                created_at: res.data.created_at
            }))

            if (res.data.personal_info != null) {
                dispatch(setPersonalInfo({
                    phone: res.data.personal_info.phone,
                    address: res.data.personal_info.address,
                    birth_date: res.data.personal_info.birth_date
                }))
            }


        } else {
            setError(res.error)
        }

    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBackground}>
                <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob3}`}></div>
            </div>

            <div className={styles.registerCard}>
                {/* Заголовок */}
                <div className={styles.textCenter}>
                    <div className={styles.bankLogo}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L3 7V21H21V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16V12M8 12H16" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 16H16" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h1 className={styles.bankName}>NEXT</h1>
                    </div>
                    <p className={styles.registerSubtitle}>Создание аккаунта</p>
                </div>

                {/* Форма регистрации */}
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    {/* ФИО в одну строку */}
                    <div className={styles.nameRow}>
                        <div className={styles.nameGroup}>
                            <label htmlFor="lastName" className={styles.formLabel}>
                                Фамилия
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Иванов"
                                    required
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.nameGroup}>
                            <label htmlFor="firstName" className={styles.formLabel}>
                                Имя
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Иван"
                                    required
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.nameGroup}>
                            <label htmlFor="patronymic" className={styles.formLabel}>
                                Отчество
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    id="patronymic"
                                    name="patronymic"
                                    value={formData.patronymic}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Иванович"
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Электронная почта
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="your@email.com"
                                required
                            />
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M2 7L10.913 12.916C11.572 13.361 12.428 13.361 13.087 12.916L22 7" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Номер телефона */}
                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.formLabel}>
                            Номер телефона
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="+79991234567"
                                required
                            />
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92V19.92C22 20.52 21.49 21.03 20.92 21.05C19.91 21.09 18.91 21 17.94 20.78C14.22 20 11 17.78 9.22 14.06C8.999 13.09 8.909 12.09 8.949 11.08C8.969 10.51 9.479 10 10.08 10H13.08C13.67 10 14.17 10.48 14.22 11.07C14.28 11.8 14.42 12.52 14.64 13.21C14.75 13.58 14.65 13.99 14.38 14.27L13.08 15.57C14.2 17.45 15.99 18.8 17.94 19.36C18.22 19.45 18.51 19.42 18.73 19.22L20.37 17.78C20.66 17.53 21.09 17.45 21.45 17.57C21.81 17.69 22.08 17.99 22.15 18.36C22.21 18.72 22.18 19.09 22.06 19.43" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Пароль и подтверждение в одну строку */}
                    <div className={styles.passwordRow}>
                        <div className={styles.passwordGroup}>
                            <label htmlFor="password" className={styles.formLabel}>
                                Пароль
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Не менее 6 символов"
                                    required
                                    minLength="6"
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor" strokeWidth="2" />
                                            <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1961C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" />
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68189 3.96914 7.65661 6.06 6.06" stroke="currentColor" strokeWidth="2" />
                                            <path d="M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19" stroke="currentColor" strokeWidth="2" />
                                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={styles.passwordGroup}>
                            <label htmlFor="confirmPassword" className={styles.formLabel}>
                                Повторите пароль
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Повторите пароль"
                                    required
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 3C13.6672 3 15.2672 3.525 16.642 4.462C18.0167 5.399 18.8909 6.787 19.126 8.312C19.1345 8.366 19.1345 8.422 19.126 8.476C19.0735 8.792 18.736 9 18.42 9C18.104 9 17.785 8.792 17.712 8.478C17.705 8.443 17.705 8.405 17.712 8.37C17.8919 7.213 18.5169 6.115 19.462 5.288C20.407 4.462 21.511 3.975 22.684 3.9C22.794 3.9 22.9 3.9 23 3.9" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor" strokeWidth="2" />
                                            <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1961C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" />
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68189 3.96914 7.65661 6.06 6.06" stroke="currentColor" strokeWidth="2" />
                                            <path d="M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19" stroke="currentColor" strokeWidth="2" />
                                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Соглашение */}
                    <div className={`${styles.formGroup} ${styles.mb4}`}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className={styles.checkboxInput}
                                required
                            />
                            <span className={styles.checkboxCustom}></span>
                            <span className={styles.checkboxText}>
                                Я соглашаюсь с{' '}
                                <a href="#" className={styles.termsLink}>
                                    условиями обслуживания
                                </a>{' '}
                                и{' '}
                                <a href="#" className={styles.termsLink}>
                                    политикой конфиденциальности
                                </a>
                            </span>
                        </label>
                    </div>

                    {/* Кнопка регистрации */}
                    <button
                        type="submit"
                        className={styles.registerButton}
                        disabled={!formData.agreeTerms}
                    >
                        Создать аккаунт
                        <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 12H4M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>

                    {error && (
                        <div className={styles.errorContainer}>
                            <p className={styles.errorMessage}>{error}</p>
                        </div>
                    )}
                </form>

                {/* Футер */}
                <div className={styles.registerFooter}>
                    <p className={styles.footerText}>
                        Уже есть аккаунт?{' '}
                        <NavLink to="/login" className={styles.footerLink}>
                            Войти
                        </NavLink>
                    </p>

                    <div className={styles.securityBadge}>
                        <svg className={styles.securityIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>Ваши данные защищены</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;