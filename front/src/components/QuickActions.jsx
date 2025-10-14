import React from 'react';
import styles from '../styles/accounts.module.css';

const QuickActions = ({ onCreateAccount }) => {
    return (
        <section className={styles.actionsCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>⚡</span>
                    Быстрые действия
                </h2>
            </div>
            <div className={styles.actionsList}>
                <button className={styles.actionButton} onClick={onCreateAccount}>
                    <span className={styles.actionIcon}>➕</span>
                    <span className={styles.actionText}>Создать новый счет</span>
                </button>
                <button className={styles.actionButton}>
                    <span className={styles.actionIcon}>💸</span>
                    <span className={styles.actionText}>Перевод между счетами</span>
                </button>
                <button className={styles.actionButton}>
                    <span className={styles.actionIcon}>🔍</span>
                    <span className={styles.actionText}>История операций</span>
                </button>
            </div>
        </section>
    );
};

export default QuickActions;