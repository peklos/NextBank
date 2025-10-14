import React from 'react';
import styles from '../styles/accounts.module.css';

const CardOperationsModal = ({ isOpen, card, operationType, amount, onAmountChange, onClose, onExecute }) => {
    if (!isOpen || !card) return null;

    const getCardColor = (cardType) => {
        return cardType === 'CREDIT'
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : 'linear-gradient(135deg, #10b981, #059669)';
    };

    const formatCardNumber = (number) => {
        return '•••• •••• •••• ' + number.slice(-4);
    };

    const getOperationConfig = (type) => {
        const configs = {
            deposit: {
                icon: '💰',
                title: 'Пополнение карты',
                buttonText: 'Пополнить',
                label: 'Сумма пополнения'
            },
            withdraw: {
                icon: '💸',
                title: 'Снятие наличных',
                buttonText: 'Снять',
                label: 'Сумма снятия'
            }
        };
        return configs[type] || configs.deposit;
    };

    const config = getOperationConfig(operationType);

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
                    <div className={styles.cardPreview}>
                        <div
                            className={styles.previewCard}
                            style={{ background: getCardColor(card.card_type) }}
                        >
                            {formatCardNumber(card.card_number)}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            {config.label} ₽
                        </label>
                        <input
                            type="number"
                            className={styles.formInput}
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            placeholder="Введите сумму"
                            min="1"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Отмена
                    </button>
                    <button className={styles.saveButton} onClick={onExecute}>
                        {config.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardOperationsModal;