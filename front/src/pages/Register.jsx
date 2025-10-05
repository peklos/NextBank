import React, { useState } from 'react';
import styles from '../styles/register.module.css';
import { NavLink } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет логика регистрации
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
                    {/* Полное имя */}
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName" className={styles.formLabel}>
                            ФИО полностью
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Иванов Иван Иванович"
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
                                placeholder="+7 (999) 999-99-99"
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
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Не менее 8 символов"
                                    required
                                    minLength="8"
                                />
                                <div className={styles.inputIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.passwordGroup}>
                            <label htmlFor="confirmPassword" className={styles.formLabel}>
                                Подтверждение
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="password"
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