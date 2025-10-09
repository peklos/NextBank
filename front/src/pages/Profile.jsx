import { useState, useEffect } from 'react';
import { fillPersonInfo } from '../api/clients';
import styles from '../styles/profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPersonalInfo as setPersInfAction } from '../features/auth/personalInfoSlice';
import { fullLogout } from '../features/auth/logoutThunk';

const ACCOUNTS_DATA = [
    {
        id: 1,
        name: 'Основной счет',
        number: '4081 7810 0999 1000 4321',
        balance: '1 250 750 ₽',
        currency: 'RUB',
        icon: '💳'
    },
    {
        id: 2,
        name: 'Накопительный',
        number: '4081 7810 0999 1000 4322',
        balance: '350 000 ₽',
        currency: 'RUB',
        icon: '💰'
    },
    {
        id: 3,
        name: 'Долларовый счет',
        number: '4081 7810 0999 1000 4323',
        balance: '$15,250',
        currency: 'USD',
        icon: '💵'
    }
];

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const personalInfoFromStore = useSelector(state => state.personalInfo);

    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('view');
    const [personalInfo, setPersonalInfo] = useState({
        passport_number: '',
        address: '',
        birth_date: '',
        employment_status: ''
    });
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
    const [personalInfoForm, setPersonalInfoForm] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        phone: ''
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const validatePersonalInfo = (info) => {
        if (!info.passport_number || !info.address || !info.birth_date || !info.employment_status) {
            return 'Заполните все поля';
        }

        const passportRegex = /^\d{10}$/;
        if (!passportRegex.test(info.passport_number.replace(/\s/g, ''))) {
            return 'Паспортный номер должен содержать 10 цифр';
        }

        const birthDate = new Date(info.birth_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
            return 'Дата рождения не может быть в будущем';
        }

        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
        minAgeDate.setHours(0, 0, 0, 0);

        if (birthDate > minAgeDate) {
            return 'Вы должны быть не младше 18 лет';
        }

        if (info.address.length < 10) {
            return 'Адрес должен содержать не менее 10 символов';
        }

        if (info.address.length > 200) {
            return 'Адрес не может быть длиннее 200 символов';
        }

        if (!info.employment_status) {
            return 'Выберите статус занятости из списка';
        }

        return null;
    };

    useEffect(() => {
        if (showPersonalInfo) {
            const birthDate = personalInfoFromStore.birth_date?.split('T')[0] || '';
            setPersonalInfo({
                passport_number: personalInfoFromStore.passport_number || '',
                address: personalInfoFromStore.address || '',
                birth_date: birthDate,
                employment_status: personalInfoFromStore.employment_status || ''
            });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showPersonalInfo, personalInfoFromStore]);

    const userData = {
        firstName: user?.first_name || 'Иван',
        lastName: user?.last_name || 'Иванов',
        patronymic: user?.patronymic || 'Иванович',
        email: user?.email || 'ivan.ivanov@nextbank.ru',
        phone: user?.phone || '+7 (999) 123-45-67',
        joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '15 января 2024',
        tier: 'Пользователь',
    };

    const fullName = `${userData.lastName} ${userData.firstName} ${userData.patronymic}`.trim();
    const totalBalance = ACCOUNTS_DATA.reduce((total, account) => {
        const balance = parseFloat(account.balance.replace(/[^\d.]/g, ''));
        return total + balance;
    }, 0);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: name === 'birth_date' ? value.split('T')[0] : value
        }));
    };

    const handleSavePersonalInfo = async () => {
        const validationError = validatePersonalInfo(personalInfo);
        if (validationError) {
            setError(validationError);
            return;
        }

        const { data, error } = await fillPersonInfo(personalInfo)

        if (error || !data) {
            setError(error || 'Произошла ошибка при сохранении данных');
            return;
        }

        dispatch(setPersInfAction({
            passport_number: data.personal_info.passport_number,
            address: data.personal_info.address,
            birth_date: data.personal_info.birth_date.split('T')[0],
            employment_status: data.personal_info.employment_status
        }));

        setError('');
        setShowPersonalInfo(false);
        setActiveTab('view');
    };

    const handleEditClick = () => {
        const birthDate = personalInfoFromStore.birth_date?.split('T')[0] || '';
        setPersonalInfo({
            passport_number: personalInfoFromStore.passport_number || '',
            address: personalInfoFromStore.address || '',
            birth_date: birthDate,
            employment_status: personalInfoFromStore.employment_status || ''
        });
        setActiveTab('edit');
        setError('');
    };

    const handleEditPersonalInfoClick = () => {
        setPersonalInfoForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            patronymic: userData.patronymic,
            email: userData.email,
            phone: userData.phone
        });
        setIsEditingPersonalInfo(true);
    };

    const handleSavePersonalInfoForm = () => {
        console.log('Сохраненные основные данные:', personalInfoForm);
        setIsEditingPersonalInfo(false);
    };

    const handleCancelEdit = () => {
        const hasPersonalInfo = Object.values(personalInfoFromStore).some(val => val?.trim());
        hasPersonalInfo ? setActiveTab('view') : setShowPersonalInfo(false);
    };

    const handleOpenPersonalInfo = () => {
        setShowPersonalInfo(true);
        const hasInfo = Object.values(personalInfoFromStore).some(val => val?.trim());

        if (hasInfo) {
            setPersonalInfo(personalInfoFromStore);
            setActiveTab('view');
        } else {
            setPersonalInfo({ passport_number: '', address: '', birth_date: '', employment_status: '' });
            setActiveTab('edit');
        }
    };

    const personalInfoFields = [
        { label: 'Фамилия', value: userData.lastName, icon: '👤' },
        { label: 'Имя', value: userData.firstName, icon: '👤' },
        { label: 'Отчество', value: userData.patronymic, icon: '👤' },
        { label: 'Email', value: userData.email, icon: '📧' },
        { label: 'Телефон', value: userData.phone, icon: '📱' },
    ];

    const quickActions = [
        { icon: '🔐', text: 'Сменить пароль' },
        { icon: '📧', text: 'Изменить email' },
        { icon: '📱', text: 'Сменить телефон' },
        { icon: notificationsEnabled ? '🔔' : '🔕', text: notificationsEnabled ? 'Уведомления' : 'Без звука', action: () => setNotificationsEnabled(!notificationsEnabled) },
        { icon: '📊', text: 'История операций' },
        { icon: '📄', text: 'Персональная информация', action: handleOpenPersonalInfo },
    ];

    return (
        <div className={styles.profileContainer}>
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.profileContent}>
                <header className={styles.profileHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <span className={styles.avatarInitials}>
                                    {`${userData.lastName[0]}${userData.firstName[0]}`}
                                </span>
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.userName}>{fullName}</h1>
                                <div className={styles.userBadges}>
                                    <span className={styles.badgePrimary}>{userData.tier}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.headerStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Клиент с</span>
                                <span className={styles.statValue}>{userData.joinDate}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Всего счетов</span>
                                <span className={styles.statValue}>{ACCOUNTS_DATA.length}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className={styles.profileMain}>
                    <div className={styles.contentGrid}>
                        <div className={styles.leftColumn}>
                            <section className={styles.infoCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>👤</span>
                                        Личная информация
                                    </h2>
                                    {!isEditingPersonalInfo && (
                                        <button className={styles.editButton} onClick={handleEditPersonalInfoClick}>
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {isEditingPersonalInfo ? (
                                    <div className={styles.editForm}>
                                        <div className={styles.formGrid}>
                                            {Object.keys(personalInfoForm).map((key) => (
                                                <div key={key} className={styles.formGroup}>
                                                    <label className={styles.formLabel}>
                                                        {key === 'firstName' ? 'Имя' :
                                                            key === 'lastName' ? 'Фамилия' :
                                                                key === 'patronymic' ? 'Отчество' :
                                                                    key === 'email' ? 'Email' : 'Телефон'}
                                                    </label>
                                                    <input
                                                        type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                                                        name={key}
                                                        value={personalInfoForm[key]}
                                                        onChange={(e) => setPersonalInfoForm(prev => ({
                                                            ...prev,
                                                            [key]: e.target.value
                                                        }))}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.formActions}>
                                            <button className={styles.cancelButton} onClick={() => setIsEditingPersonalInfo(false)}>
                                                Отмена
                                            </button>
                                            <button className={styles.saveButton} onClick={handleSavePersonalInfoForm}>
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.infoList}>
                                        {personalInfoFields.map((field, index) => (
                                            <div key={index} className={styles.infoRow}>
                                                <div className={styles.infoIcon}>{field.icon}</div>
                                                <div className={styles.infoContent}>
                                                    <span className={styles.infoLabel}>{field.label}</span>
                                                    <span className={styles.infoValue}>{field.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className={styles.accountsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>💳</span>
                                        Ваши счета
                                    </h2>
                                    <div className={styles.totalBalance}>
                                        <span className={styles.balanceLabel}>Общий баланс</span>
                                        <span className={styles.balanceAmount}>
                                            {new Intl.NumberFormat('ru-RU').format(totalBalance)} ₽
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.accountsList}>
                                    {ACCOUNTS_DATA.map((account) => (
                                        <div key={account.id} className={styles.accountItem}>
                                            <div className={styles.accountIcon}>
                                                <span>{account.icon}</span>
                                            </div>
                                            <div className={styles.accountInfo}>
                                                <div className={styles.accountMain}>
                                                    <span className={styles.accountName}>{account.name}</span>
                                                    <span className={styles.accountNumber}>{account.number}</span>
                                                </div>
                                                <div className={styles.accountBalance}>
                                                    <span className={styles.balance}>{account.balance}</span>
                                                    <span className={styles.currency}>{account.currency}</span>
                                                </div>
                                            </div>
                                            <div className={styles.accountActions}>
                                                <button className={styles.actionBtn}>→</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles.viewAllButton}>
                                    <span>Показать все счета</span>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </section>
                        </div>

                        <div className={styles.rightColumn}>
                            <section className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsGrid}>
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            className={styles.actionButton}
                                            onClick={action.action}
                                        >
                                            <span className={styles.actionIcon}>{action.icon}</span>
                                            <span className={styles.actionText}>{action.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className={styles.logoutCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>🚪</span>
                                        Выход из системы
                                    </h2>
                                </div>
                                <p className={styles.logoutText}>
                                    Завершите текущий сеанс работы с интернет-банкингом
                                </p>
                                <button className={styles.logoutButton} onClick={() => dispatch(fullLogout())}>
                                    <span className={styles.logoutIcon}>🚪</span>
                                    Выйти из системы
                                </button>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {showPersonalInfo && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📄</span>
                                Персональная информация
                            </h2>
                            <button className={styles.modalClose} onClick={() => { setShowPersonalInfo(false); setActiveTab('view'); }}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {activeTab === 'view' ? (
                                <div className={styles.viewTab}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Номер паспорта</div>
                                            <div className={styles.infoValue}>{personalInfoFromStore.passport_number || '—'}</div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Адрес проживания</div>
                                            <div className={styles.infoValue}>{personalInfoFromStore.address || '—'}</div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Дата рождения</div>
                                            <div className={styles.infoValue}>
                                                {personalInfoFromStore.birth_date
                                                    ? new Date(personalInfoFromStore.birth_date).toLocaleDateString('ru-RU')
                                                    : '—'
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Статус занятости</div>
                                            <div className={styles.infoValue}>{personalInfoFromStore.employment_status || '—'}</div>
                                        </div>
                                    </div>
                                    <div className={styles.modalFooter}>
                                        <button className={styles.editInfoButton} onClick={handleEditClick}>
                                            <span>Изменить информацию</span>
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.editTab}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Номер паспорта</label>
                                            <input
                                                type="text"
                                                value={personalInfo.passport_number}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setPersonalInfo(prev => ({ ...prev, passport_number: value }));
                                                }}
                                                className={styles.formInput}
                                                placeholder="1234567890"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Адрес проживания</label>
                                            <textarea
                                                name="address"
                                                value={personalInfo.address}
                                                onChange={handlePersonalInfoChange}
                                                className={styles.formTextarea}
                                                placeholder="Введите ваш полный адрес"
                                                rows="3"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Дата рождения</label>
                                            <input
                                                type="date"
                                                name="birth_date"
                                                value={personalInfo.birth_date || ''}
                                                onChange={handlePersonalInfoChange}
                                                className={styles.formInput}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Статус занятости</label>
                                            <div className={styles.customSelect}>
                                                <select
                                                    name="employment_status"
                                                    value={personalInfo.employment_status}
                                                    onChange={handlePersonalInfoChange}
                                                    className={`${styles.formSelect} ${!personalInfo.employment_status ? styles.formSelectError : ''}`}
                                                    required
                                                >
                                                    <option value="">Выберите статус</option>
                                                    <option value="Работаю">Работаю</option>
                                                    <option value="Студент">Студент</option>
                                                    <option value="Пенсионер">Пенсионер</option>
                                                    <option value="Безработный">Безработный</option>
                                                    <option value="Фрилансер">Фрилансер</option>
                                                    <option value="Предприниматель">Предприниматель</option>
                                                </select>
                                                <div className={styles.selectArrow}>
                                                    <svg viewBox="0 0 24 24" fill="none">
                                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className={styles.errorContainer}>
                                            <p className={styles.errorMessage}>{error}</p>
                                        </div>
                                    )}

                                    <div className={styles.modalFooter}>
                                        <button className={styles.cancelButton} onClick={handleCancelEdit}>
                                            Отмена
                                        </button>
                                        <button className={styles.saveButton} onClick={handleSavePersonalInfo}>
                                            Применить изменения
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;