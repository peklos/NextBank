import React, { useState } from 'react';
import styles from '../styles/accounts.module.css';

const Accounts = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Моковые данные счетов в вашем формате
    const accounts = [
        {
            id: 1,
            account_number: "21379901342796797608",
            balance: 245670,
            created_at: "2024-01-15T10:30:00+03:00",
            type: "debit",
            status: "active"
        },
        {
            id: 2,
            account_number: "21379901342796797609",
            balance: 1250340,
            created_at: "2024-02-20T14:45:00+03:00",
            type: "savings",
            status: "active"
        },
        {
            id: 3,
            account_number: "21379901342796797610",
            balance: -45230,
            created_at: "2024-03-10T09:15:00+03:00",
            type: "credit",
            status: "active"
        },
        {
            id: 4,
            account_number: "21379901342796797611",
            balance: 890120,
            created_at: "2024-04-05T16:20:00+03:00",
            type: "investment",
            status: "active"
        }
    ];

    // Общая статистика
    const totalStats = {
        totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString('ru-RU') + ' ₽',
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.status === 'active').length,
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
        debit: 'Расчетные',
        credit: 'Кредитные',
        savings: 'Накопительные',
        investment: 'Инвестиционные'
    };

    // Форматирование номера счета
    const formatAccountNumber = (number) => {
        return number.slice(0, 4) + ' •••• •••• ' + number.slice(-4);
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Получение иконки и цвета по типу счета
    const getAccountTypeInfo = (type) => {
        switch (type) {
            case 'debit':
                return { icon: '💳', color: '#3b82f6', name: 'Расчетный счет' };
            case 'savings':
                return { icon: '💰', color: '#10b981', name: 'Накопительный счет' };
            case 'credit':
                return { icon: '💎', color: '#f59e0b', name: 'Кредитный счет' };
            case 'investment':
                return { icon: '📈', color: '#8b5cf6', name: 'Инвестиционный счет' };
            default:
                return { icon: '🏦', color: '#6b7280', name: 'Счет' };
        }
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
                                Управляйте вашими банковскими счетами
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
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.accountsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Фильтры и статистика */}
                        <div className={styles.leftColumn}>

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
                                        placeholder="Поиск по номеру счета..."
                                        className={styles.searchInput}
                                    />
                                    <span className={styles.searchIcon}>🔍</span>
                                </div>
                            </div>

                            {/* Список счетов или сообщение об отсутствии */}
                            {filteredAccounts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🏦</div>
                                    <h3 className={styles.emptyTitle}>У вас нет счетов</h3>
                                    <p className={styles.emptyDescription}>
                                        Откройте первый счет, чтобы начать пользоваться банковскими услугами
                                    </p>
                                    <button className={styles.createAccountButton}>
                                        <span className={styles.addIcon}>+</span>
                                        Создать первый счет
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.accountsGrid}>
                                        {filteredAccounts.map((account) => {
                                            const typeInfo = getAccountTypeInfo(account.type);
                                            return (
                                                <div
                                                    key={account.id}
                                                    className={`${styles.accountCard} ${selectedAccount === account.id ? styles.accountCardSelected : ''}`}
                                                    onClick={() => setSelectedAccount(account.id)}
                                                >
                                                    <div className={styles.accountHeader}>
                                                        <div className={styles.accountIcon} style={{ backgroundColor: typeInfo.color }}>
                                                            <span>{typeInfo.icon}</span>
                                                        </div>
                                                        <div className={styles.accountInfo}>
                                                            <h3 className={styles.accountName}>{typeInfo.name}</h3>
                                                            <span className={styles.accountNumber}>
                                                                {formatAccountNumber(account.account_number)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.accountStatus}>
                                                            <span className={`${styles.statusBadge} ${account.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                                                                {account.status === 'active' ? 'Активен' : 'Неактивен'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.accountBalance}>
                                                        <span className={`${styles.balance} ${account.balance < 0 ? styles.negativeBalance : ''}`}>
                                                            {account.balance.toLocaleString('ru-RU')} ₽
                                                        </span>
                                                    </div>

                                                    <div className={styles.accountDetails}>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Дата открытия:</span>
                                                            <span className={styles.detailValue}>{formatDate(account.created_at)}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Номер счета:</span>
                                                            <span className={styles.detailValue}>{account.account_number}</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.accountFooter}>
                                                        <div className={styles.accountActions}>
                                                            <button
                                                                className={styles.actionBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Переход к карточкам счета
                                                                }}
                                                            >
                                                                💳 Привязанные карты
                                                            </button>
                                                            <button
                                                                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Удаление счета
                                                                }}
                                                            >
                                                                🗑️ Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Кнопка добавления нового счета */}
                                    <div className={styles.addAccountSection}>
                                        <button className={styles.addAccountButton}>
                                            <span className={styles.addIcon}>+</span>
                                            Открыть новый счет
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Accounts;