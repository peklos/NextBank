import React from 'react';
import styles from '../styles/accounts.module.css';

const AccountStats = ({ accounts, cards }) => {
    const totalStats = {
        totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString('ru-RU') + ' ₽',
        totalAccounts: accounts.length,
        totalCards: cards.length,
    };

    return (
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
                <span className={styles.statLabel}>Всего карт</span>
                <span className={styles.statValue}>{totalStats.totalCards}</span>
            </div>
        </div>
    );
};

export default AccountStats;