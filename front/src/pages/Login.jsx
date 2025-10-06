import { useState } from 'react';
import styles from '../styles/login.module.css';
import { NavLink } from 'react-router-dom';
import { loginClient } from '../api/clients'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../features/auth/authSlice'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('')
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

        const res = await loginClient(email, password)

        if (res.data != null) {
            dispatch(setUser({
                full_name: res.data.full_name,
                email: res.data.email,
                access_token: res.data.access_token,
                created_at: res.data.created_at
            }))
        } else {
            setError(res.error)
        }
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
                                type="password"
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

                    <button type="submit" onClick={e => handleSubmit(e)} className={styles.loginButton}>
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