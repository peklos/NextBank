import React, { useState } from 'react';
import styles from '../styles/accounts.module.css';

const Accounts = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Моковые данные счетов
    const accounts = [
        {
            id: 1,
            name: 'Основной счет',
            number: '•• 4321',
            balance: '245 670 ₽',
            currency: 'RUB',
            type: 'debit',
            status: 'active',
            interestRate: '0.5%',
            cardNumber: '5536 91•• •••• 4321',
            expiryDate: '12/25',
            transactionsCount: 47,
            color: '#3b82f6',
            icon: '💳'
        },
        {
            id: 2,
            name: 'Накопительный счет',
            number: '•• 5689',
            balance: '1 250 340 ₽',
            currency: 'RUB',
            type: 'savings',
            status: 'active',
            interestRate: '5.2%',
            cardNumber: '',
            expiryDate: '',
            transactionsCount: 12,
            color: '#10b981',
            icon: '💰'
        },
        {
            id: 3,
            name: 'Кредитная карта',
            number: '•• 7821',
            balance: '-45 230 ₽',
            currency: 'RUB',
            type: 'credit',
            status: 'active',
            creditLimit: '300 000 ₽',
            usedLimit: '45 230 ₽',
            cardNumber: '4478 23•• •••• 7821',
            expiryDate: '09/26',
            transactionsCount: 23,
            color: '#f59e0b',
            icon: '💎'
        },
        {
            id: 4,
            name: 'Долларовый счет',
            number: '•• 9045',
            balance: '$12 450',
            currency: 'USD',
            type: 'foreign',
            status: 'active',
            interestRate: '1.2%',
            cardNumber: '',
            expiryDate: '',
            transactionsCount: 8,
            color: '#ef4444',
            icon: '🌎'
        },
        {
            id: 5,
            name: 'Инвестиционный счет',
            number: '•• 6712',
            balance: '890 120 ₽',
            currency: 'RUB',
            type: 'investment',
            status: 'active',
            profit: '+12.5%',
            transactionsCount: 34,
            color: '#8b5cf6',
            icon: '📈'
        }
    ];

    // Общая статистика
    const totalStats = {
        totalBalance: '2 421 350 ₽',
        totalAccounts: accounts.length,
        activeCards: 3,
        monthlyIncome: '185 000 ₽',
        monthlyExpenses: '134 560 ₽'
    };

    // Фильтрация счетов по типу
    const filteredAccounts = accounts.filter(account => {
        if (activeTab === 'all') return true;
        return account.type === activeTab;
    });

    const accountTypes = {
        all: 'Все счета',
        debit: 'Дебетовые',
        credit: 'Кредитные',
        savings: 'Накопительные',
        foreign: 'Валютные',
        investment: 'Инвестиционные'
    };

    return (
        <div className={styles.accountsContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.accountsContent}>
                {/* Хедер страницы */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleIcon}>🏦</span>
                                Мои счета
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Управляйте вашими счетами и картами в одном месте
                            </p>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Общий баланс</span>
                                <span className={styles.statValue}>{totalStats.totalBalance}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Всего счетов</span>
                                <span className={styles.statValue}>{totalStats.totalAccounts}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Активных карт</span>
                                <span className={styles.statValue}>{totalStats.activeCards}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.accountsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Фильтры и действия */}
                        <div className={styles.leftColumn}>
                            {/* Фильтры по типам счетов */}
                            <section className={styles.filtersCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🔍</span>
                                        Фильтры
                                    </h2>
                                </div>
                                <div className={styles.filtersGroup}>
                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Тип счета</h3>
                                        <div className={styles.filterButtons}>
                                            {Object.entries(accountTypes).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    className={`${styles.filterBtn} ${activeTab === key ? styles.filterBtnActive : ''}`}
                                                    onClick={() => setActiveTab(key)}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Быстрые действия */}
                            <section className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsList}>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>➕</span>
                                        <span className={styles.actionText}>Открыть новый счет</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🔄</span>
                                        <span className={styles.actionText}>Перевод между счетами</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>💳</span>
                                        <span className={styles.actionText}>Заказать карту</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📄</span>
                                        <span className={styles.actionText}>Выписка по счетам</span>
                                    </button>
                                </div>
                            </section>

                            {/* Ежемесячная статистика */}
                            <section className={styles.statsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>📊</span>
                                        Статистика
                                    </h2>
                                </div>
                                <div className={styles.statsList}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>📥</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Доходы за месяц</span>
                                            <span className={`${styles.statValue} ${styles.income}`}>
                                                {totalStats.monthlyIncome}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>📤</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Расходы за месяц</span>
                                            <span className={`${styles.statValue} ${styles.outcome}`}>
                                                {totalStats.monthlyExpenses}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>🎯</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Экономия</span>
                                            <span className={styles.statValue}>50 440 ₽</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Правая колонка - Список счетов */}
                        <div className={styles.rightColumn}>
                            {/* Заголовок и поиск */}
                            <div className={styles.accountsHeader}>
                                <h2 className={styles.sectionTitle}>
                                    Мои счета
                                    <span className={styles.accountsCount}>({filteredAccounts.length})</span>
                                </h2>
                                <div className={styles.searchBox}>
                                    <input
                                        type="text"
                                        placeholder="Поиск по названию счета..."
                                        className={styles.searchInput}
                                    />
                                    <span className={styles.searchIcon}>🔍</span>
                                </div>
                            </div>

                            {/* Список счетов */}
                            <div className={styles.accountsGrid}>
                                {filteredAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className={`${styles.accountCard} ${selectedAccount === account.id ? styles.accountCardSelected : ''}`}
                                        onClick={() => setSelectedAccount(account.id)}
                                    >
                                        <div className={styles.accountHeader}>
                                            <div className={styles.accountIcon} style={{ backgroundColor: account.color }}>
                                                <span>{account.icon}</span>
                                            </div>
                                            <div className={styles.accountInfo}>
                                                <h3 className={styles.accountName}>{account.name}</h3>
                                                <span className={styles.accountNumber}>{account.number}</span>
                                            </div>
                                            <div className={styles.accountStatus}>
                                                <span className={styles.statusBadge}>{account.status}</span>
                                            </div>
                                        </div>

                                        <div className={styles.accountBalance}>
                                            <span className={`${styles.balance} ${account.balance.startsWith('-') ? styles.negativeBalance : ''}`}>
                                                {account.balance}
                                            </span>
                                            <span className={styles.currency}>{account.currency}</span>
                                        </div>

                                        {account.interestRate && (
                                            <div className={styles.accountRate}>
                                                <span className={styles.rateLabel}>Процентная ставка</span>
                                                <span className={styles.rateValue}>{account.interestRate}</span>
                                            </div>
                                        )}

                                        {account.cardNumber && (
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardNumber}>{account.cardNumber}</div>
                                                <div className={styles.cardExpiry}>Действует до {account.expiryDate}</div>
                                            </div>
                                        )}

                                        {account.creditLimit && (
                                            <div className={styles.creditInfo}>
                                                <div className={styles.limitBar}>
                                                    <div
                                                        className={styles.limitProgress}
                                                        style={{
                                                            width: `${(parseInt(account.usedLimit.replace(/\D/g, '')) / parseInt(account.creditLimit.replace(/\D/g, '')) * 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className={styles.limitText}>
                                                    <span>Использовано {account.usedLimit} из {account.creditLimit}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className={styles.accountFooter}>
                                            <div className={styles.transactionsInfo}>
                                                <span className={styles.transactionsText}>
                                                    {account.transactionsCount} операций
                                                </span>
                                            </div>
                                            <div className={styles.accountActions}>
                                                <button className={styles.actionBtn}>Перевод</button>
                                                <button className={styles.actionBtn}>Детали</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Кнопка добавления нового счета */}
                            <div className={styles.addAccountSection}>
                                <button className={styles.addAccountButton}>
                                    <span className={styles.addIcon}>+</span>
                                    Добавить новый счет
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Accounts;