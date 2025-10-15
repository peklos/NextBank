// [file name]: Loans.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    applyForLoan,
    getMyLoans,
    getLoanDetails,
    payLoan,
    getLoanSchedule
} from '../api/loans';
import {
    createProcess,
    getMyProcesses,
    getProcessDetails,
    updateProcessStatus,
    deleteProcess,
    getMyProcessesStats
} from '../api/processes';
import {
    setLoans,
    addLoan,
    updateLoan,
    setLoansError,
    setLoansLoading
} from '../features/loans/loansSlice';
import {
    setProcesses,
    addProcess,
    updateProcess,
    setProcessesStats,
    setProcessesError,
    setProcessesLoading
} from '../features/processes/processesSlice';
import styles from '../styles/loans.module.css';

const Loans = () => {
    const dispatch = useDispatch();
    const { list: loans, loading: loansLoading, error: loansError } = useSelector(state => state.loans);
    const { list: processes, stats: processesStats, loading: processesLoading, error: processesError } = useSelector(state => state.processes);

    const [activeTab, setActiveTab] = useState('loans');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [schedule, setSchedule] = useState(null);

    const [loanForm, setLoanForm] = useState({
        amount: '',
        term: 12,
        purpose: '',
        description: ''
    });

    const [processForm, setProcessForm] = useState({
        type: '',
        title: '',
        description: '',
        priority: 'medium'
    });

    // Загрузка данных при монтировании
    useEffect(() => {
        loadLoans();
        loadProcesses();
        loadProcessesStats();
    }, []);

    const loadLoans = async () => {
        dispatch(setLoansLoading(true));
        const { data, error } = await getMyLoans();
        if (data) {
            dispatch(setLoans(data));
        } else {
            dispatch(setLoansError(error));
        }
        dispatch(setLoansLoading(false));
    };

    const loadProcesses = async () => {
        dispatch(setProcessesLoading(true));
        const { data, error } = await getMyProcesses();
        if (data) {
            dispatch(setProcesses(data));
        } else {
            dispatch(setProcessesError(error));
        }
        dispatch(setProcessesLoading(false));
    };

    const loadProcessesStats = async () => {
        const { data } = await getMyProcessesStats();
        if (data) {
            dispatch(setProcessesStats(data));
        }
    };

    const handleApplyForLoan = async () => {
        const { data, error } = await applyForLoan(loanForm);
        if (data) {
            dispatch(addLoan(data));
            setShowApplyModal(false);
            setLoanForm({ amount: '', term: 12, purpose: '', description: '' });
        } else {
            dispatch(setLoansError(error));
        }
    };

    const handleCreateProcess = async () => {
        const { data, error } = await createProcess(processForm);
        if (data) {
            dispatch(addProcess(data));
            setShowProcessModal(false);
            setProcessForm({ type: '', title: '', description: '', priority: 'medium' });
        } else {
            dispatch(setProcessesError(error));
        }
    };

    const handlePayLoan = async (loanId) => {
        const { data, error } = await payLoan(loanId, { amount: parseFloat(paymentAmount) });
        if (data) {
            dispatch(updateLoan(data));
            setSelectedLoan(null);
            setPaymentAmount('');
        } else {
            dispatch(setLoansError(error));
        }
    };

    const handleLoadSchedule = async (loanId) => {
        const { data } = await getLoanSchedule(loanId);
        if (data) {
            setSchedule(data);
        }
    };

    const handleUpdateProcessStatus = async (processId, status) => {
        const { data, error } = await updateProcessStatus(processId, { status });
        if (data) {
            dispatch(updateProcess(data));
            setSelectedProcess(null);
        } else {
            dispatch(setProcessesError(error));
        }
    };

    const handleDeleteProcess = async (processId) => {
        const { error } = await deleteProcess(processId);
        if (!error) {
            dispatch(removeProcess(processId));
            setSelectedProcess(null);
        } else {
            dispatch(setProcessesError(error));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getLoanStatusColor = (status) => {
        const statusColors = {
            'active': '#10b981',
            'pending': '#f59e0b',
            'rejected': '#ef4444',
            'paid': '#3b82f6',
            'overdue': '#dc2626'
        };
        return statusColors[status] || '#6b7280';
    };

    const getProcessPriorityColor = (priority) => {
        const priorityColors = {
            'low': '#10b981',
            'medium': '#f59e0b',
            'high': '#ef4444',
            'critical': '#dc2626'
        };
        return priorityColors[priority] || '#6b7280';
    };

    const loanPurposes = [
        'Ипотека',
        'Автокредит',
        'Потребительский кредит',
        'Образовательный кредит',
        'Ремонт',
        'Лечение',
        'Отдых',
        'Бизнес',
        'Другое'
    ];

    const processTypes = [
        'Кредитная заявка',
        'Открытие счета',
        'Выпуск карты',
        'Обслуживание',
        'Консультация',
        'Другое'
    ];

    return (
        <div className={styles.loansContainer}>
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.loansContent}>
                <header className={styles.loansHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.pageTitle}>Кредиты и Процессы</h1>
                            <p className={styles.pageSubtitle}>
                                Управляйте вашими кредитами и отслеживайте процессы
                            </p>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Активных кредитов</span>
                                <span className={styles.statValue}>
                                    {loans.filter(loan => loan.status === 'active').length}
                                </span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Всего процессов</span>
                                <span className={styles.statValue}>{processes.length}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Общая задолженность</span>
                                <span className={styles.statValue}>
                                    {formatCurrency(loans.reduce((total, loan) => total + (loan.remaining_amount || 0), 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className={styles.loansMain}>
                    {/* Навигационные табы */}
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'loans' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('loans')}
                            >
                                <span className={styles.tabIcon}>💰</span>
                                Мои кредиты
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'processes' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('processes')}
                            >
                                <span className={styles.tabIcon}>📊</span>
                                Процессы
                            </button>
                        </div>
                    </div>

                    {/* Контент табов */}
                    <div className={styles.tabContent}>
                        {activeTab === 'loans' && (
                            <div className={styles.loansSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>
                                        <span className={styles.sectionIcon}>💰</span>
                                        Мои кредиты
                                    </h2>
                                    <button
                                        className={styles.primaryButton}
                                        onClick={() => setShowApplyModal(true)}
                                    >
                                        <span className={styles.buttonIcon}>+</span>
                                        Подать заявку
                                    </button>
                                </div>

                                {loansLoading ? (
                                    <div className={styles.loadingState}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Загрузка кредитов...</p>
                                    </div>
                                ) : loansError ? (
                                    <div className={styles.errorState}>
                                        <div className={styles.errorIcon}>⚠️</div>
                                        <p>{loansError}</p>
                                        <button className={styles.retryButton} onClick={loadLoans}>
                                            Попробовать снова
                                        </button>
                                    </div>
                                ) : loans.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>💰</div>
                                        <h3 className={styles.emptyTitle}>У вас пока нет кредитов</h3>
                                        <p className={styles.emptyText}>
                                            Подайте заявку на первый кредит и воспользуйтесь нашими выгодными условиями
                                        </p>
                                        <button
                                            className={styles.emptyActionButton}
                                            onClick={() => setShowApplyModal(true)}
                                        >
                                            Подать заявку на кредит
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.loansGrid}>
                                        {loans.map(loan => (
                                            <div key={loan.id} className={styles.loanCard}>
                                                <div className={styles.loanHeader}>
                                                    <div className={styles.loanTitle}>
                                                        <h3 className={styles.loanName}>{loan.purpose}</h3>
                                                        <span
                                                            className={styles.loanStatus}
                                                            style={{ backgroundColor: getLoanStatusColor(loan.status) }}
                                                        >
                                                            {loan.status}
                                                        </span>
                                                    </div>
                                                    <div className={styles.loanAmount}>
                                                        {formatCurrency(loan.amount)}
                                                    </div>
                                                </div>

                                                <div className={styles.loanDetails}>
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>Срок:</span>
                                                        <span className={styles.detailValue}>{loan.term} месяцев</span>
                                                    </div>
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>Ставка:</span>
                                                        <span className={styles.detailValue}>{loan.interest_rate}%</span>
                                                    </div>
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>Остаток:</span>
                                                        <span className={styles.detailValue}>
                                                            {formatCurrency(loan.remaining_amount || loan.amount)}
                                                        </span>
                                                    </div>
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>Дата оформления:</span>
                                                        <span className={styles.detailValue}>
                                                            {formatDate(loan.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.loanActions}>
                                                    {loan.status === 'active' && (
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => setSelectedLoan(loan)}
                                                        >
                                                            💳 Оплатить
                                                        </button>
                                                    )}
                                                    <button
                                                        className={styles.secondaryButton}
                                                        onClick={() => handleLoadSchedule(loan.id)}
                                                    >
                                                        📅 График
                                                    </button>
                                                    <button
                                                        className={styles.secondaryButton}
                                                        onClick={() => {
                                                            setSelectedLoan(loan);
                                                            handleLoadSchedule(loan.id);
                                                        }}
                                                    >
                                                        👁️ Детали
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'processes' && (
                            <div className={styles.processesSection}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>
                                        <span className={styles.sectionIcon}>📊</span>
                                        Мои процессы
                                    </h2>
                                    <button
                                        className={styles.primaryButton}
                                        onClick={() => setShowProcessModal(true)}
                                    >
                                        <span className={styles.buttonIcon}>+</span>
                                        Создать процесс
                                    </button>
                                </div>

                                {processesLoading ? (
                                    <div className={styles.loadingState}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Загрузка процессов...</p>
                                    </div>
                                ) : processesError ? (
                                    <div className={styles.errorState}>
                                        <div className={styles.errorIcon}>⚠️</div>
                                        <p>{processesError}</p>
                                        <button className={styles.retryButton} onClick={loadProcesses}>
                                            Попробовать снова
                                        </button>
                                    </div>
                                ) : processes.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>📊</div>
                                        <h3 className={styles.emptyTitle}>Процессы не найдены</h3>
                                        <p className={styles.emptyText}>
                                            Создайте ваш первый процесс для отслеживания задач и операций
                                        </p>
                                        <button
                                            className={styles.emptyActionButton}
                                            onClick={() => setShowProcessModal(true)}
                                        >
                                            Создать процесс
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.processesList}>
                                        {processes.map(process => (
                                            <div key={process.id} className={styles.processCard}>
                                                <div className={styles.processHeader}>
                                                    <div className={styles.processMain}>
                                                        <h3 className={styles.processTitle}>{process.title}</h3>
                                                        <div className={styles.processMeta}>
                                                            <span
                                                                className={styles.processType}
                                                                style={{
                                                                    backgroundColor: getProcessPriorityColor(process.priority)
                                                                }}
                                                            >
                                                                {process.type}
                                                            </span>
                                                            <span
                                                                className={styles.processPriority}
                                                                style={{
                                                                    backgroundColor: getProcessPriorityColor(process.priority)
                                                                }}
                                                            >
                                                                {process.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.processStatus}>
                                                        {process.status}
                                                    </div>
                                                </div>

                                                {process.description && (
                                                    <p className={styles.processDescription}>
                                                        {process.description}
                                                    </p>
                                                )}

                                                <div className={styles.processDetails}>
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>Создан:</span>
                                                        <span className={styles.detailValue}>
                                                            {formatDate(process.created_at)}
                                                        </span>
                                                    </div>
                                                    {process.updated_at && (
                                                        <div className={styles.detailRow}>
                                                            <span className={styles.detailLabel}>Обновлен:</span>
                                                            <span className={styles.detailValue}>
                                                                {formatDate(process.updated_at)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.processActions}>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => setSelectedProcess(process)}
                                                    >
                                                        ✏️ Изменить
                                                    </button>
                                                    <button
                                                        className={styles.secondaryButton}
                                                        onClick={() => handleDeleteProcess(process.id)}
                                                    >
                                                        🗑️ Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {processesStats && (
                                    <div className={styles.statsCard}>
                                        <h3 className={styles.statsTitle}>Статистика процессов</h3>
                                        <div className={styles.statsGrid}>
                                            <div className={styles.statItem}>
                                                <span className={styles.statNumber}>
                                                    {processesStats.total || processes.length}
                                                </span>
                                                <span className={styles.statLabel}>Всего</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statNumber}>
                                                    {processesStats.completed || 0}
                                                </span>
                                                <span className={styles.statLabel}>Завершено</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statNumber}>
                                                    {processesStats.in_progress || 0}
                                                </span>
                                                <span className={styles.statLabel}>В работе</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statNumber}>
                                                    {processStats.pending || 0}
                                                </span>
                                                <span className={styles.statLabel}>Ожидание</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Модальное окно подачи заявки на кредит */}
            {showApplyModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>💰</span>
                                Заявка на кредит
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowApplyModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Сумма кредита</label>
                                    <input
                                        type="number"
                                        value={loanForm.amount}
                                        onChange={(e) => setLoanForm(prev => ({
                                            ...prev,
                                            amount: e.target.value
                                        }))}
                                        className={styles.formInput}
                                        placeholder="Введите сумму"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Срок (месяцев)</label>
                                    <select
                                        value={loanForm.term}
                                        onChange={(e) => setLoanForm(prev => ({
                                            ...prev,
                                            term: parseInt(e.target.value)
                                        }))}
                                        className={styles.formSelect}
                                    >
                                        <option value={6}>6 месяцев</option>
                                        <option value={12}>12 месяцев</option>
                                        <option value={24}>24 месяца</option>
                                        <option value={36}>36 месяцев</option>
                                        <option value={60}>60 месяцев</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Цель кредита</label>
                                    <select
                                        value={loanForm.purpose}
                                        onChange={(e) => setLoanForm(prev => ({
                                            ...prev,
                                            purpose: e.target.value
                                        }))}
                                        className={styles.formSelect}
                                    >
                                        <option value="">Выберите цель</option>
                                        {loanPurposes.map(purpose => (
                                            <option key={purpose} value={purpose}>
                                                {purpose}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Описание</label>
                                    <textarea
                                        value={loanForm.description}
                                        onChange={(e) => setLoanForm(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        className={styles.formTextarea}
                                        placeholder="Дополнительная информация..."
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {loansError && (
                                <div className={styles.errorContainer}>
                                    <p className={styles.errorMessage}>{loansError}</p>
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowApplyModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleApplyForLoan}
                                    disabled={!loanForm.amount || !loanForm.purpose}
                                >
                                    Подать заявку
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно создания процесса */}
            {showProcessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📊</span>
                                Создать процесс
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowProcessModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Тип процесса</label>
                                    <select
                                        value={processForm.type}
                                        onChange={(e) => setProcessForm(prev => ({
                                            ...prev,
                                            type: e.target.value
                                        }))}
                                        className={styles.formSelect}
                                    >
                                        <option value="">Выберите тип</option>
                                        {processTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Приоритет</label>
                                    <select
                                        value={processForm.priority}
                                        onChange={(e) => setProcessForm(prev => ({
                                            ...prev,
                                            priority: e.target.value
                                        }))}
                                        className={styles.formSelect}
                                    >
                                        <option value="low">Низкий</option>
                                        <option value="medium">Средний</option>
                                        <option value="high">Высокий</option>
                                        <option value="critical">Критический</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Название</label>
                                    <input
                                        type="text"
                                        value={processForm.title}
                                        onChange={(e) => setProcessForm(prev => ({
                                            ...prev,
                                            title: e.target.value
                                        }))}
                                        className={styles.formInput}
                                        placeholder="Введите название процесса"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Описание</label>
                                    <textarea
                                        value={processForm.description}
                                        onChange={(e) => setProcessForm(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        className={styles.formTextarea}
                                        placeholder="Описание процесса..."
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {processesError && (
                                <div className={styles.errorContainer}>
                                    <p className={styles.errorMessage}>{processesError}</p>
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowProcessModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleCreateProcess}
                                    disabled={!processForm.type || !processForm.title}
                                >
                                    Создать процесс
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно оплаты кредита */}
            {selectedLoan && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>💳</span>
                                Оплата кредита
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => {
                                    setSelectedLoan(null);
                                    setPaymentAmount('');
                                    setSchedule(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.loanInfo}>
                                <h3 className={styles.loanInfoTitle}>{selectedLoan.purpose}</h3>
                                <div className={styles.loanDetails}>
                                    <div className={styles.detailRow}>
                                        <span>Остаток:</span>
                                        <span>{formatCurrency(selectedLoan.remaining_amount || selectedLoan.amount)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Ставка:</span>
                                        <span>{selectedLoan.interest_rate}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Сумма платежа</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className={styles.formInput}
                                    placeholder="Введите сумму"
                                />
                            </div>

                            {schedule && (
                                <div className={styles.scheduleSection}>
                                    <h4 className={styles.scheduleTitle}>График платежей</h4>
                                    <div className={styles.scheduleList}>
                                        {schedule.map((payment, index) => (
                                            <div key={index} className={styles.scheduleItem}>
                                                <span>{formatDate(payment.due_date)}</span>
                                                <span>{formatCurrency(payment.amount)}</span>
                                                <span className={
                                                    payment.status === 'paid' ? styles.paidStatus :
                                                        payment.status === 'overdue' ? styles.overdueStatus :
                                                            styles.pendingStatus
                                                }>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setSelectedLoan(null);
                                        setPaymentAmount('');
                                        setSchedule(null);
                                    }}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={() => handlePayLoan(selectedLoan.id)}
                                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                                >
                                    Оплатить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно управления процессом */}
            {selectedProcess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📊</span>
                                Управление процессом
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setSelectedProcess(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.processInfo}>
                                <h3 className={styles.processInfoTitle}>{selectedProcess.title}</h3>
                                <p className={styles.processInfoDescription}>{selectedProcess.description}</p>

                                <div className={styles.processMeta}>
                                    <div className={styles.metaItem}>
                                        <span>Тип:</span>
                                        <span>{selectedProcess.type}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Приоритет:</span>
                                        <span>{selectedProcess.priority}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Статус:</span>
                                        <span>{selectedProcess.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Изменить статус</label>
                                <select
                                    onChange={(e) => handleUpdateProcessStatus(selectedProcess.id, e.target.value)}
                                    className={styles.formSelect}
                                >
                                    <option value="">Выберите статус</option>
                                    <option value="pending">Ожидание</option>
                                    <option value="in_progress">В работе</option>
                                    <option value="completed">Завершено</option>
                                    <option value="cancelled">Отменено</option>
                                </select>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setSelectedProcess(null)}
                                >
                                    Закрыть
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteProcess(selectedProcess.id)}
                                >
                                    Удалить процесс
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loans;