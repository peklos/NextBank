import React, { useState } from 'react';
import styles from '../styles/accounts.module.css';
import CardItem from './CardItem';

const CardsModal = ({ isOpen, account, cards, user, onClose, onAddCard, onCardOperation }) => {
    const [showCardNumbers, setShowCardNumbers] = useState({});
    const [copiedCardId, setCopiedCardId] = useState(null);

    if (!isOpen || !account) return null;

    // Надежная функция для копирования номера карты
    const copyCardNumber = async (cardNumber, cardId) => {
        
        try {
            // Очищаем номер карты от пробелов и лишних символов
            const cleanCardNumber = cardNumber.toString().replace(/\s/g, '');

            // Проверяем, что номер карты валидный
            if (!cleanCardNumber || cleanCardNumber.length < 4) {
                throw new Error('Неверный номер карты');
            }

            // Пробуем современный Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(cleanCardNumber);
            } else {
                // Fallback для старых браузеров или HTTP
                const textArea = document.createElement('textarea');
                textArea.value = cleanCardNumber;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (!successful) {
                    throw new Error('Fallback метод не сработал');
                }
            }

            // Успешное копирование
            console.log('Номер карты успешно скопирован');
            setCopiedCardId(cardId);
            setTimeout(() => setCopiedCardId(null), 2000);

        } catch (err) {
            console.error('Ошибка при копировании:', err);
            
            // Альтернативный метод - показываем номер для ручного копирования
            try {
                alert(`Номер карты: ${cardNumber}\n\nСкопируйте номер вручную`);
            } catch (alertErr) {
                console.error('Не удалось показать alert:', alertErr);
            }
        }
    };

    // Функция для переключения видимости номера карты
    const toggleCardVisibility = (cardId) => {
        setShowCardNumbers(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    // Фильтруем карты, принадлежащие текущему счету
    const accountCards = cards.filter(card => card.account_id === account.id);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>💳</span>
                        Карты счета {account.account_number}
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {accountCards.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>💳</div>
                            <h3 className={styles.emptyTitle}>Нет привязанных карт</h3>
                            <p className={styles.emptyDescription}>
                                Выпустите карту для этого счета, чтобы начать ей пользоваться
                            </p>
                            <button className={styles.addCardButton} onClick={onAddCard}>
                                <span className={styles.addIcon}>+</span>
                                Выпустить карту
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {accountCards.map((card) => (
                                <CardItem
                                    key={card.id}
                                    card={card}
                                    user={user}
                                    showCardNumber={showCardNumbers[card.id] || false}
                                    onToggleVisibility={() => toggleCardVisibility(card.id)}
                                    onCopyNumber={() => copyCardNumber(card.card_number, card.id)}
                                    onCardOperation={onCardOperation}
                                    isCopied={copiedCardId === card.id}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    {accountCards.length > 0 && (
                        <button className={styles.addCardButton} onClick={onAddCard}>
                            <span className={styles.addIcon}>+</span>
                            Выпустить еще одну карту
                        </button>
                    )}
                    <button className={styles.closeButton} onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;