import React, { useState } from 'react';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
    const [quickAmount, setQuickAmount] = useState('');
    const [activeCard, setActiveCard] = useState(0);

    // Моковые данные
    const userData = {
        name: 'Александр',
        totalBalance: '2 421 350 ₽',
        monthlyIncome: '185 000 ₽',
        monthlyExpenses: '134 560 ₽',
        savings: '50 440 ₽'
    };

    const cards = [
        {
            id: 1,
            number: '5536 9142 6743 4321',
            holder: 'ALEXANDER PETROV',
            expiry: '12/25',
            balance: '245 670 ₽',
            type: 'visa',
            color: '#3b82f6'
        },
        {
            id: 2,
            number: '4478 2345 6789 7821',
            holder: 'ALEXANDER PETROV',
            expiry: '09/26',
            balance: '1 250 340 ₽',
            type: 'mastercard',
            color: '#10b981'
        }
    ];

    const quickActions = [
        { id: 1, icon: '🔄', label: 'Перевод', description: 'Между счетами' },
        { id: 2, icon: '💳', label: 'Платеж', description: 'Оплатить услуги' },
        { id: 3, icon: '📱', label: 'QR-платеж', description: 'Быстрая оплата' },
        { id: 4, icon: '📄', label: 'Выписка', description: 'История операций' }
    ];

    const recentTransactions = [
        {
            id: 1,
            name: 'Супермаркет "Пятерочка"',
            amount: '-3 450 ₽',
            time: '18:45',
            icon: '🛒',
            type: 'outcome'
        },
        {
            id: 2,
            name: 'Перевод от А.С. Петров',
            amount: '+25 000 ₽',
            time: '14:30',
            icon: '💸',
            type: 'income'
        },
        {
            id: 3,
            name: 'YouTube Premium',
            amount: '-459 ₽',
            time: '09:00',
            icon: '🎬',
            type: 'outcome'
        },
        {
            id: 4,
            name: 'Зарплата',
            amount: '+85 000 ₽',
            time: '08:00',
            icon: '💰',
            type: 'income'
        }
    ];

    const stats = [
        { label: 'Доходы за месяц', value: '185 000 ₽', change: '+12%', trend: 'up' },
        { label: 'Расходы за месяц', value: '134 560 ₽', change: '+5%', trend: 'up' },
        { label: 'Экономия', value: '50 440 ₽', change: '+8%', trend: 'up' },
        { label: 'Кэшбэк', value: '3 245 ₽', change: '+15%', trend: 'up' }
    ];

    const quickAmounts = ['500', '1000', '2000', '5000'];

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
                                Добро пожаловать, <span className={styles.userName}>{userData.name}</span>!
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
                                    <div className={styles.balanceTrend}>+5.2% за месяц</div>
                                </div>
                                <div className={styles.balanceAmount}>
                                    {userData.totalBalance}
                                </div>
                                <div className={styles.balanceStats}>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Доходы</span>
                                        <span className={styles.statValue}>{userData.monthlyIncome}</span>
                                    </div>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Расходы</span>
                                        <span className={styles.statValue}>{userData.monthlyExpenses}</span>
                                    </div>
                                    <div className={styles.balanceStat}>
                                        <span className={styles.statLabel}>Экономия</span>
                                        <span className={styles.statValue}>{userData.savings}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Карты */}
                            <section className={styles.cardsSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Мои карты</h2>
                                    <button className={styles.addCardButton}>+ Добавить карту</button>
                                </div>
                                <div className={styles.cardsContainer}>
                                    {cards.map((card, index) => (
                                        <div
                                            key={card.id}
                                            className={`${styles.cardItem} ${index === activeCard ? styles.cardActive : ''}`}
                                            onClick={() => setActiveCard(index)}
                                        >
                                            <div className={styles.cardBackground} style={{ background: card.color }}>
                                                <div className={styles.cardContent}>
                                                    <div className={styles.cardHeader}>
                                                        <div className={styles.cardType}>
                                                            {card.type === 'visa' ? 'VISA' : 'MasterCard'}
                                                        </div>
                                                        <div className={styles.cardChip}>◘◘◘◘</div>
                                                    </div>
                                                    <div className={styles.cardNumber}>
                                                        {card.number}
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <div className={styles.cardHolder}>
                                                            <div className={styles.holderLabel}>Владелец</div>
                                                            <div className={styles.holderName}>{card.holder}</div>
                                                        </div>
                                                        <div className={styles.cardExpiry}>
                                                            <div className={styles.expiryLabel}>Срок действия</div>
                                                            <div className={styles.expiryDate}>{card.expiry}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.cardBalance}>
                                                Баланс: {card.balance}
                                            </div>
                                        </div>
                                    ))}
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
                                        <button key={action.id} className={styles.actionButton}>
                                            <div className={styles.actionIcon}>{action.icon}</div>
                                            <div className={styles.actionInfo}>
                                                <div className={styles.actionLabel}>{action.label}</div>
                                                <div className={styles.actionDescription}>{action.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Быстрый перевод */}
                            <section className={styles.quickTransfer}>
                                <h2 className={styles.sectionTitle}>Быстрый перевод</h2>
                                <div className={styles.transferCard}>
                                    <div className={styles.transferHeader}>
                                        <div className={styles.contactAvatar}>AP</div>
                                        <div className={styles.contactInfo}>
                                            <div className={styles.contactName}>Анна Петрова</div>
                                            <div className={styles.contactBank}>Тинькофф •• 7845</div>
                                        </div>
                                    </div>
                                    <div className={styles.amountSection}>
                                        <label className={styles.amountLabel}>Сумма перевода</label>
                                        <div className={styles.amountInputWrapper}>
                                            <input
                                                type="text"
                                                value={quickAmount}
                                                onChange={(e) => setQuickAmount(e.target.value)}
                                                placeholder="0"
                                                className={styles.amountInput}
                                            />
                                            <span className={styles.currency}>₽</span>
                                        </div>
                                        <div className={styles.quickAmounts}>
                                            {quickAmounts.map((amount) => (
                                                <button
                                                    key={amount}
                                                    className={styles.quickAmountButton}
                                                    onClick={() => setQuickAmount(amount)}
                                                >
                                                    {amount} ₽
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button className={styles.transferButton}>
                                        Перевести деньги
                                    </button>
                                </div>
                            </section>
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
                                                <span className={`${styles.statChange} ${styles[stat.trend]}`}>
                                                    {stat.change}
                                                </span>
                                            </div>
                                            <div className={styles.statValue}>{stat.value}</div>
                                            <div className={styles.statChart}>
                                                <div className={styles.chartBar} style={{ height: `${70 + index * 10}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Последние транзакции */}
                            <section className={styles.transactionsSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Последние операции</h2>
                                    <button className={styles.viewAllButton}>Все операции →</button>
                                </div>
                                <div className={styles.transactionsList}>
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className={styles.transactionItem}>
                                            <div className={styles.transactionIcon}>
                                                <span>{transaction.icon}</span>
                                            </div>
                                            <div className={styles.transactionInfo}>
                                                <div className={styles.transactionName}>
                                                    {transaction.name}
                                                </div>
                                                <div className={styles.transactionTime}>
                                                    {transaction.time}
                                                </div>
                                            </div>
                                            <div className={styles.transactionAmount}>
                                                <span className={`${styles.amount} ${transaction.type === 'income' ? styles.income : styles.outcome}`}>
                                                    {transaction.amount}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Ближайшие платежи */}
                            <section className={styles.paymentsSection}>
                                <h2 className={styles.sectionTitle}>Ближайшие платежи</h2>
                                <div className={styles.paymentsList}>
                                    <div className={styles.paymentItem}>
                                        <div className={styles.paymentIcon}>🏠</div>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentName}>Аренда квартиры</div>
                                            <div className={styles.paymentDate}>Завтра, 10:00</div>
                                        </div>
                                        <div className={styles.paymentAmount}>-45 000 ₽</div>
                                    </div>
                                    <div className={styles.paymentItem}>
                                        <div className={styles.paymentIcon}>📡</div>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentName}>Интернет</div>
                                            <div className={styles.paymentDate}>15 дек</div>
                                        </div>
                                        <div className={styles.paymentAmount}>-1 200 ₽</div>
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