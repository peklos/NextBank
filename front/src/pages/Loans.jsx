import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/loans.module.css';
import { applyForLoan, payLoan, getLoanSchedule, getMyLoans } from '../api/loans';
import { addLoan, setLoans, updateLoan } from '../features/loans/loansSlice';
import { getClientCards } from '../api/cards';
import { setCards } from '../features/cards/cardSlice';

const Loans = () => {
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Форма заявки на кредит
    const [loanForm, setLoanForm] = useState({
        amount: '',
        interest_rate: '',
        term_months: ''
    });

    // Форма оплаты
    const [paymentForm, setPaymentForm] = useState({
        payment_amount: '',
        card_id: ''
    });

    const dispatch = useDispatch();
    const loans = useSelector(state => state.loans.list || []);
    const cards = useSelector(state => state.cards.cards || []);
    const personalInfo = useSelector(state => state.personalInfo);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    // Подать заявку на кредит
    const handleApplyLoan = async () => {
        if (!personalInfo.passport_number) {
            showNotification('Для подачи заявки заполните персональные данные в профиле', 'error');
            return;
        }

        if (!loanForm.amount || !loanForm.interest_rate || !loanForm.term_months) {
            showNotification('Заполните все поля', 'error');
            return;
        }

        const res = await applyForLoan({
            amount: parseFloat(loanForm.amount),
            interest_rate: parseFloat(loanForm.interest_rate),
            term_months: parseInt(loanForm.term_months)
        });

        if (res.data) {
            dispatch(addLoan(res.data));
            setShowApplyModal(false);
            setLoanForm({ amount: '', interest_rate: '', term_months: '' });
            showNotification('Заявка на кредит успешно подана!', 'success');
        } else {
            showNotification(res.error, 'error');
        }
    };

    // Оплатить кредит
    const handlePayLoan = async () => {
        if (!paymentForm.payment_amount || !paymentForm.card_id) {
            showNotification('Заполните все поля', 'error');
            return;
        }

        const res = await payLoan(selectedLoan.id, {
            payment_amount: parseFloat(paymentForm.payment_amount),
            card_id: parseInt(paymentForm.card_id)
        });

        if (res.data) {
            // Обновляем список кредитов
            const loansRes = await getMyLoans();
            if (loansRes.data) dispatch(setLoans(loansRes.data));

            // Обновляем карты (баланс изменился)
            const cardsRes = await getClientCards();
            if (cardsRes.data) dispatch(setCards(cardsRes.data));

            setShowPaymentModal(false);
            setPaymentForm({ payment_amount: '', card_id: '' });
            showNotification(res.data.message, 'success');
        } else {
            showNotification(res.error, 'error');
        }
    };

    // Показать график платежей
    const handleShowSchedule = async (loan) => {
        setSelectedLoan(loan);
        const res = await getLoanSchedule(loan.id);
        if (res.data) {
            setSchedule(res.data);
            setShowScheduleModal(true);
        } else {
            showNotification(res.error, 'error');
        }
    };

    // Открыть модалку оплаты
    const handleOpenPayment = (loan) => {
        setSelectedLoan(loan);
        setShowPaymentModal(true);
    };

    const closeModal = () => {
        setShowApplyModal(false);
        setShowPaymentModal(false);
        setShowScheduleModal(false);
        setSelectedLoan(null);
        setSchedule(null);
        setLoanForm({ amount: '', interest_rate: '', term_months: '' });
        setPaymentForm({ payment_amount: '', card_id: '' });
    };

    // Расчёт общей суммы к оплате
    const calculateTotalAmount = (loan) => {
        return loan.amount * (1 + loan.interest_rate / 100);
    };

    // 🆕 Расчёт оставшейся суммы
    const calculateRemainingAmount = (loan) => {
        const total = calculateTotalAmount(loan);
        return total - (loan.paid_amount || 0);
    };

    // Статистика
    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => !l.is_paid).length;
    const totalDebt = loans
        .filter(l => !l.is_paid)
        .reduce((sum, l) => sum + calculateTotalAmount(l), 0);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.loansContainer}>
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

            <div className={styles.loansContent}>
                {/* Хедер страницы */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleIcon}>💰</span>
                                Мои кредиты
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Управляйте вашими кредитами и просматривайте графики платежей
                            </p>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Всего кредитов</span>
                                <span className={styles.statValue}>{totalLoans}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Активных</span>
                                <span className={styles.statValue}>{activeLoans}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Общий долг</span>
                                <span className={styles.statValue}>
                                    {totalDebt.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.loansMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Быстрые действия */}
                        <div className={styles.leftColumn}>
                            <div className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsList}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => setShowApplyModal(true)}
                                    >
                                        <span className={styles.actionIcon}>📝</span>
                                        <span className={styles.actionText}>Подать заявку на кредит</span>
                                    </button>
                                </div>
                            </div>

                            {/* Информационная карточка */}
                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>ℹ️</div>
                                <h3 className={styles.infoTitle}>Важная информация</h3>
                                <p className={styles.infoText}>
                                    Для подачи заявки на кредит необходимо заполнить персональные данные в профиле.
                                </p>
                            </div>
                        </div>

                        {/* Правая колонка - Список кредитов */}
                        <div className={styles.rightColumn}>
                            <div className={styles.loansHeader}>
                                <h2 className={styles.sectionTitle}>
                                    Мои кредиты
                                    <span className={styles.loansCount}>({loans.length})</span>
                                </h2>
                            </div>

                            {loans.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>💰</div>
                                    <h3 className={styles.emptyTitle}>У вас нет кредитов</h3>
                                    <p className={styles.emptyDescription}>
                                        Подайте заявку на кредит, чтобы получить необходимую сумму
                                    </p>
                                    <button
                                        className={styles.createButton}
                                        onClick={() => setShowApplyModal(true)}
                                    >
                                        <span className={styles.addIcon}>+</span>
                                        Подать заявку
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.loansGrid}>
                                    {loans.map((loan) => (
                                        <div key={loan.id} className={styles.loanCard}>
                                            <div className={styles.loanHeader}>
                                                <div className={styles.loanIcon}>💳</div>
                                                <div className={styles.loanInfo}>
                                                    <h3 className={styles.loanName}>Кредит #{loan.id}</h3>
                                                    <span className={styles.loanDate}>
                                                        {new Date(loan.issued_at).toLocaleDateString('ru-RU')}
                                                    </span>
                                                </div>
                                                <span className={`${styles.statusBadge} ${loan.is_paid ? styles.statusPaid : styles.statusActive}`}>
                                                    {loan.is_paid ? 'Оплачен' : 'Активен'}
                                                </span>
                                            </div>

                                            <div className={styles.loanAmount}>
                                                <span className={styles.amount}>
                                                    {loan.amount.toLocaleString('ru-RU')} ₽
                                                </span>
                                            </div>

                                            <div className={styles.loanDetails}>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Процентная ставка:</span>
                                                    <span className={styles.detailValue}>{loan.interest_rate}%</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Срок:</span>
                                                    <span className={styles.detailValue}>{loan.term_months} мес.</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>К оплате:</span>
                                                    <span className={styles.detailValue}>
                                                        {calculateTotalAmount(loan).toLocaleString('ru-RU')} ₽
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.loanActions}>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleShowSchedule(loan)}
                                                >
                                                    📊 График платежей
                                                </button>
                                                {!loan.is_paid && (
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                                        onClick={() => handleOpenPayment(loan)}
                                                    >
                                                        💰 Оплатить
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Модалка подачи заявки */}
            {showApplyModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📝</span>
                                Заявка на кредит
                            </h2>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Сумма кредита (₽)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={loanForm.amount}
                                    onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                                    placeholder="Например: 100000"
                                    min="1000"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Процентная ставка (%)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={loanForm.interest_rate}
                                    onChange={(e) => setLoanForm({ ...loanForm, interest_rate: e.target.value })}
                                    placeholder="Например: 12.5"
                                    min="0.1"
                                    max="100"
                                    step="0.1"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Срок (месяцев)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={loanForm.term_months}
                                    onChange={(e) => setLoanForm({ ...loanForm, term_months: e.target.value })}
                                    placeholder="Например: 24"
                                    min="1"
                                    max="360"
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={closeModal}>
                                Отмена
                            </button>
                            <button className={styles.saveButton} onClick={handleApplyLoan}>
                                Подать заявку
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка оплаты */}
            {showPaymentModal && selectedLoan && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>💰</span>
                                Оплата кредита #{selectedLoan.id}
                            </h2>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.loanSummary}>
                                <div className={styles.summaryItem}>
                                    <span>Сумма кредита:</span>
                                    <span>{selectedLoan.amount.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>К оплате (с процентами):</span>
                                    <span>{calculateTotalAmount(selectedLoan).toLocaleString('ru-RU')} ₽</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Выберите карту</label>
                                <select
                                    className={styles.formInput}
                                    value={paymentForm.card_id}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, card_id: e.target.value })}
                                >
                                    <option value="">Выберите карту</option>
                                    {cards.filter(c => c.is_active).map(card => (
                                        <option key={card.id} value={card.id}>
                                            •••• {card.card_number.slice(-4)} - {card.account.balance.toLocaleString('ru-RU')} ₽
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Сумма платежа (₽)</label>
                                <input
                                    type="number"
                                    className={styles.formInput}
                                    value={paymentForm.payment_amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_amount: e.target.value })}
                                    placeholder="Введите сумму"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={closeModal}>
                                Отмена
                            </button>
                            <button className={styles.saveButton} onClick={handlePayLoan}>
                                Оплатить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка графика платежей */}
            {showScheduleModal && schedule && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📊</span>
                                График платежей
                            </h2>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.scheduleSummary}>
                                <div className={styles.summaryCard}>
                                    <span className={styles.summaryLabel}>Сумма кредита</span>
                                    <span className={styles.summaryValue}>
                                        {schedule.total_amount.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                                <div className={styles.summaryCard}>
                                    <span className={styles.summaryLabel}>Ежемесячный платёж</span>
                                    <span className={styles.summaryValue}>
                                        {schedule.monthly_payment.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                                <div className={styles.summaryCard}>
                                    <span className={styles.summaryLabel}>Переплата</span>
                                    <span className={styles.summaryValue}>
                                        {schedule.total_interest.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            </div>

                            <div className={styles.scheduleTable}>
                                <div className={styles.tableHeader}>
                                    <span>Месяц</span>
                                    <span>Платёж</span>
                                    <span>Основной долг</span>
                                    <span>Проценты</span>
                                    <span>Остаток</span>
                                </div>
                                <div className={styles.tableBody}>
                                    {schedule.schedule.map((item) => (
                                        <div key={item.month} className={styles.tableRow}>
                                            <span>{item.month}</span>
                                            <span>{item.monthly_payment.toLocaleString('ru-RU')} ₽</span>
                                            <span>{item.principal_payment.toLocaleString('ru-RU')} ₽</span>
                                            <span>{item.interest_payment.toLocaleString('ru-RU')} ₽</span>
                                            <span>{item.remaining_balance.toLocaleString('ru-RU')} ₽</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={closeModal}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loans;