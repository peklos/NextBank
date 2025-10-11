import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/accounts.module.css';
import { useDispatch } from 'react-redux';
import { createClientAccount, deleteClientAccount } from '../api/accounts';
import { addAccount, removeAccount } from '../features/accounts/accSlice';

const Accounts = () => {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showCreateAccountConfirm, setShowCreateAccountConfirm] = useState(false);
    const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
    const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    // Получаем данные счетов из Redux store
    const accountsData = useSelector(state => state.accounts);
    const user = useSelector(state => state.auth)
    const accounts = accountsData.list || [];

    const dispatch = useDispatch()

    // Общая статистика
    const totalStats = {
        totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString('ru-RU') + ' ₽',
        totalAccounts: accounts.length,
        activeAccounts: accounts.length, // Все счета активны
    };

    // Все счета показываем без фильтрации
    const filteredAccounts = accounts;

    // Форматирование номера счета
    const formatAccountNumber = (number) => {
        return number.slice(0, 4) + ' •••• •••• ' + number.slice(-4);
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Получение иконки и цвета для счета (простая логика)
    const getAccountInfo = (account, index) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        const icons = ['💳', '💰', '🏦', '💎', '📈', '💵'];

        return {
            icon: icons[index % icons.length],
            color: colors[index % colors.length],
        };
    };

    // Обработчик создания счета
    const handleCreateAccount = () => {
        setShowCreateAccountConfirm(true);
        document.body.style.overflow = 'hidden';
    };

    // Подтверждение создания счета
    const handleConfirmCreate = async () => {
        setShowCreateAccountConfirm(false);

        const res = await createClientAccount(user.id)

        if (res.data != null) {
            dispatch(addAccount(res.data))
        } else {
            alert(res.error)
        }

        // Показываем сообщение об успехе
        setShowApplicationSuccess(true);
    };

    // Отмена создания счета
    const handleCancelCreate = () => {
        setShowCreateAccountConfirm(false);
        document.body.style.overflow = 'unset';
    };

    // Закрытие сообщения об успехе
    const handleCloseSuccess = () => {
        setShowApplicationSuccess(false);
        document.body.style.overflow = 'unset';
    };

    // Обработчик удаления счета
    const handleDeleteAccount = (account, e) => {
        e.stopPropagation();
        setAccountToDelete(account);
        setShowDeleteAccountConfirm(true);
        document.body.style.overflow = 'hidden';
    };

    // Подтверждение удаления счета
    const handleConfirmDelete = async () => {
        setShowDeleteAccountConfirm(false);

        const res = await deleteClientAccount(accountToDelete.id)

        if (res.data != null) {
            console.log('Счет успешно удален')
            dispatch(removeAccount(accountToDelete.id))
        } else {
            console.log(res.error)
            alert('Ошибка при удалении счета: ' + res.error)
        }

        // Показываем сообщение об успехе удаления
        setShowDeleteSuccess(true);
    };

    // Отмена удаления счета
    const handleCancelDelete = () => {
        setShowDeleteAccountConfirm(false);
        setAccountToDelete(null);
        document.body.style.overflow = 'unset';
    };

    // Закрытие сообщения об успешном удалении
    const handleCloseDeleteSuccess = () => {
        setShowDeleteSuccess(false);
        setAccountToDelete(null);
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
                                Управляйте вашими банковскими счетами
                            </p>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Общий баланс</span>
                                <span className={styles.statValue}>{totalStats.totalBalance}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Всего счетов</span>
                                <span className={styles.statValue}>{totalStats.totalAccounts}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.accountsMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Быстрые действия */}
                        <div className={styles.leftColumn}>
                            {/* Быстрые действия */}
                            <section className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsList}>
                                    <button className={styles.actionButton} onClick={handleCreateAccount}>
                                        <span className={styles.actionIcon}>➕</span>
                                        <span className={styles.actionText}>Создать новый счет</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>💸</span>
                                        <span className={styles.actionText}>Перевод между счетами</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🔍</span>
                                        <span className={styles.actionText}>История операций</span>
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Правая колонка - Список счетов */}
                        <div className={styles.rightColumn}>
                            {/* Заголовок и поиск */}
                            <div className={styles.accountsHeader}>
                                <h2 className={styles.sectionTitle}>
                                    Мои счета
                                    <span className={styles.accountsCount}>({filteredAccounts.length})</span>
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

                            {/* Список счетов или сообщение об отсутствии */}
                            {filteredAccounts.length === 0 ? (
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
                                        {filteredAccounts.map((account, index) => {
                                            const accountInfo = getAccountInfo(account, index);
                                            return (
                                                <div
                                                    key={account.id}
                                                    className={`${styles.accountCard} ${selectedAccount === account.id ? styles.accountCardSelected : ''}`}
                                                    onClick={() => setSelectedAccount(account.id)}
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
                                                            <span className={styles.detailLabel}>Номер счета:</span>
                                                            <span className={styles.detailValue}>{account.account_number}</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.accountFooter}>
                                                        <div className={styles.accountActions}>
                                                            <button
                                                                className={styles.actionBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Просмотр операций
                                                                }}
                                                            >
                                                                📊 Операции
                                                            </button>
                                                            <button
                                                                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                                                                onClick={(e) => handleDeleteAccount(account, e)}
                                                            >
                                                                🗑️ Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Кнопка добавления нового счета */}
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

            {/* Попап подтверждения создания счета */}
            {showCreateAccountConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>🏦</span>
                                Создание нового счета
                            </h2>
                            <button className={styles.modalClose} onClick={handleCancelCreate}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.confirmContent}>
                                <div className={styles.confirmIcon}>❓</div>
                                <h3 className={styles.confirmTitle}>
                                    Вы уверены, что хотите завести новый счет?
                                </h3>
                                <p className={styles.confirmDescription}>
                                    После подтверждения будет создана заявка на открытие нового банковского счета.
                                    Обычно это занимает несколько минут.
                                </p>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.cancelButton} onClick={handleCancelCreate}>
                                    Отмена
                                </button>
                                <button className={styles.saveButton} onClick={handleConfirmCreate}>
                                    Да, создать счет
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Попап успешного создания заявки */}
            {showApplicationSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>✅</span>
                                Заявка оформлена
                            </h2>
                            <button className={styles.modalClose} onClick={handleCloseSuccess}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.successContent}>
                                <div className={styles.successIcon}>🎉</div>
                                <h3 className={styles.successTitle}>
                                    Ваша заявка на создание нового счета была оформлена
                                </h3>
                                <p className={styles.successDescription}>
                                    Ожидайте подтверждения. Обычно это занимает не более 5 минут.
                                    Вы получите уведомление, когда счет будет готов к использованию.
                                </p>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.saveButton} onClick={handleCloseSuccess}>
                                    Понятно
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Попап подтверждения удаления счета */}
            {showDeleteAccountConfirm && accountToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>🗑️</span>
                                Удаление счета
                            </h2>
                            <button className={styles.modalClose} onClick={handleCancelDelete}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.confirmContent}>
                                <div className={styles.confirmIcon} style={{ color: '#ef4444' }}>⚠️</div>
                                <h3 className={styles.confirmTitle}>
                                    Вы точно уверены, что хотите удалить счет?
                                </h3>
                                <p className={styles.confirmDescription}>
                                    Вместе с ним удалятся и обнулятся карты, которые были привязаны к этому счету.
                                    Это действие нельзя будет отменить.
                                </p>
                                <div className={styles.accountPreview}>
                                    <div className={styles.accountPreviewIcon} style={{ backgroundColor: getAccountInfo(accountToDelete, accounts.findIndex(acc => acc.id === accountToDelete.id)).color }}>
                                        <span>{getAccountInfo(accountToDelete, accounts.findIndex(acc => acc.id === accountToDelete.id)).icon}</span>
                                    </div>
                                    <div className={styles.accountPreviewInfo}>
                                        <span className={styles.accountPreviewName}>Счет {accountToDelete.id}</span>
                                        <span className={styles.accountPreviewNumber}>{formatAccountNumber(accountToDelete.account_number)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.cancelButton} onClick={handleCancelDelete}>
                                    Отмена
                                </button>
                                <button className={`${styles.saveButton} ${styles.dangerButton}`} onClick={handleConfirmDelete}>
                                    Да, удалить счет
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Попап успешного удаления счета */}
            {showDeleteSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>✅</span>
                                Заявка на удаление отправлена
                            </h2>
                            <button className={styles.modalClose} onClick={handleCloseDeleteSuccess}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.successContent}>
                                <div className={styles.successIcon}>📨</div>
                                <h3 className={styles.successTitle}>
                                    Ваша заявка на удаление счета была отправлена
                                </h3>
                                <p className={styles.successDescription}>
                                    Ожидайте подтверждения. Обычно это занимает не более 5 минут.
                                    Вы получите уведомление, когда счет будет удален.
                                </p>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.saveButton} onClick={handleCloseDeleteSuccess}>
                                    Понятно
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;