import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/cards.module.css';
import { useDispatch } from 'react-redux';
import {
    getClientCards,
    createClientCard,
    deactivateClientCard,
    deleteClientCard,
    depositToCard,
    withdrawFromCard,
    transferBetweenCards
} from '../api/cards';
import { setCards, addCard, updateCard, removeCard } from '../features/cards/cardSlice';

const Cards = () => {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showCreateCardModal, setShowCreateCardModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transactionType, setTransactionType] = useState('deposit');
    const [selectedCard, setSelectedCard] = useState(null);
    const [amount, setAmount] = useState('');
    const [toCardNumber, setToCardNumber] = useState('');
    const [newCardData, setNewCardData] = useState({
        account_id: '',
        card_type: 'DEBIT'
    });
    const [activeMenu, setActiveMenu] = useState(null);

    // Безопасное получение данных из Redux store
    const cards = useSelector(state => state.cards?.list || []);
    const accounts = useSelector(state => state.accounts?.list || []);
    const user = useSelector(state => state.auth);

    const dispatch = useDispatch();

    // Группировка карт по счетам с проверками
    const cardsByAccount = (cards || []).reduce((acc, card) => {
        if (!card) return acc;

        const accountId = card.account_id;
        if (!acc[accountId]) {
            const account = accounts.find(acc => acc?.id === accountId);
            acc[accountId] = {
                account: account || null,
                cards: []
            };
        }
        acc[accountId].cards.push(card);
        return acc;
    }, {});

    // Загрузка карт при монтировании (если их нет в store)
    useEffect(() => {
        if (!cards || cards.length === 0) {
            loadCards();
        }
    }, []);

    const loadCards = async () => {
        const res = await getClientCards();
        if (res.data) {
            dispatch(setCards(res.data));
        }
    };

    // Форматирование номера карты
    const formatCardNumber = (number) => {
        if (!number) return '';
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    // Маскировка номера карты
    const maskCardNumber = (number) => {
        if (!number) return '•••• •••• •••• ••••';
        return '•••• •••• •••• ' + number.slice(-4);
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            month: '2-digit',
            year: '2-digit'
        });
    };

    // Получение цвета карты по типу
    const getCardColor = (cardType) => {
        return cardType === 'CREDIT'
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : 'linear-gradient(135deg, #10b981, #059669)';
    };

    // Получение иконки карты по типу
    const getCardIcon = (cardType) => {
        return cardType === 'CREDIT' ? '💳' : '💵';
    };

    // Обработчик выпуска новой карты
    const handleCreateCard = async () => {
        if (!newCardData.account_id) {
            alert('Выберите счет для привязки карты');
            return;
        }

        const res = await createClientCard(newCardData);
        if (res.data) {
            dispatch(addCard(res.data));
            setShowCreateCardModal(false);
            setNewCardData({ account_id: '', card_type: 'DEBIT' });
            // Показать уведомление об успехе
        } else {
            alert(res.error);
        }
    };

    // Обработчик деактивации карты
    const handleDeactivateCard = async (cardId) => {
        const res = await deactivateClientCard(cardId);
        if (res.data) {
            dispatch(updateCard(res.data));
            setActiveMenu(null);
            // Показать уведомление об успехе
        } else {
            alert(res.error);
        }
    };

    // Обработчик удаления карты
    const handleDeleteCard = async (cardId) => {
        const res = await deleteClientCard(cardId);
        if (res.data) {
            dispatch(removeCard(cardId));
            setActiveMenu(null);
            // Показать уведомление об успехе
        } else {
            alert(res.error);
        }
    };

    // Обработчик транзакции (пополнение/снятие)
    const handleTransaction = async () => {
        if (!amount || amount <= 0) {
            alert('Введите корректную сумму');
            return;
        }

        if (!selectedCard) {
            alert('Карта не выбрана');
            return;
        }

        const res = transactionType === 'deposit'
            ? await depositToCard(selectedCard.id, parseFloat(amount))
            : await withdrawFromCard(selectedCard.id, parseFloat(amount));

        if (res.data) {
            // Обновляем баланс счета
            setShowTransactionModal(false);
            setAmount('');
            setSelectedCard(null);
            // Показать уведомление об успехе
        } else {
            alert(res.error);
        }
    };

    // Обработчик перевода
    const handleTransfer = async () => {
        if (!amount || amount <= 0 || !toCardNumber) {
            alert('Заполните все поля корректно');
            return;
        }

        if (!selectedCard) {
            alert('Карта не выбрана');
            return;
        }

        const res = await transferBetweenCards(
            selectedCard.id,
            toCardNumber.replace(/\s/g, ''),
            parseFloat(amount)
        );

        if (res.data) {
            setShowTransferModal(false);
            setAmount('');
            setToCardNumber('');
            setSelectedCard(null);
            // Показать уведомление об успехе
        } else {
            alert(res.error);
        }
    };

    // Открытие модалки транзакции
    const openTransactionModal = (card, type) => {
        setSelectedCard(card);
        setTransactionType(type);
        setShowTransactionModal(true);
        setActiveMenu(null);
    };

    // Открытие модалки перевода
    const openTransferModal = (card) => {
        setSelectedCard(card);
        setShowTransferModal(true);
        setActiveMenu(null);
    };

    // Закрытие выпадающего меню при клике вне его
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const hasCards = cards && cards.length > 0;
    const accountGroups = Object.entries(cardsByAccount);

    return (
        <div className={styles.cardsContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.cardsContent}>
                {/* Хедер страницы */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleIcon}>💳</span>
                                Мои карты
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Управляйте вашими банковскими картами
                            </p>
                        </div>
                        <button
                            className={styles.createCardButton}
                            onClick={() => setShowCreateCardModal(true)}
                        >
                            <span className={styles.plusIcon}>+</span>
                            Выпустить новую карту
                        </button>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.cardsMain}>
                    {!hasCards ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>💳</div>
                            <h3 className={styles.emptyTitle}>У вас нет карт</h3>
                            <p className={styles.emptyDescription}>
                                Выпустите первую карту для удобных платежей и переводов
                            </p>
                            <button
                                className={styles.createCardButton}
                                onClick={() => setShowCreateCardModal(true)}
                            >
                                <span className={styles.plusIcon}>+</span>
                                Выпустить первую карту
                            </button>
                        </div>
                    ) : (
                        <div className={styles.accountsList}>
                            {accountGroups.map(([accountId, { account, cards: accountCards }]) => (
                                <div key={accountId} className={styles.accountGroup}>
                                    <div className={styles.accountHeader}>
                                        <div className={styles.accountInfo}>
                                            <h3 className={styles.accountName}>
                                                Счет •••• {account?.account_number?.slice(-4) || '••••'}
                                            </h3>
                                            <span className={styles.accountBalance}>
                                                {account?.balance?.toLocaleString('ru-RU') || '0'} ₽
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.cardsGrid}>
                                        {accountCards.map((card) => (
                                            <div key={card.id} className={styles.cardItem}>
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
                                                    <div className={styles.cardNumber}>
                                                        {maskCardNumber(card.card_number)}
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <div className={styles.cardInfo}>
                                                            <span className={styles.cardHolder}>
                                                                {user?.name?.toUpperCase() || 'CARDHOLDER'}
                                                            </span>
                                                            <span className={styles.cardExpiry}>
                                                                {formatDate(card.expiration_date)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.cardStatus}>
                                                            <span className={`${styles.statusBadge} ${card.is_active ? styles.statusActive : styles.statusInactive
                                                                }`}>
                                                                {card.is_active ? 'Активна' : 'Неактивна'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.cardActions}>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => openTransactionModal(card, 'deposit')}
                                                        disabled={!card.is_active}
                                                    >
                                                        <span className={styles.actionIcon}>💰</span>
                                                        Пополнить
                                                    </button>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => openTransactionModal(card, 'withdraw')}
                                                        disabled={!card.is_active}
                                                    >
                                                        <span className={styles.actionIcon}>💸</span>
                                                        Снять
                                                    </button>
                                                    <div className={styles.menuContainer}>
                                                        <button
                                                            className={styles.menuButton}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveMenu(activeMenu === card.id ? null : card.id);
                                                            }}
                                                        >
                                                            ⋮
                                                        </button>
                                                        {activeMenu === card.id && (
                                                            <div className={styles.dropdownMenu}>
                                                                <button
                                                                    className={styles.menuItem}
                                                                    onClick={() => handleDeactivateCard(card.id)}
                                                                    disabled={!card.is_active}
                                                                >
                                                                    🚫 Деактивировать
                                                                </button>
                                                                <button
                                                                    className={`${styles.menuItem} ${styles.danger}`}
                                                                    onClick={() => handleDeleteCard(card.id)}
                                                                >
                                                                    🗑️ Удалить
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Блок перевода между картами */}
                    {hasCards && cards.length > 1 && (
                        <div className={styles.transferSection}>
                            <div className={styles.transferCard}>
                                <h3 className={styles.transferTitle}>
                                    <span className={styles.transferIcon}>🔁</span>
                                    Перевод между картами
                                </h3>
                                <p className={styles.transferDescription}>
                                    Быстро переводите деньги между вашими картами
                                </p>
                                <button
                                    className={styles.transferButton}
                                    onClick={() => setShowTransferModal(true)}
                                >
                                    Сделать перевод
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Модальное окно выпуска новой карты */}
            {showCreateCardModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>💳</span>
                                Выпуск новой карты
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowCreateCardModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Выберите счет</label>
                                <select
                                    className={styles.formSelect}
                                    value={newCardData.account_id}
                                    onChange={(e) => setNewCardData({ ...newCardData, account_id: e.target.value })}
                                >
                                    <option value="">Выберите счет</option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            Счет •••• {account.account_number?.slice(-4)}
                                            ({account.balance?.toLocaleString('ru-RU')} ₽)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Тип карты</label>
                                <div className={styles.cardTypeOptions}>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            value="DEBIT"
                                            checked={newCardData.card_type === 'DEBIT'}
                                            onChange={(e) => setNewCardData({ ...newCardData, card_type: e.target.value })}
                                        />
                                        <span className={styles.radioLabel}>
                                            <span className={styles.radioIcon}>💵</span>
                                            Дебетовая
                                        </span>
                                    </label>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            value="CREDIT"
                                            checked={newCardData.card_type === 'CREDIT'}
                                            onChange={(e) => setNewCardData({ ...newCardData, card_type: e.target.value })}
                                        />
                                        <span className={styles.radioLabel}>
                                            <span className={styles.radioIcon}>💳</span>
                                            Кредитная
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowCreateCardModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleCreateCard}
                            >
                                Выпустить карту
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно пополнения/снятия */}
            {showTransactionModal && selectedCard && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>
                                    {transactionType === 'deposit' ? '💰' : '💸'}
                                </span>
                                {transactionType === 'deposit' ? 'Пополнение карты' : 'Снятие наличных'}
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowTransactionModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.cardPreview}>
                                <div
                                    className={styles.previewCard}
                                    style={{ background: getCardColor(selectedCard.card_type) }}
                                >
                                    {maskCardNumber(selectedCard.card_number)}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Сумма (₽)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Введите сумму"
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowTransactionModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleTransaction}
                            >
                                {transactionType === 'deposit' ? 'Пополнить' : 'Снять'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно перевода */}
            {showTransferModal && selectedCard && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>🔁</span>
                                Перевод между картами
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowTransferModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>С карты</label>
                                <div className={styles.selectedCard}>
                                    {maskCardNumber(selectedCard.card_number)}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>На карту</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={toCardNumber}
                                    onChange={(e) => setToCardNumber(e.target.value)}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Сумма (₽)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Введите сумму"
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowTransferModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleTransfer}
                            >
                                Перевести
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cards;