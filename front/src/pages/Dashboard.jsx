import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
    const [quickAmount, setQuickAmount] = useState('');
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);

    // Получаем данные из Redux
    const user = useSelector(state => state.auth);
    const accounts = useSelector(state => state.accounts.list || []);
    const cards = useSelector(state => state.cards.cards || []);
    const loans = useSelector(state => state.loans.list || []);
    const transactions = useSelector(state => state.transactions.list || []);

    const cardsWithAccounts = cards.map(card => ({
        ...card,
        account: accounts.find(acc => acc.id === card.account_id)
    }));


    // Вычисляем статистику
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const activeCards = cardsWithAccounts.filter(card => card.is_active);
    const activeLoans = loans.filter(loan => !loan.is_paid);

    // Группируем транзакции по месяцам для расчета доходов/расходов
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const transDate = new Date(t.created_at);
        return transDate.getMonth() === currentMonth &&
            transDate.getFullYear() === currentYear &&
            t.status === 'completed';
    });

    const monthlyIncome = monthlyTransactions
        .filter(t => ['deposit', 'transfer'].includes(t.transaction_type) && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
        .filter(t => ['withdraw', 'loan_payment'].includes(t.transaction_type))
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlySavings = monthlyIncome - monthlyExpenses;

    // Последние 4 транзакции
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4);

    // Форматирование суммы
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Форматирование времени
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
            });
        }
    };

    // Получение иконки для типа транзакции
    const getTransactionIcon = (type) => {
        const icons = {
            deposit: '💰',
            withdraw: '💸',
            transfer: '🔄',
            loan_payment: '🏦'
        };
        return icons[type] || '💳';
    };

    // Получение названия транзакции
    const getTransactionName = (transaction) => {
        const names = {
            deposit: 'Пополнение счета',
            withdraw: 'Снятие средств',
            transfer: 'Перевод',
            loan_payment: 'Погашение кредита'
        };
        return transaction.description || names[transaction.transaction_type] || 'Операция';
    };

    // Быстрые действия
    const quickActions = [
        { id: 1, icon: '🔄', label: 'Перевод', description: 'Между картами', link: '/accounts' },
        { id: 2, icon: '💳', label: 'Карты', description: 'Управление картами', link: '/accounts' },
        { id: 3, icon: '💰', label: 'Кредиты', description: 'Мои кредиты', link: '/loans' },
        { id: 4, icon: '📄', label: 'История', description: 'Все операции', link: '/transfers' }
    ];

    const quickAmounts = ['500', '1000', '2000', '5000'];

    // Статистика
    const stats = [
        {
            label: 'Доходы за месяц',
            value: `${formatAmount(monthlyIncome)} ₽`,
            change: monthlyIncome > 0 ? '+' : '',
            trend: 'up'
        },
        {
            label: 'Расходы за месяц',
            value: `${formatAmount(monthlyExpenses)} ₽`,
            change: monthlyExpenses > 0 ? '+' : '',
            trend: 'up'
        },
        {
            label: 'Экономия',
            value: `${formatAmount(monthlySavings)} ₽`,
            change: monthlySavings > 0 ? '+' : '',
            trend: monthlySavings > 0 ? 'up' : 'down'
        },
        {
            label: 'Активных карт',
            value: activeCards.length.toString(),
            change: '',
            trend: 'up'
        }
    ];

    // Получение цвета карты
    const getCardColor = (index) => {
        const colors = [
            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            'linear-gradient(135deg, #10b981, #059669)',
            'linear-gradient(135deg, #f59e0b, #d97706)',
            'linear-gradient(135deg, #8b5cf6, #6366f1)'
        ];
        return colors[index % colors.length];
    };

    // Форматирование номера карты
    const formatCardNumber = (number) => {
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    // Форматирование даты карты
    const formatCardDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            month: '2-digit',
            year: '2-digit'
        });
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.dashboardContent}>
                {/* Хедер */}
                <header className={styles.dashboardHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.welcomeSection}>
                            <h1 className={styles.welcomeTitle}>
                                Добро пожаловать, <span className={styles.userName}>{user.first_name}</span>!
                            </h1>
                            <p className={styles.welcomeSubtitle}>
                                Вот обзор ваших финансов на сегодня
                            </p>
                        </div>
                        <div className={styles.dateSection}>
                            <div className={styles.currentDate}>
                                {new Date().toLocaleDateString('ru-RU', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className={styles.notificationBell}>🔔</div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.dashboardMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Баланс и карты */}
                        <div className={styles.leftColumn}>
                            {/* Общий баланс */}
                            <section className={styles.balanceCard}>
                                <div className={styles.balanceHeader}>
                                    <h2 className={styles.balanceTitle}>Общий баланс</h2>
                                    <div className={styles.balanceTrend}>
                                        {accounts.length} {accounts.length === 1 ? 'счет' : 'счетов'}
                                    </div>
                                </div>
                                <div className={styles.balanceAmount}>
                                    {formatAmount(totalBalance)} ₽
                                </div>
                                <div className={styles.balanceStats}>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Доходы</span>
                                        <span className={styles.statValue}>{formatAmount(monthlyIncome)} ₽</span>
                                    </div>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Расходы</span>
                                        <span className={styles.statValue}>{formatAmount(monthlyExpenses)} ₽</span>
                                    </div>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Экономия</span>
                                        <span className={styles.statValue}>{formatAmount(monthlySavings)} ₽</span>
                                    </div>
                                </div>
                            </section>

                            {/* Карты */}
                            <section className={styles.cardsSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Мои карты</h2>
                                    <NavLink to="/accounts" className={styles.addCardButton}>
                                        + Управление
                                    </NavLink>
                                </div>
                                <div className={styles.cardsContainer}>
                                    {activeCards.length === 0 ? (
                                        <div className={styles.emptyCards}>
                                            <p>У вас пока нет активных карт</p>
                                            <NavLink to="/accounts" className={styles.addCardButton}>
                                                Добавить карту
                                            </NavLink>
                                        </div>
                                    ) : (
                                        activeCards.slice(0, 3).map((card, index) => (
                                            <div
                                                key={card.id}
                                                className={`${styles.cardItem} ${index === selectedCardIndex ? styles.cardActive : ''}`}
                                                onClick={() => setSelectedCardIndex(index)}
                                            >
                                                <div className={styles.cardBackground} style={{ background: getCardColor(index) }}>
                                                    <div className={styles.cardContent}>
                                                        <div className={styles.cardHeader}>
                                                            <div className={styles.cardType}>
                                                                {card.card_type}
                                                            </div>
                                                            <div className={styles.cardChip}>◘◘◘◘</div>
                                                        </div>
                                                        <div className={styles.cardNumber}>
                                                            •••• •••• •••• {card.card_number.slice(-4)}
                                                        </div>
                                                        <div className={styles.cardFooter}>
                                                            <div className={styles.cardHolder}>
                                                                <div className={styles.holderLabel}>Владелец</div>
                                                                <div className={styles.holderName}>
                                                                    {user.first_name} {user.last_name}
                                                                </div>
                                                            </div>
                                                            <div className={styles.cardExpiry}>
                                                                <div className={styles.expiryLabel}>Срок действия</div>
                                                                <div className={styles.expiryDate}>
                                                                    {formatCardDate(card.expiration_date)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.cardBalance}>
                                                    Баланс: {formatAmount(card.account ? card.account.balance : 0)} ₽
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Центральная колонка - Быстрые действия и статистика */}
                        <div className={styles.centerColumn}>
                            {/* Быстрые действия */}
                            <section className={styles.quickActions}>
                                <h2 className={styles.sectionTitle}>Быстрые действия</h2>
                                <div className={styles.actionsGrid}>
                                    {quickActions.map((action) => (
                                        <NavLink
                                            key={action.id}
                                            to={action.link}
                                            className={styles.actionButton}
                                        >
                                            <div className={styles.actionIcon}>{action.icon}</div>
                                            <div className={styles.actionInfo}>
                                                <div className={styles.actionLabel}>{action.label}</div>
                                                <div className={styles.actionDescription}>{action.description}</div>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            </section>

                            {/* Статистика кредитов */}
                            {activeLoans.length > 0 && (
                                <section className={styles.quickTransfer}>
                                    <h2 className={styles.sectionTitle}>Активные кредиты</h2>
                                    <div className={styles.transferCard}>
                                        {activeLoans.slice(0, 2).map(loan => {
                                            const totalAmount = loan.amount * (1 + loan.interest_rate / 100);
                                            const remaining = totalAmount - (loan.paid_amount || 0);
                                            return (
                                                <div key={loan.id} className={styles.loanItem}>
                                                    <div className={styles.loanInfo}>
                                                        <div className={styles.loanName}>
                                                            Кредит {formatAmount(loan.amount)} ₽
                                                        </div>
                                                        <div className={styles.loanStatus}>
                                                            Осталось: {formatAmount(remaining)} ₽
                                                        </div>
                                                    </div>
                                                    <NavLink to="/loans" className={styles.loanAction}>
                                                        →
                                                    </NavLink>
                                                </div>
                                            );
                                        })}
                                        <NavLink to="/loans" className={styles.transferButton}>
                                            Все кредиты
                                        </NavLink>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Правая колонка - Статистика и транзакции */}
                        <div className={styles.rightColumn}>
                            {/* Статистика */}
                            <section className={styles.statsSection}>
                                <h2 className={styles.sectionTitle}>Финансовая статистика</h2>
                                <div className={styles.statsGrid}>
                                    {stats.map((stat, index) => (
                                        <div key={index} className={styles.statCard}>
                                            <div className={styles.statHeader}>
                                                <span className={styles.statLabel}>{stat.label}</span>
                                                {stat.change && (
                                                    <span className={`${styles.statChange} ${styles[stat.trend]}`}>
                                                        {stat.change}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.statValue}>{stat.value}</div>
                                            <div className={styles.statChart}>
                                                <div
                                                    className={styles.chartBar}
                                                    style={{
                                                        height: `${60 + index * 10}%`,
                                                        background: stat.trend === 'up'
                                                            ? 'linear-gradient(90deg, #10b981, #059669)'
                                                            : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Последние транзакции */}
                            <section className={styles.transactionsSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Последние операции</h2>
                                    <NavLink to="/transfers" className={styles.viewAllButton}>
                                        Все операции →
                                    </NavLink>
                                </div>
                                <div className={styles.transactionsList}>
                                    {recentTransactions.length === 0 ? (
                                        <div className={styles.emptyTransactions}>
                                            <p>Пока нет транзакций</p>
                                        </div>
                                    ) : (
                                        recentTransactions.map((transaction) => (
                                            <div key={transaction.id} className={styles.transactionItem}>
                                                <div className={styles.transactionIcon}>
                                                    <span>{getTransactionIcon(transaction.transaction_type)}</span>
                                                </div>
                                                <div className={styles.transactionInfo}>
                                                    <div className={styles.transactionName}>
                                                        {getTransactionName(transaction)}
                                                    </div>
                                                    <div className={styles.transactionTime}>
                                                        {formatDate(transaction.created_at)}, {formatTime(transaction.created_at)}
                                                    </div>
                                                </div>
                                                <div className={styles.transactionAmount}>
                                                    <span className={`${styles.amount} ${['deposit'].includes(transaction.transaction_type)
                                                        ? styles.income
                                                        : styles.outcome
                                                        }`}>
                                                        {['deposit'].includes(transaction.transaction_type) ? '+' : '-'}
                                                        {formatAmount(transaction.amount)} ₽
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Ближайшие события */}
                            <section className={styles.paymentsSection}>
                                <h2 className={styles.sectionTitle}>Быстрая информация</h2>
                                <div className={styles.paymentsList}>
                                    <div className={styles.paymentItem}>
                                        <div className={styles.paymentIcon}>💳</div>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentName}>Счетов</div>
                                            <div className={styles.paymentDate}>{accounts.length}</div>
                                        </div>
                                        <NavLink to="/accounts" className={styles.paymentAction}>→</NavLink>
                                    </div>
                                    <div className={styles.paymentItem}>
                                        <div className={styles.paymentIcon}>🏦</div>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentName}>Кредитов</div>
                                            <div className={styles.paymentDate}>{activeLoans.length}</div>
                                        </div>
                                        <NavLink to="/loans" className={styles.paymentAction}>→</NavLink>
                                    </div>
                                    <div className={styles.paymentItem}>
                                        <div className={styles.paymentIcon}>📊</div>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentName}>Транзакций</div>
                                            <div className={styles.paymentDate}>{transactions.length}</div>
                                        </div>
                                        <NavLink to="/transfers" className={styles.paymentAction}>→</NavLink>
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

export default Dashboard;