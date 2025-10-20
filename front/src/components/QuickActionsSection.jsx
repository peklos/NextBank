// src/components/QuickActionsSection.jsx
import { useState } from 'react';
import styles from '../styles/profile.module.css';

const QuickActionsSection = ({
    onOpenPersonalInfo,
    onChangePassword,
    onChangeEmail,
    onChangePhone
}) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const quickActions = [
        {
            icon: '🔐',
            text: 'Сменить пароль',
            action: onChangePassword
        },
        {
            icon: '📧',
            text: 'Изменить email',
            action: onChangeEmail
        },
        {
            icon: '📱',
            text: 'Сменить телефон',
            action: onChangePhone
        },
        {
            icon: notificationsEnabled ? '🔔' : '🔕',
            text: notificationsEnabled ? 'Уведомления' : 'Без звука',
            action: () => setNotificationsEnabled(!notificationsEnabled)
        },
        {
            icon: '📊',
            text: 'История операций'
        },
        {
            icon: '📄',
            text: 'Персональная информация',
            action: onOpenPersonalInfo
        },
    ];

    return (
        <section className={styles.actionsCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>⚡</span>
                    Быстрые действия
                </h2>
            </div>
            <div className={styles.actionsGrid}>
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        className={styles.actionButton}
                        onClick={action.action}
                    >
                        <span className={styles.actionIcon}>{action.icon}</span>
                        <span className={styles.actionText}>{action.text}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActionsSection;