import React from 'react';
import styles from '../styles/accounts.module.css';
import { deactivateClientCard, deleteClientCard } from '../api/cards';
import { updateCard, removeCard } from '../features/cards/cardSlice';
import { useDispatch } from 'react-redux';

const CardItem = ({ card, user, showCardNumber, onToggleVisibility, onCopyNumber, onCardOperation }) => {
    const dispatch = useDispatch();

    const getCardColor = (cardType) => {
        return cardType === 'CREDIT'
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : 'linear-gradient(135deg, #10b981, #059669)';
    };

    const getCardIcon = (cardType) => {
        return cardType === 'CREDIT' ? '💳' : '💵';
    };

    const formatCardNumber = (number, isVisible) => {
        if (isVisible) {
            return number.replace(/(\d{4})/g, '$1 ').trim();
        }
        return '•••• •••• •••• ' + number.slice(-4);
    };

    const formatCardDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            month: '2-digit',
            year: '2-digit'
        });
    };

    const handleDeactivateCard = async () => {
        const res = await deactivateClientCard(card.id);
        if (res.data && res.data.card) {
            // ✅ Обновляем карту в Redux с новым статусом
            dispatch(updateCard(res.data.card));
            console.log('✅ Карта деактивирована:', res.data.card);
        } else if (res.error) {
            console.error('❌ Ошибка деактивации:', res.error);
        }
    };

    const handleDeleteCard = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить эту карту?')) {
            return;
        }

        const res = await deleteClientCard(card.id);
        if (res.data) {
            // ✅ Удаляем карту из Redux
            dispatch(removeCard(card.id));
            console.log('✅ Карта удалена:', card.id);
        } else if (res.error) {
            console.error('❌ Ошибка удаления:', res.error);
        }
    };

    return (
        <div className={styles.cardItem}>
            <div
                className={styles.cardVisual}
                style={{ background: getCardColor(card.card_type) }}
            >
                <div className={styles.cardHeader}>
                    <span className={styles.cardType}>
                        {card.card_type === 'CREDIT' ? 'CREDIT' : 'DEBIT'}
                    </span>
                    <span className={styles.cardIcon}>
                        {getCardIcon(card.card_type)}
                    </span>
                </div>
                <div className={styles.cardNumberContainer}>
                    <span className={styles.cardNumber}>
                        {formatCardNumber(card.card_number, showCardNumber)}
                    </span>
                    <div className={styles.cardNumberActions}>
                        <button
                            className={styles.eyeButton}
                            onClick={onToggleVisibility}
                            title={showCardNumber ? 'Скрыть номер' : 'Показать номер'}
                        >
                            {showCardNumber ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button
                            className={styles.copyButton}
                            onClick={onCopyNumber}
                            title="Копировать номер"
                        >
                            📋
                        </button>
                    </div>
                </div>
                <div className={styles.cardFooter}>
                    <div className={styles.cardInfo}>
                        <span className={styles.cardHolder}>
                            {user.name?.toUpperCase() || 'CARDHOLDER'}
                        </span>
                        <span className={styles.cardExpiry}>
                            {formatCardDate(card.expiration_date)}
                        </span>
                    </div>
                    <div className={styles.cardStatus}>
                        <span className={`${styles.statusBadge} ${card.is_active ? styles.statusActive : styles.statusInactive}`}>
                            {card.is_active ? 'Активна' : 'Неактивна'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.cardActions}>
                <button
                    className={styles.cardActionBtn}
                    onClick={() => onCardOperation(card, 'deposit')}
                    disabled={!card.is_active}
                >
                    💰 Пополнить
                </button>
                <button
                    className={styles.cardActionBtn}
                    onClick={() => onCardOperation(card, 'withdraw')}
                    disabled={!card.is_active}
                >
                    💸 Снять
                </button>
                <button
                    className={styles.cardActionBtn}
                    onClick={() => onCardOperation(card, 'transfer')}
                    disabled={!card.is_active}
                >
                    🔁 Перевод
                </button>
                <div className={styles.cardManagementActions}>
                    <button
                        className={styles.managementBtn}
                        onClick={handleDeactivateCard}
                        disabled={!card.is_active}
                    >
                        🚫 Деактивировать
                    </button>
                    <button
                        className={`${styles.managementBtn} ${styles.danger}`}
                        onClick={handleDeleteCard}
                    >
                        🗑️ Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardItem;