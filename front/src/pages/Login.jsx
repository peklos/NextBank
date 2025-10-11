import { useState } from 'react';
import styles from '../styles/login.module.css';
import { NavLink } from 'react-router-dom';
import { handleLogin } from '../services/authService';
import { useDispatch } from 'react-redux'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('')

        if (!email || !password) {
            setError('Заполните все поля')
            return
        }

        // EmailStr как в Pydantic на бэкенде
        const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/

        if (!emailRegex.test(email)) {
            setError('Некорректный email')
            return
        }

        const res = await handleLogin(dispatch, email, password);

        if (!res.success) {
            setError(res.error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBackground}>
                <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob3}`}></div>
            </div>

            <div className={styles.loginCard}>
                {/* Заголовок */}
                <div className={styles.textCenter}>
                    <div className={styles.bankLogo}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L3 7V21H21V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16V12M8 12H16" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h1 className={styles.bankName}>NEXT</h1>
                    </div>
                    <p className={styles.loginSubtitle}>Интернет-банкинг</p>
                </div>

                {/* Форма входа */}
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            EMAIL
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите вашу почту"
                            />
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Пароль
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите ваш пароль"
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

                    <div className={styles.flexBetween}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={styles.checkboxInput}
                            />
                            <span className={styles.checkboxCustom}></span>
                            <span className={styles.checkboxText}>Запомнить меня</span>
                        </label>

                        <a href="#" className={styles.forgotLink}>
                            Забыли пароль?
                        </a>
                    </div>

                    <button type="submit" className={styles.loginButton}>
                        Войти в систему
                        <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>

                    {/* Блок ошибки */}
                    {error && (
                        <div className={styles.errorContainer}>
                            <p className={styles.errorMessage}>{error}</p>
                        </div>
                    )}

                </form>

                {/* Дополнительные ссылки */}
                <div className={styles.loginFooter}>
                    <p className={styles.footerText}>
                        Впервые в NEXT?{' '}
                        <NavLink to='/register' className={styles.footerLink}>
                            Открыть счет
                        </NavLink>
                    </p>

                    <div className={styles.securityBadge}>
                        <svg className={styles.securityIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>Защищено SSL-шифрованием</span>
                    </div>
                </div>
            </div>
        </div>
    );
};