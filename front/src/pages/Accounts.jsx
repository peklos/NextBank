import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/accounts.module.css';
import { createClientAccount, deleteClientAccount } from '../api/accounts';
import { addAccount, removeAccount, setAccounts } from '../features/accounts/accSlice';
import { addCard, setCards } from '../features/cards/cardSlice';
import { fetchMyAccounts } from '../api/accounts';
// Добавьте импорт API функций для операций с картами
import { depositToCard, withdrawFromCard, transferBetweenCards, getClientCards, createClientCard } from '../api/cards'; // предположительный путь

// Компоненты
import AccountStats from '../components/AccountStats';
import QuickActions from '../components/QuickActions';
import AccountCard from '../components/AccountCard';
import CardsModal from '../components/CardsModal';
import AddCardModal from '../components/AddCardModal';
import CardOperationsModal from '../components/CardOperationsModal';
import TransferModal from '../components/TransferModal';
import ConfirmationModal from '../components/ConfirmationModal';

const Accounts = () => {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showCreateAccountConfirm, setShowCreateAccountConfirm] = useState(false);
    const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
    const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [showCardsModal, setShowCardsModal] = useState(false);
    const [selectedAccountForCards, setSelectedAccountForCards] = useState(null);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showCardOperationsModal, setShowCardOperationsModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [newCardType, setNewCardType] = useState('DEBIT');
    const [operationType, setOperationType] = useState('');
    const [amount, setAmount] = useState('');
    const [toCardNumber, setToCardNumber] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Получаем данные из Redux store
    const accountsData = useSelector(state => state.accounts);
    const cardsData = useSelector(state => state.cards?.cards || []);
    const user = useSelector(state => state.auth);
    const accounts = accountsData.list || [];
    const dispatch = useDispatch();

    // Показать уведомление
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    // Обработчики счетов
    const handleCreateAccount = () => {
        setShowCreateAccountConfirm(true);
        document.body.style.overflow = 'hidden';
    };

    const handleConfirmCreate = async () => {
        setShowCreateAccountConfirm(false);
        const res = await createClientAccount(user.id);

        if (res.data != null) {
            dispatch(addAccount(res.data));
            showNotification('Счет успешно создан', 'success');
        } else {
            showNotification(res.error, 'error');
        }
        setShowApplicationSuccess(true);
    };

    const handleDeleteAccount = (account, e) => {
        e.stopPropagation();
        setAccountToDelete(account);
        setShowDeleteAccountConfirm(true);
        document.body.style.overflow = 'hidden';
    };

    const handleConfirmDelete = async () => {
        setShowDeleteAccountConfirm(false);
        const res = await deleteClientAccount(accountToDelete.id);

        if (res.data != null) {
            dispatch(removeAccount(accountToDelete.id));
            showNotification('Счет успешно удален', 'success');
        } else {
            showNotification('Ошибка при удалении счета: ' + res.error, 'error');
        }
        setShowDeleteSuccess(true);
    };

    // Обработчики карт
    const handleShowCards = (account, e) => {
        e.stopPropagation();
        setSelectedAccountForCards(account);
        setShowCardsModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleAddCard = () => {
        setShowAddCardModal(true);
    };

    const handleCreateCard = async () => {
        if (!selectedAccountForCards) return;

        const res = await createClientCard({
            account_id: selectedAccountForCards.id,
            card_type: newCardType
        });

        if (res.data) {
            dispatch(addCard(res.data));
            setShowAddCardModal(false);
            setNewCardType('DEBIT');
            showNotification('Карта успешно выпущена', 'success');
        } else {
            showNotification(res.error, 'error');
        }
    };

    const handleCardOperation = (card, operation) => {
        setSelectedCard(card);
        setOperationType(operation);
        setAmount('');
        setToCardNumber('');

        if (operation === 'transfer') {
            setShowTransferModal(true);
        } else {
            setShowCardOperationsModal(true);
        }
        document.body.style.overflow = 'hidden';
    };

    // Добавленная функция для выполнения операций с картами
    const handleExecuteOperation = async () => {
        if (!selectedCard || !amount) {
            showNotification('Заполните все поля', 'error');
            return;
        }

        try {
            let res;
            const numericAmount = parseFloat(amount);

            if (operationType === 'transfer') {
                // Операция перевода - передаем параметры отдельно
                if (!toCardNumber) {
                    showNotification('Введите номер карты получателя', 'error');
                    return;
                }
                res = await transferBetweenCards(
                    selectedCard.id,  // from_card_id
                    toCardNumber,     // to_card_number
                    numericAmount     // amount
                );
            } else if (operationType === 'deposit') {
                // Операция пополнения - передаем параметры отдельно
                res = await depositToCard(
                    selectedCard.id,  // card_id
                    numericAmount     // amount
                );
            } else if (operationType === 'withdraw') {
                // Операция снятия - передаем параметры отдельно
                res = await withdrawFromCard(
                    selectedCard.id,  // card_id
                    numericAmount     // amount
                );
            }

            // Правильная обработка ответа
            if (res && res.data) {
                showNotification(
                    operationType === 'transfer' ? 'Перевод выполнен успешно' :
                        operationType === 'deposit' ? 'Счет пополнен успешно' :
                            'Средства сняты успешно',
                    'success'
                );

                // обновляем карты
                const cardsRes = await getClientCards();
                if (cardsRes.data) dispatch(setCards(cardsRes.data));

                // обновляем счета, чтобы пересчитать баланс
                const accRes = await fetchMyAccounts();
                if (accRes.data) dispatch(setAccounts(accRes.data));

                // Закрываем модальное окно и сбрасываем состояние
                setShowCardOperationsModal(false);
                setShowTransferModal(false);
                setAmount('');
                setToCardNumber('');
                setOperationType('');

            } else {
                // Обработка ошибок от сервера
                const errorMessage = res?.error || 'Ошибка при выполнении операции';
                showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Operation error:', error);
            showNotification('Ошибка при выполнении операции', 'error');
        }
    };

    // Закрытие модалок
    const closeModal = () => {
        setShowCreateAccountConfirm(false);
        setShowApplicationSuccess(false);
        setShowDeleteAccountConfirm(false);
        setShowDeleteSuccess(false);
        setShowCardsModal(false);
        setShowAddCardModal(false);
        setShowCardOperationsModal(false);
        setShowTransferModal(false);
        setSelectedAccountForCards(null);
        setSelectedCard(null);
        setAccountToDelete(null);
        setOperationType('');
        setAmount('');
        setToCardNumber('');
        setNewCardType('DEBIT');
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.accountsContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            {/* Уведомление */}
            {notification.show && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            <div className={styles.accountsContent}>
                {/* Хедер страницы */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleIcon}>🏦</span>
                                Мои счета
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Управляйте вашими банковскими счетами и картами
                            </p>
                        </div>
                        <AccountStats accounts={accounts} cards={cardsData} />
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.accountsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Быстрые действия */}
                        <div className={styles.leftColumn}>
                            <QuickActions onCreateAccount={handleCreateAccount} />
                        </div>

                        {/* Правая колонка - Список счетов */}
                        <div className={styles.rightColumn}>
                            <div className={styles.accountsHeader}>
                                <h2 className={styles.sectionTitle}>
                                    Мои счета
                                    <span className={styles.accountsCount}>({accounts.length})</span>
                                </h2>
                                <div className={styles.searchBox}>
                                    <input
                                        type="text"
                                        placeholder="Поиск по номеру счета..."
                                        className={styles.searchInput}
                                    />
                                    <span className={styles.searchIcon}>🔍</span>
                                </div>
                            </div>

                            {accounts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🏦</div>
                                    <h3 className={styles.emptyTitle}>У вас нет счетов</h3>
                                    <p className={styles.emptyDescription}>
                                        Откройте первый счет, чтобы начать пользоваться банковскими услугами
                                    </p>
                                    <button className={styles.createAccountButton} onClick={handleCreateAccount}>
                                        <span className={styles.addIcon}>+</span>
                                        Создать первый счет
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.accountsGrid}>
                                        {accounts.map((account, index) => (
                                            <AccountCard
                                                key={account.id}
                                                account={account}
                                                index={index}
                                                isSelected={selectedAccount === account.id}
                                                onSelect={setSelectedAccount}
                                                onShowCards={handleShowCards}
                                                onDelete={handleDeleteAccount}
                                                cards={cardsData}
                                            />
                                        ))}
                                    </div>

                                    <div className={styles.addAccountSection}>
                                        <button className={styles.addAccountButton} onClick={handleCreateAccount}>
                                            <span className={styles.addIcon}>+</span>
                                            Открыть новый счет
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Модальные окна */}
            <CardsModal
                isOpen={showCardsModal}
                account={selectedAccountForCards}
                cards={cardsData}
                user={user}
                onClose={closeModal}
                onAddCard={handleAddCard}
                onCardOperation={handleCardOperation}
            />

            <AddCardModal
                isOpen={showAddCardModal}
                cardType={newCardType}
                user={user}
                onCardTypeChange={setNewCardType}
                onClose={closeModal}
                onCreateCard={handleCreateCard}
            />

            <CardOperationsModal
                isOpen={showCardOperationsModal}
                card={selectedCard}
                operationType={operationType}
                amount={amount}
                onAmountChange={setAmount}
                onClose={closeModal}
                onExecute={handleExecuteOperation}
            />

            <TransferModal
                isOpen={showTransferModal}
                card={selectedCard}
                amount={amount}
                toCardNumber={toCardNumber}
                onAmountChange={setAmount}
                onToCardNumberChange={setToCardNumber}
                onClose={closeModal}
                onExecute={handleExecuteOperation}
            />

            <ConfirmationModal
                type="createAccount"
                isOpen={showCreateAccountConfirm}
                onClose={closeModal}
                onConfirm={handleConfirmCreate}
            />

            <ConfirmationModal
                type="createSuccess"
                isOpen={showApplicationSuccess}
                onClose={closeModal}
            />

            <ConfirmationModal
                type="deleteAccount"
                isOpen={showDeleteAccountConfirm}
                account={accountToDelete}
                accounts={accounts}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
            />

            <ConfirmationModal
                type="deleteSuccess"
                isOpen={showDeleteSuccess}
                onClose={closeModal}
            />
        </div>
    );
};

export default Accounts;