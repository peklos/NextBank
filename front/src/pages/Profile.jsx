import React from 'react';
import styles from '../styles/profile.module.css';
import { NavLink } from 'react-router-dom';

const Profile = () => {
    // Моковые данные пользователя
    const userData = {
        fullName: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        phone: '+7 (999) 999-99-99',
        joinDate: '15 января 2024',
        accountNumber: '40817810099910004321',
        accountType: 'Премиум'
    };

    const handleLogout = () => {
        // Здесь будет логика выхода
        console.log('Выход из системы');
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileBackground}>
                <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>
                <div className={`${styles.gradientBlob} ${styles.blob3}`}></div>
            </div>

            <div className={styles.profileCard}>
                {/* Заголовок */}
                <div className={styles.profileHeader}>
                    <div className={styles.bankLogo}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L3 7V21H21V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 16V12M8 12H16" stroke="currentColor" strokeWidth="2"/>
                                <path d="M8 16H16" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <h1 className={styles.bankName}>NEXT</h1>
                    </div>
                    <p className={styles.profileSubtitle}>Личный кабинет</p>
                </div>

                {/* Аватар и основная информация */}
                <div className={styles.profileMain}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            <span className={styles.avatarText}>
                                {userData.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className={styles.userStatus}>
                            <span className={styles.statusBadge}>
                                {userData.accountType}
                            </span>
                        </div>
                    </div>

                    {/* Карточка с информацией */}
                    <div className={styles.infoCard}>
                        <div className={styles.infoSection}>
                            <h3 className={styles.infoTitle}>Основная информация</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>ФИО</span>
                                    <span className={styles.infoValue}>{userData.fullName}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={styles.infoValue}>{userData.email}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Телефон</span>
                                    <span className={styles.infoValue}>{userData.phone}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Дата регистрации</span>
                                    <span className={styles.infoValue}>{userData.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h3 className={styles.infoTitle}>Банковские реквизиты</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Номер счета</span>
                                    <span className={styles.infoValue}>{userData.accountNumber}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Тип счета</span>
                                    <span className={styles.infoValue}>{userData.accountType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Действия */}
                <div className={styles.actionsSection}>
                    <div className={styles.actionButtons}>
                        <button className={styles.editButton}>
                            <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2"/>
                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Редактировать профиль
                        </button>
                        
                        <button className={styles.securityButton}>
                            <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Безопасность
                        </button>
                    </div>

                    <button 
                        className={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Выйти из системы
                    </button>
                </div>

                {/* Футер */}
                <div className={styles.profileFooter}>
                    <div className={styles.securityBadge}>
                        <svg className={styles.securityIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Защищено SSL-шифрованием</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;