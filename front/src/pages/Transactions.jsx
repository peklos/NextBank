import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/transactions.module.css';
import { getMyTransactions, getMyTransactionsStats } from '../api/transactions';
import { setTransactions, setTransactionsStats } from '../features/transactions/transactionsSlice';

const Transactions = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions.list || []);
    const stats = useSelector(state => state.transactions.stats);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    // Загрузка транзакций и статистики
    useEffect(() => {
        const loadData = async () => {
            const transRes = await getMyTransactions({ limit: 100 });
            if (transRes.data) {
                dispatch(setTransactions(transRes.data));
            }

            const statsRes = await getMyTransactionsStats();
            if (statsRes.data) {
                dispatch(setTransactionsStats(statsRes.data));
            }
        };
        loadData();
    }, [dispatch]);

    // Фильтрация транзакций
    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === 'all' || t.transaction_type === filter;
        const matchesSearch = searchQuery === '' ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.amount.toString().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Получение иконки по типу транзакции
    const getTransactionIcon = (type) => {
        const icons = {
            deposit: '💰',
            withdraw: '💸',
            transfer: '🔁',
            loan_payment: '💳'
        };
        return icons[type] || '📝';
    };

    // Получение цвета по типу транзакции
    const getTransactionColor = (type) => {
        const colors = {
            deposit: '#10b981',
            withdraw: '#ef4444',
            transfer: '#3b82f6',
            loan_payment: '#f59e0b'
        };
        return colors[type] || '#94a3b8';
    };

    // Получение названия типа
    const getTransactionTypeName = (type) => {
        const names = {
            deposit: 'Пополнение',
            withdraw: 'Снятие',
            transfer: 'Перевод',
            loan_payment: 'Оплата кредита'
        };
        return names[type] || type;
    };

    return (
        <div className={styles.transactionsContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            {/* Уведомление */}
            {notification.show && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

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
                                Отслеживайте все ваши финансовые операции
                            </p>
                        </div>
                        {stats && (
                            <div className={styles.headerStats}>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Всего операций</span>
                                    <span className={styles.statValue}>{stats.total_transactions}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Пополнено</span>
                                    <span className={styles.statValue}>
                                        {stats.total_deposits.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Снято</span>
                                    <span className={styles.statValue}>
                                        {stats.total_withdrawals.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.transactionsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Фильтры */}
                        <div className={styles.leftColumn}>
                            <div className={styles.filtersCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🔍</span>
                                        Фильтры
                                    </h2>
                                </div>

                                <div className={styles.filtersList}>
                                    <button
                                        className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
                                        onClick={() => setFilter('all')}
                                    >
                                        <span className={styles.filterIcon}>📋</span>
                                        <span className={styles.filterText}>Все операции</span>
                                        <span className={styles.filterCount}>{transactions.length}</span>
                                    </button>
                                    <button
                                        className={`${styles.filterButton} ${filter === 'deposit' ? styles.filterActive : ''}`}
                                        onClick={() => setFilter('deposit')}
                                    >
                                        <span className={styles.filterIcon}>💰</span>
                                        <span className={styles.filterText}>Пополнения</span>
                                        <span className={styles.filterCount}>
                                            {transactions.filter(t => t.transaction_type === 'deposit').length}
                                        </span>
                                    </button>
                                    <button
                                        className={`${styles.filterButton} ${filter === 'withdraw' ? styles.filterActive : ''}`}
                                        onClick={() => setFilter('withdraw')}
                                    >
                                        <span className={styles.filterIcon}>💸</span>
                                        <span className={styles.filterText}>Снятия</span>
                                        <span className={styles.filterCount}>
                                            {transactions.filter(t => t.transaction_type === 'withdraw').length}
                                        </span>
                                    </button>
                                    <button
                                        className={`${styles.filterButton} ${filter === 'transfer' ? styles.filterActive : ''}`}
                                        onClick={() => setFilter('transfer')}
                                    >
                                        <span className={styles.filterIcon}>🔁</span>
                                        <span className={styles.filterText}>Переводы</span>
                                        <span className={styles.filterCount}>
                                            {transactions.filter(t => t.transaction_type === 'transfer').length}
                                        </span>
                                    </button>
                                    <button
                                        className={`${styles.filterButton} ${filter === 'loan_payment' ? styles.filterActive : ''}`}
                                        onClick={() => setFilter('loan_payment')}
                                    >
                                        <span className={styles.filterIcon}>💳</span>
                                        <span className={styles.filterText}>Платежи по кредитам</span>
                                        <span className={styles.filterCount}>
                                            {transactions.filter(t => t.transaction_type === 'loan_payment').length}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Правая колонка - Список транзакций */}
                        <div className={styles.rightColumn}>
                            <div className={styles.transactionsHeader}>
                                <h2 className={styles.sectionTitle}>
                                    {filter === 'all' ? 'Все транзакции' : getTransactionTypeName(filter)}
                                    <span className={styles.transactionsCount}>({filteredTransactions.length})</span>
                                </h2>
                                <div className={styles.searchBox}>
                                    <input
                                        type="text"
                                        placeholder="Поиск по описанию или сумме..."
                                        className={styles.searchInput}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <span className={styles.searchIcon}>🔍</span>
                                </div>
                            </div>

                            {filteredTransactions.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>📊</div>
                                    <h3 className={styles.emptyTitle}>Транзакций не найдено</h3>
                                    <p className={styles.emptyDescription}>
                                        {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Пока нет транзакций для отображения'}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.transactionsList}>
                                    {filteredTransactions.map((transaction) => (
                                        <div key={transaction.id} className={styles.transactionCard}>
                                            <div
                                                className={styles.transactionIcon}
                                                style={{ backgroundColor: getTransactionColor(transaction.transaction_type) + '20' }}
                                            >
                                                <span style={{ color: getTransactionColor(transaction.transaction_type) }}>
                                                    {getTransactionIcon(transaction.transaction_type)}
                                                </span>
                                            </div>

                                            <div className={styles.transactionInfo}>
                                                <h3 className={styles.transactionTitle}>
                                                    {transaction.description || getTransactionTypeName(transaction.transaction_type)}
                                                </h3>
                                                <span className={styles.transactionDate}>
                                                    {formatDate(transaction.created_at)}
                                                </span>
                                            </div>

                                            <div className={styles.transactionAmount}>
                                                <span
                                                    className={styles.amount}
                                                    style={{ color: getTransactionColor(transaction.transaction_type) }}
                                                >
                                                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                                                    {transaction.amount.toLocaleString('ru-RU')} ₽
                                                </span>
                                                <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
                                                    {transaction.status === 'completed' ? 'Выполнено' : transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Transactions;