import React from 'react';
import styles from '../styles/admin.module.css';

const OverviewTab = ({ stats }) => {
    if (!stats) return <div className={styles.loadingText}>Статистика загружается...</div>;

    return (
        <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <h3 className={styles.statTitle}>Сотрудники</h3>
                <div className={styles.statValue}>{stats.employees.total_employees}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Активных:</span>
                        <span className={styles.statSuccess}>{stats.employees.active_employees}</span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Неактивных:</span>
                        <span className={styles.statWarning}>{stats.employees.inactive_employees}</span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>👤</div>
                <h3 className={styles.statTitle}>Клиенты</h3>
                <div className={styles.statValue}>{stats.clients.total_clients}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Счетов:</span>
                        <span>{stats.clients.total_accounts}</span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Карт:</span>
                        <span>{stats.clients.total_cards}</span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <h3 className={styles.statTitle}>Финансы</h3>
                <div className={styles.statValue}>
                    {stats.clients.total_balance.toLocaleString("ru-RU")} ₽
                </div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Долг:</span>
                        <span className={styles.statDanger}>
                            {stats.clients.total_debt.toLocaleString("ru-RU")} ₽
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <h3 className={styles.statTitle}>Процессы</h3>
                <div className={styles.statValue}>{stats.processes.total_processes}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>В ожидании:</span>
                        <span className={styles.statWarning}>{stats.processes.pending_processes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;