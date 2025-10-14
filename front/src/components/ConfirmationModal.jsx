import React from 'react';
import styles from '../styles/accounts.module.css';

const ConfirmationModal = ({ type, isOpen, account, accounts, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const getAccountInfo = (account, accounts) => {
        if (!account || !accounts) return { color: '#3b82f6', icon: '💳' };
        
        const index = accounts.findIndex(acc => acc.id === account.id);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        const icons = ['💳', '💰', '🏦', '💎', '📈', '💵'];

        return {
            icon: icons[index % icons.length],
            color: colors[index % colors.length],
        };
    };

    const formatAccountNumber = (number) => {
        if (!number) return '';
        return number.slice(0, 4) + ' •••• •••• ' + number.slice(-4);
    };

    const modalConfigs = {
        createAccount: {
            icon: '🏦',
            title: 'Создание нового счета',
            confirmIcon: '❓',
            confirmTitle: 'Вы уверены, что хотите завести новый счет?',
            confirmDescription: 'После подтверждения будет создана заявка на открытие нового банковского счета. Обычно это занимает несколько минут.',
            showFooter: true,
            confirmText: 'Да, создать счет'
        },
        createSuccess: {
            icon: '✅',
            title: 'Заявка оформлена',
            confirmIcon: '🎉',
            confirmTitle: 'Ваша заявка на создание нового счета была оформлена',
            confirmDescription: 'Ожидайте подтверждения. Обычно это занимает не более 5 минут. Вы получите уведомление, когда счет будет готов к использованию.',
            showFooter: false,
            confirmText: 'Понятно'
        },
        deleteAccount: {
            icon: '🗑️',
            title: 'Удаление счета',
            confirmIcon: '⚠️',
            confirmTitle: 'Вы точно уверены, что хотите удалить счет?',
            confirmDescription: 'Вместе с ним удалятся и обнулятся карты, которые были привязаны к этому счету. Это действие нельзя будет отменить.',
            showFooter: true,
            confirmText: 'Да, удалить счет',
            isDanger: true
        },
        deleteSuccess: {
            icon: '✅',
            title: 'Заявка на удаление отправлена',
            confirmIcon: '📨',
            confirmTitle: 'Ваша заявка на удаление счета была отправлена',
            confirmDescription: 'Ожидайте подтверждения. Обычно это занимает не более 5 минут. Вы получите уведомление, когда счет будет удален.',
            showFooter: false,
            confirmText: 'Понятно'
        }
    };

    const config = modalConfigs[type] || modalConfigs.createAccount;
    const accountInfo = getAccountInfo(account, accounts);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>{config.icon}</span>
                        {config.title}
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.confirmContent}>
                        <div 
                            className={styles.confirmIcon} 
                            style={type === 'deleteAccount' ? { color: '#ef4444' } : {}}
                        >
                            {config.confirmIcon}
                        </div>
                        <h3 className={styles.confirmTitle}>
                            {config.confirmTitle}
                        </h3>
                        <p className={styles.confirmDescription}>
                            {config.confirmDescription}
                        </p>

                        {type === 'deleteAccount' && account && (
                            <div className={styles.accountPreview}>
                                <div 
                                    className={styles.accountPreviewIcon} 
                                    style={{ backgroundColor: accountInfo.color }}
                                >
                                    <span>{accountInfo.icon}</span>
                                </div>
                                <div className={styles.accountPreviewInfo}>
                                    <span className={styles.accountPreviewName}>Счет {account.id}</span>
                                    <span className={styles.accountPreviewNumber}>
                                        {formatAccountNumber(account.account_number)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {config.showFooter && (
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={onClose}>
                                Отмена
                            </button>
                            <button 
                                className={`${styles.saveButton} ${config.isDanger ? styles.dangerButton : ''}`}
                                onClick={onConfirm}
                            >
                                {config.confirmText}
                            </button>
                        </div>
                    )}

                    {!config.showFooter && (
                        <div className={styles.modalFooter}>
                            <button className={styles.saveButton} onClick={onClose}>
                                {config.confirmText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;