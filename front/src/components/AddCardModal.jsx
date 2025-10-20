import React from 'react';
import styles from '../styles/accounts.module.css';

const AddCardModal = ({ isOpen, cardType, user, onCardTypeChange, onClose, onCreateCard }) => {
    if (!isOpen) return null;

    const getCardColor = (cardType) => {
        return cardType === 'CREDIT'
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : 'linear-gradient(135deg, #10b981, #059669)';
    };

    const getCardIcon = (cardType) => {
        return cardType === 'CREDIT' ? '💳' : '💵';
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>💳</span>
                        Выпуск новой карты
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        X
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Тип карты</label>
                        <div className={styles.cardTypeOptions}>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    value="DEBIT"
                                    checked={cardType === 'DEBIT'}
                                    onChange={(e) => onCardTypeChange(e.target.value)}
                                />
                                <span className={styles.radioLabel}>
                                    <span className={styles.radioIcon}>💵</span>
                                    Дебетовая карта
                                </span>
                            </label>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    value="CREDIT"
                                    checked={cardType === 'CREDIT'}
                                    onChange={(e) => onCardTypeChange(e.target.value)}
                                />
                                <span className={styles.radioLabel}>
                                    <span className={styles.radioIcon}>💳</span>
                                    Кредитная карта
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.cardPreview}>
                        <div
                            className={styles.previewCard}
                            style={{ background: getCardColor(cardType) }}
                        >
                            <div className={styles.previewCardHeader}>
                                <span className={styles.previewCardType}>
                                    {cardType === 'CREDIT' ? 'CREDIT' : 'DEBIT'}
                                </span>
                                <span className={styles.previewCardIcon}>
                                    {getCardIcon(cardType)}
                                </span>
                            </div>
                            <div className={styles.previewCardNumber}>
                                •••• •••• •••• ••••
                            </div>
                            <div className={styles.previewCardFooter}>
                                <span className={styles.previewCardHolder}>
                                    {user.name?.toUpperCase() || 'CARDHOLDER'}
                                </span>
                                <span className={styles.previewCardExpiry}>
                                    ММ/ГГ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Отмена
                    </button>
                    <button className={styles.saveButton} onClick={onCreateCard}>
                        Выпустить карту
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;