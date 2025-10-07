import React from 'react';
import styles from '../styles/profile.module.css';

const Profile = () => {
    // Моковые данные пользователя
    const userData = {
        fullName: 'Иванов Иван Иванович',
        email: 'ivan.ivanov@nextbank.ru',
        phone: '+7 (999) 123-45-67',
        joinDate: '15 января 2024',
        tier: 'Премиум',
        status: 'Активный клиент'
    };

    // Данные счетов
    const accounts = [
        {
            id: 1,
            name: 'Основной счет',
            number: '4081 7810 0999 1000 4321',
            balance: '1 250 750 ₽',
            type: 'RUB',
            currency: 'RUB',
            available: '1 250 750 ₽',
            icon: '💳'
        },
        {
            id: 2,
            name: 'Накопительный',
            number: '4081 7810 0999 1000 4322',
            balance: '350 000 ₽',
            type: 'RUB',
            currency: 'RUB',
            available: '350 000 ₽',
            icon: '💰'
        },
        {
            id: 3,
            name: 'Долларовый счет',
            number: '4081 7810 0999 1000 4323',
            balance: '$15,250',
            type: 'USD',
            currency: 'USD',
            available: '$15,250',
            icon: '💵'
        }
    ];

    const totalBalance = accounts.reduce((total, account) => {
        const balance = parseFloat(account.balance.replace(/[^\d.]/g, ''));
        return total + balance;
    }, 0);

    return (
        <div className={styles.profileContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.profileContent}>
                {/* Хедер профиля */}
                <header className={styles.profileHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <span className={styles.avatarInitials}>
                                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.userName}>{userData.fullName}</h1>
                                <div className={styles.userBadges}>
                                    <span className={styles.badgePrimary}>{userData.tier}</span>
                                    <span className={styles.badgeSecondary}>{userData.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Клиент с</span>
                                <span className={styles.statValue}>{userData.joinDate}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Всего счетов</span>
                                <span className={styles.statValue}>{accounts.length}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.profileMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Информация и счета */}
                        <div className={styles.leftColumn}>
                            {/* Личная информация */}
                            <section className={styles.infoCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>👤</span>
                                        Личная информация
                                    </h2>
                                    <button className={styles.editButton}>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                                            <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.infoList}>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoIcon}>📧</div>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>Email</span>
                                            <span className={styles.infoValue}>{userData.email}</span>
                                        </div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoIcon}>📱</div>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>Телефон</span>
                                            <span className={styles.infoValue}>{userData.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Ваши счета */}
                            <section className={styles.accountsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>💳</span>
                                        Ваши счета
                                    </h2>
                                    <div className={styles.totalBalance}>
                                        <span className={styles.balanceLabel}>Общий баланс</span>
                                        <span className={styles.balanceAmount}>
                                            {new Intl.NumberFormat('ru-RU').format(totalBalance)} ₽
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.accountsList}>
                                    {accounts.map((account) => (
                                        <div key={account.id} className={styles.accountItem}>
                                            <div className={styles.accountIcon}>
                                                <span>{account.icon}</span>
                                            </div>
                                            <div className={styles.accountInfo}>
                                                <div className={styles.accountMain}>
                                                    <span className={styles.accountName}>{account.name}</span>
                                                    <span className={styles.accountNumber}>{account.number}</span>
                                                </div>
                                                <div className={styles.accountBalance}>
                                                    <span className={styles.balance}>{account.balance}</span>
                                                    <span className={styles.currency}>{account.currency}</span>
                                                </div>
                                            </div>
                                            <div className={styles.accountActions}>
                                                <button className={styles.actionBtn}>→</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles.viewAllButton}>
                                    <span>Показать все счета</span>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </section>
                        </div>

                        {/* Правая колонка - Действия и настройки */}
                        <div className={styles.rightColumn}>
                            {/* Быстрые действия */}
                            <section className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsGrid}>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🔐</span>
                                        <span className={styles.actionText}>Сменить пароль</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📧</span>
                                        <span className={styles.actionText}>Изменить email</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📱</span>
                                        <span className={styles.actionText}>Сменить телефон</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🔔</span>
                                        <span className={styles.actionText}>Уведомления</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🌙</span>
                                        <span className={styles.actionText}>Тема оформления</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📄</span>
                                        <span className={styles.actionText}>Выписки</span>
                                    </button>
                                </div>
                            </section>

                            {/* Выход из системы */}
                            <section className={styles.logoutCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🚪</span>
                                        Выход из системы
                                    </h2>
                                </div>
                                <p className={styles.logoutText}>
                                    Завершите текущий сеанс работы с интернет-банкингом
                                </p>
                                <button className={styles.logoutButton}>
                                    <span className={styles.logoutIcon}>🚪</span>
                                    Выйти из системы
                                </button>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;