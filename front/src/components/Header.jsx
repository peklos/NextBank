import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/header.module.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Блокировка скролла когда меню открыто
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
            document.documentElement.style.overflowX = 'hidden';
        } else {
            document.body.classList.remove('menu-open');
            document.documentElement.style.overflowX = 'visible';
        }

        // Очистка при размонтировании
        return () => {
            document.body.classList.remove('menu-open');
            document.documentElement.style.overflowX = 'visible';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
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

                {/* Кнопка бургер-меню для мобильных */}
                <button
                    className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleActive : ''}`}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Навигация - теперь на весь экран */}
                <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                        }
                        onClick={closeMenu}
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/accounts"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                        }
                        onClick={closeMenu}
                    >
                        Счета
                    </NavLink>
                    <NavLink
                        to="/loans"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                        }
                        onClick={closeMenu}
                    >
                        Кредиты
                    </NavLink>
                    <NavLink
                        to="/transfers"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                        }
                        onClick={closeMenu}
                    >
                        История транзакций
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                        }
                        onClick={closeMenu}
                    >
                        Профиль
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;