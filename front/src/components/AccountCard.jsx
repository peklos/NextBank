import React from 'react';
import styles from '../styles/accounts.module.css';

const AccountCard = ({ account, index, isSelected, onSelect, onShowCards, onDelete, cards }) => {
    const formatAccountNumber = (number) => {
        return number.slice(0, 4) + ' •••• •••• ' + number.slice(-4);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getAccountInfo = (account, index) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        const icons = ['💳', '💰', '🏦', '💎', '📈', '💵'];

        return {
            icon: icons[index % icons.length],
            color: colors[index % colors.length],
        };
    };

    const accountCards = cards.filter(card => card.account_id === account.id);
    const hasCards = accountCards.length > 0;
    const accountInfo = getAccountInfo(account, index);

    return (
        <div
            className={`${styles.accountCard} ${isSelected ? styles.accountCardSelected : ''}`}
            onClick={() => onSelect(account.id)}
        >
            <div className={styles.accountHeader}>
                <div className={styles.accountIcon} style={{ backgroundColor: accountInfo.color }}>
                    <span>{accountInfo.icon}</span>
                </div>
                <div className={styles.accountInfo}>
                    <h3 className={styles.accountName}>Счет {account.id}</h3>
                    <span className={styles.accountNumber}>
                        {formatAccountNumber(account.account_number)}
                    </span>
                </div>
                <div className={styles.accountStatus}>
                    <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                        Активен
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
                    <span className={styles.detailLabel}>Привязанные карты:</span>
                    <span className={styles.detailValue}>
                        {hasCards ? `${accountCards.length} карт(ы)` : 'Нет карт'}
                    </span>
                </div>
            </div>

            <div className={styles.accountFooter}>
                <div className={styles.accountActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={(e) => onShowCards(account, e)}
                    >
                        {hasCards ? '💳 Карты счета' : '➕ Добавить карту'}
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.dangerBtn}`}
                        onClick={(e) => onDelete(account, e)}
                    >
                        🗑️ Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;