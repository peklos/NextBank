import React, { useState } from 'react';
import styles from '../styles/transfers.module.css';

const Transfers = () => {
    const [filter, setFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('30days');

    // Моковые данные транзакций
    const transactions = [
        {
            id: 1,
            type: 'outcome',
            category: 'shopping',
            description: 'Супермаркет "Пятерочка"',
            amount: '-3 450 ₽',
            date: 'Сегодня, 18:45',
            time: '18:45',
            icon: '🛒',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 2,
            type: 'income',
            category: 'transfer',
            description: 'Перевод от А.С. Петров',
            amount: '+25 000 ₽',
            date: 'Сегодня, 14:30',
            time: '14:30',
            icon: '💸',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 3,
            type: 'outcome',
            category: 'subscription',
            description: 'YouTube Premium',
            amount: '-459 ₽',
            date: 'Вчера, 09:00',
            time: '09:00',
            icon: '🎬',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 4,
            type: 'outcome',
            category: 'utilities',
            description: 'Оплата интернета "Ростелеком"',
            amount: '-1 200 ₽',
            date: '15 дек, 12:15',
            time: '12:15',
            icon: '📡',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 5,
            type: 'outcome',
            category: 'transport',
            description: 'Яндекс.Такси',
            amount: '-680 ₽',
            date: '14 дек, 20:30',
            time: '20:30',
            icon: '🚕',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 6,
            type: 'income',
            category: 'salary',
            description: 'Зарплата',
            amount: '+85 000 ₽',
            date: '10 дек, 08:00',
            time: '08:00',
            icon: '💰',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 7,
            type: 'outcome',
            category: 'entertainment',
            description: 'Кинотеатр "Формула Кино"',
            amount: '-1 850 ₽',
            date: '8 дек, 21:15',
            time: '21:15',
            icon: '🎭',
            status: 'completed',
            account: 'Основной ••4321'
        },
        {
            id: 8,
            type: 'outcome',
            category: 'food',
            description: 'Ресторан "Токио-City"',
            amount: '-4 200 ₽',
            date: '5 дек, 19:45',
            time: '19:45',
            icon: '🍣',
            status: 'completed',
            account: 'Основной ••4321'
        }
    ];

    const stats = {
        totalIncome: '110 000 ₽',
        totalExpenses: '11 839 ₽',
        transactionsCount: transactions.length,
        mostSpentCategory: 'Еда и продукты'
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    return (
        <div className={styles.transactionsContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.transactionsContent}>
                {/* Хедер страницы */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleIcon}>📊</span>
                                История транзакций
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Все ваши финансовые операции в одном месте
                            </p>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Всего операций</span>
                                <span className={styles.statValue}>{stats.transactionsCount}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Пополнения</span>
                                <span className={`${styles.statValue} ${styles.income}`}>{stats.totalIncome}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Расходы</span>
                                <span className={`${styles.statValue} ${styles.outcome}`}>{stats.totalExpenses}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.transactionsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Фильтры и статистика */}
                        <div className={styles.leftColumn}>
                            {/* Фильтры */}
                            <section className={styles.filtersCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🔍</span>
                                        Фильтры
                                    </h2>
                                </div>
                                <div className={styles.filtersGroup}>
                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Тип операции</h3>
                                        <div className={styles.filterButtons}>
                                            <button
                                                className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setFilter('all')}
                                            >
                                                Все
                                            </button>
                                            <button
                                                className={`${styles.filterBtn} ${filter === 'income' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setFilter('income')}
                                            >
                                                Доходы
                                            </button>
                                            <button
                                                className={`${styles.filterBtn} ${filter === 'outcome' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setFilter('outcome')}
                                            >
                                                Расходы
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Период</h3>
                                        <div className={styles.filterButtons}>
                                            <button
                                                className={`${styles.filterBtn} ${timeRange === '7days' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setTimeRange('7days')}
                                            >
                                                7 дней
                                            </button>
                                            <button
                                                className={`${styles.filterBtn} ${timeRange === '30days' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setTimeRange('30days')}
                                            >
                                                30 дней
                                            </button>
                                            <button
                                                className={`${styles.filterBtn} ${timeRange === '90days' ? styles.filterBtnActive : ''}`}
                                                onClick={() => setTimeRange('90days')}
                                            >
                                                90 дней
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.exportButton}>
                                    <span className={styles.exportIcon}>📥</span>
                                    Экспорт в Excel
                                </button>
                            </section>

                            {/* Статистика */}
                            <section className={styles.statsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>📈</span>
                                        Статистика
                                    </h2>
                                </div>
                                <div className={styles.statsList}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>💰</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Самая частая категория</span>
                                            <span className={styles.statValue}>{stats.mostSpentCategory}</span>
                                        </div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>📅</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Операций в день</span>
                                            <span className={styles.statValue}>2.3</span>
                                        </div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statIcon}>⚡</div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statName}>Средний чек</span>
                                            <span className={styles.statValue}>2 450 ₽</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Правая колонка - Список транзакций */}
                        <div className={styles.rightColumn}>
                            {/* Список транзакций */}
                            <section className={styles.transactionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🕒</span>
                                        Последние операции
                                        <span className={styles.transactionsCount}>({filteredTransactions.length})</span>
                                    </h2>
                                    <div className={styles.searchBox}>
                                        <input
                                            type="text"
                                            placeholder="Поиск по описанию..."
                                            className={styles.searchInput}
                                        />
                                        <span className={styles.searchIcon}>🔍</span>
                                    </div>
                                </div>

                                <div className={styles.transactionsList}>
                                    {filteredTransactions.map((transaction) => (
                                        <div key={transaction.id} className={styles.transactionItem}>
                                            <div className={styles.transactionIcon}>
                                                <span>{transaction.icon}</span>
                                            </div>
                                            <div className={styles.transactionInfo}>
                                                <div className={styles.transactionMain}>
                                                    <span className={styles.transactionDescription}>
                                                        {transaction.description}
                                                    </span>
                                                    <span className={styles.transactionAccount}>
                                                        {transaction.account}
                                                    </span>
                                                </div>
                                                <div className={styles.transactionMeta}>
                                                    <span className={styles.transactionDate}>
                                                        {transaction.date}
                                                    </span>
                                                    <span className={styles.transactionStatus}>
                                                        {transaction.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.transactionAmount}>
                                                <span className={`${styles.amount} ${transaction.type === 'income' ? styles.amountIncome : styles.amountOutcome
                                                    }`}>
                                                    {transaction.amount}
                                                </span>
                                            </div>
                                            <button className={styles.detailsButton}>
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.transactionsFooter}>
                                    <button className={styles.loadMoreButton}>
                                        Загрузить еще
                                    </button>
                                    <div className={styles.paginationInfo}>
                                        Показано {filteredTransactions.length} из {transactions.length} операций
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Transfers;