import React from 'react';
import styles from '../styles/accounts.module.css';

const TransferModal = ({ isOpen, card, amount, toCardNumber, onAmountChange, onToCardNumberChange, onClose, onExecute }) => {
    if (!isOpen || !card) return null;

    const formatCardNumber = (number) => {
        return '•••• •••• •••• ' + number.slice(-4);
    };

    const formatInputCardNumber = (value) => {
        // Форматирование номера карты при вводе: 0000 0000 0000 0000
        const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
        const matches = cleaned.match(/\d{1,16}/g);
        if (matches) {
            return matches.join(' ').substring(0, 19);
        }
        return '';
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatInputCardNumber(e.target.value);
        onToCardNumberChange(formatted);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>🔁</span>
                        Перевод между картами
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>С карты</label>
                        <div className={styles.selectedCard}>
                            {formatCardNumber(card.card_number)}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>На карту</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={toCardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Сумма перевода ₽</label>
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
                        Перевести
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferModal;