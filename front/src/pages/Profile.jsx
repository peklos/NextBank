import React, { useState, useEffect } from 'react';
import styles from '../styles/profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Profile = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth)
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [activeTab, setActiveTab] = useState('view'); // 'view' или 'edit'
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

    // Блокировка скролла при открытии попапа
    useEffect(() => {
        if (showPersonalInfo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showPersonalInfo]);

    // Формируем данные пользователя из Redux store
    const userData = {
        firstName: user?.first_name || 'Иван',
        lastName: user?.last_name || 'Иванов',
        patronymic: user?.patronymic || 'Иванович',
        email: user?.email || 'ivan.ivanov@nextbank.ru',
        phone: user?.phone || '+7 (999) 123-45-67',
        joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : '15 января 2024',
        tier: 'Пользователь',
    };

    // Полное имя для отображения
    const fullName = `${userData.lastName} ${userData.firstName} ${userData.patronymic}`.trim();

    // Данные счетов
    const accounts = [
        {
            id: 1,
            name: 'Основной счет',
            number: '4081 7810 0999 1000 4321',
            balance: '1 250 750 ₽',
            type: 'RUB',
            currency: 'RUB',
            available: '1 250 750 ₽',
            icon: '💳'
        },
        {
            id: 2,
            name: 'Накопительный',
            number: '4081 7810 0999 1000 4322',
            balance: '350 000 ₽',
            type: 'RUB',
            currency: 'RUB',
            available: '350 000 ₽',
            icon: '💰'
        },
        {
            id: 3,
            name: 'Долларовый счет',
            number: '4081 7810 0999 1000 4323',
            balance: '$15,250',
            type: 'USD',
            currency: 'USD',
            available: '$15,250',
            icon: '💵'
        }
    ];

    const totalBalance = accounts.reduce((total, account) => {
        const balance = parseFloat(account.balance.replace(/[^\d.]/g, ''));
        return total + balance;
    }, 0);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePersonalInfoFormChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfoForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSavePersonalInfo = () => {
        // Здесь будет логика сохранения данных
        console.log('Сохраненные данные:', personalInfo);
        setShowPersonalInfo(false);
        setActiveTab('view');
    };

    const handleSavePersonalInfoForm = () => {
        // Здесь будет логика сохранения основных данных
        console.log('Сохраненные основные данные:', personalInfoForm);
        setIsEditingPersonalInfo(false);
        // В реальном приложении здесь будет обновление данных в Redux/store
    };

    const handleEditClick = () => {
        // Заполняем форму текущими данными (в реальном приложении брать из API)
        setPersonalInfo({
            passport_number: '1234 567890',
            address: 'г. Москва, ул. Примерная, д. 123, кв. 45',
            birth_date: '1990-05-15',
            employment_status: 'Работаю'
        });
        setActiveTab('edit');
    };

    const handleEditPersonalInfoClick = () => {
        // Заполняем форму текущими данными пользователя
        setPersonalInfoForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            patronymic: userData.patronymic,
            email: userData.email,
            phone: userData.phone
        });
        setIsEditingPersonalInfo(true);
    };

    const handleCancelEdit = () => {
        setActiveTab('view');
    };

    const handleCancelPersonalInfoEdit = () => {
        setIsEditingPersonalInfo(false);
    };

    const handleCloseModal = () => {
        setShowPersonalInfo(false);
        setActiveTab('view');
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div className={styles.profileContainer}>
            {/* Анимированный фон */}
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.profileContent}>
                {/* Хедер профиля */}
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
                                <span className={styles.statValue}>{accounts.length}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Основной контент */}
                <main className={styles.profileMain}>
                    <div className={styles.contentGrid}>
                        {/* Левая колонка - Информация и счета */}
                        <div className={styles.leftColumn}>
                            {/* Личная информация */}
                            <section className={styles.infoCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>👤</span>
                                        Личная информация
                                    </h2>
                                    {!isEditingPersonalInfo && (
                                        <button
                                            className={styles.editButton}
                                            onClick={handleEditPersonalInfoClick}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {isEditingPersonalInfo ? (
                                    <div className={styles.editForm}>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Фамилия</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={personalInfoForm.lastName}
                                                    onChange={handlePersonalInfoFormChange}
                                                    className={styles.formInput}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Имя</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={personalInfoForm.firstName}
                                                    onChange={handlePersonalInfoFormChange}
                                                    className={styles.formInput}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Отчество</label>
                                                <input
                                                    type="text"
                                                    name="patronymic"
                                                    value={personalInfoForm.patronymic}
                                                    onChange={handlePersonalInfoFormChange}
                                                    className={styles.formInput}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={personalInfoForm.email}
                                                    onChange={handlePersonalInfoFormChange}
                                                    className={styles.formInput}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Телефон</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={personalInfoForm.phone}
                                                    onChange={handlePersonalInfoFormChange}
                                                    className={styles.formInput}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formActions}>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={handleCancelPersonalInfoEdit}
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                className={styles.saveButton}
                                                onClick={handleSavePersonalInfoForm}
                                            >
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.infoList}>
                                        <div className={styles.infoRow}>
                                            <div className={styles.infoIcon}>👤</div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Фамилия</span>
                                                <span className={styles.infoValue}>{userData.lastName}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <div className={styles.infoIcon}>👤</div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Имя</span>
                                                <span className={styles.infoValue}>{userData.firstName}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <div className={styles.infoIcon}>👤</div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Отчество</span>
                                                <span className={styles.infoValue}>{userData.patronymic}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <div className={styles.infoIcon}>📧</div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Email</span>
                                                <span className={styles.infoValue}>{userData.email}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <div className={styles.infoIcon}>📱</div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Телефон</span>
                                                <span className={styles.infoValue}>{userData.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Ваши счета */}
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
                                    {accounts.map((account) => (
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
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </section>
                        </div>

                        {/* Правая колонка - Действия и настройки */}
                        <div className={styles.rightColumn}>
                            {/* Быстрые действия */}
                            <section className={styles.actionsCard}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>
                                        <span className={styles.cardIcon}>⚡</span>
                                        Быстрые действия
                                    </h2>
                                </div>
                                <div className={styles.actionsGrid}>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>🔐</span>
                                        <span className={styles.actionText}>Сменить пароль</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📧</span>
                                        <span className={styles.actionText}>Изменить email</span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📱</span>
                                        <span className={styles.actionText}>Сменить телефон</span>
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={toggleNotifications}
                                    >
                                        <span className={styles.actionIcon}>
                                            {notificationsEnabled ? '🔔' : '🔕'}
                                        </span>
                                        <span className={styles.actionText}>
                                            {notificationsEnabled ? 'Уведомления' : 'Без звука'}
                                        </span>
                                    </button>
                                    <button className={styles.actionButton}>
                                        <span className={styles.actionIcon}>📊</span>
                                        <span className={styles.actionText}>История операций</span>
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => setShowPersonalInfo(true)}
                                    >
                                        <span className={styles.actionIcon}>📄</span>
                                        <span className={styles.actionText}>Персональная информация</span>
                                    </button>
                                </div>
                            </section>

                            {/* Выход из системы */}
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
                                <button className={styles.logoutButton} onClick={() => dispatch(logout())}>
                                    <span className={styles.logoutIcon}>🚪</span>
                                    Выйти из системы
                                </button>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {/* Попап персональной информации */}
            {showPersonalInfo && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <span className={styles.modalIcon}>📄</span>
                                Персональная информация
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={handleCloseModal}
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                            <div className={styles.infoValue}>1234 567890</div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Адрес проживания</div>
                                            <div className={styles.infoValue}>г. Москва, ул. Примерная, д. 123, кв. 45</div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Дата рождения</div>
                                            <div className={styles.infoValue}>15 мая 1990</div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoLabel}>Статус занятости</div>
                                            <div className={styles.infoValue}>Работаю</div>
                                        </div>
                                    </div>
                                    <div className={styles.modalFooter}>
                                        <button
                                            className={styles.editInfoButton}
                                            onClick={handleEditClick}
                                        >
                                            <span>Изменить информацию</span>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                            <label className={styles.formLabel}>
                                                Номер паспорта
                                            </label>
                                            <input
                                                type="text"
                                                name="passport_number"
                                                value={personalInfo.passport_number}
                                                onChange={handlePersonalInfoChange}
                                                className={styles.formInput}
                                                placeholder="1234 567890"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Адрес проживания
                                            </label>
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
                                            <label className={styles.formLabel}>
                                                Дата рождения
                                            </label>
                                            <input
                                                type="date"
                                                name="birth_date"
                                                value={personalInfo.birth_date}
                                                onChange={handlePersonalInfoChange}
                                                className={styles.formInput}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Статус занятости
                                            </label>
                                            <div className={styles.customSelect}>
                                                <select
                                                    name="employment_status"
                                                    value={personalInfo.employment_status}
                                                    onChange={handlePersonalInfoChange}
                                                    className={styles.formSelect}
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
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.modalFooter}>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={handleCancelEdit}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            className={styles.saveButton}
                                            onClick={handleSavePersonalInfo}
                                        >
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