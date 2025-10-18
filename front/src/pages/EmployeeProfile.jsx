import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AdminHeader } from '../adm_db_components';
import styles from '../styles/adminHeader.module.css';
import { setEmployee } from '../features/employee/employeeSlice';
import axios from '../api/axios';

const EmployeeProfile = () => {
    const employee = useSelector((state) => state.employee);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('info');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Форма информации
    const [infoForm, setInfoForm] = useState({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        patronymic: employee.patronymic || '',
        email: employee.email || ''
    });
    const [infoErrors, setInfoErrors] = useState({});

    // Форма пароля
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    // Валидация формы информации
    const validateInfoForm = () => {
        const errors = {};

        if (!infoForm.first_name.trim()) {
            errors.first_name = 'Введите имя';
        } else if (!/^[а-яА-ЯёЁ\s\-]+$/.test(infoForm.first_name)) {
            errors.first_name = 'Имя должно содержать только русские буквы';
        }

        if (!infoForm.last_name.trim()) {
            errors.last_name = 'Введите фамилию';
        } else if (!/^[а-яА-ЯёЁ\s\-]+$/.test(infoForm.last_name)) {
            errors.last_name = 'Фамилия должна содержать только русские буквы';
        }

        if (infoForm.patronymic && !/^[а-яА-ЯёЁ\s\-]+$/.test(infoForm.patronymic)) {
            errors.patronymic = 'Отчество должно содержать только русские буквы';
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
        if (!infoForm.email.trim()) {
            errors.email = 'Введите email';
        } else if (!emailRegex.test(infoForm.email)) {
            errors.email = 'Некорректный email';
        }

        setInfoErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Валидация формы пароля
    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordForm.currentPassword) {
            errors.currentPassword = 'Введите текущий пароль';
        }

        if (!passwordForm.newPassword) {
            errors.newPassword = 'Введите новый пароль';
        } else if (passwordForm.newPassword.length < 6) {
            errors.newPassword = 'Пароль должен содержать минимум 6 символов';
        } else if (!/^[a-zA-Z0-9]+$/.test(passwordForm.newPassword)) {
            errors.newPassword = 'Пароль должен содержать только латинские буквы и цифры';
        } else if (!/\d/.test(passwordForm.newPassword)) {
            errors.newPassword = 'Пароль должен содержать хотя бы одну цифру';
        }

        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = 'Подтвердите пароль';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Сохранение информации
    const handleSaveInfo = async (e) => {
        e.preventDefault();

        if (!validateInfoForm()) {
            return;
        }

        try {
            const res = await axios.patch(`/employees/${employee.id}`, {
                first_name: infoForm.first_name,
                last_name: infoForm.last_name,
                patronymic: infoForm.patronymic,
                email: infoForm.email
            });

            if (res.data) {
                dispatch(setEmployee({
                    ...employee,
                    ...res.data
                }));
                showNotification('Профиль успешно обновлен', 'success');
            }
        } catch (err) {
            const error = err.response?.data?.detail || 'Не удалось обновить профиль';
            showNotification(error, 'error');
        }
    };

    // Смена пароля
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        try {
            const { changeEmployeePassword } = await import('../api/employee');
            const res = await changeEmployeePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );

            if (res.data) {
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setPasswordErrors({});
                showNotification('Пароль успешно изменен', 'success');
            } else {
                showNotification(res.error, 'error');
            }
        } catch (err) {
            showNotification('Не удалось изменить пароль', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.adminContainer}>
            <AdminHeader />

            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.profileContainer}>
                {notification.show && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.message}
                    </div>
                )}

                <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar}>
                        <div className={styles.avatarLarge}>
                            {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
                        </div>
                        <div className={styles.profileInfo}>
                            <h1 className={styles.profileName}>
                                {employee.first_name} {employee.last_name}
                            </h1>
                            <div className={styles.profileMeta}>
                                <span className={styles.roleBadge}>{employee.role?.name}</span>
                                <span className={styles.branchName}>
                                    🏢 {employee.branch?.name}
                                </span>
                            </div>
                            <p className={styles.profileDate}>
                                📅 В системе с {formatDate(employee.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.profileTabs}>
                    <button
                        className={`${styles.profileTab} ${activeTab === 'info' ? styles.profileTabActive : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        👤 Личная информация
                    </button>
                    <button
                        className={`${styles.profileTab} ${activeTab === 'password' ? styles.profileTabActive : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        🔒 Безопасность
                    </button>
                </div>

                <div className={styles.profileContent}>
                    {activeTab === 'info' && (
                        <div className={styles.profileSection}>
                            <h2 className={styles.sectionTitle}>Редактировать профиль</h2>
                            <form onSubmit={handleSaveInfo} className={styles.profileForm}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Имя *</label>
                                        <input
                                            type="text"
                                            className={`${styles.formInput} ${infoErrors.first_name ? styles.inputError : ''}`}
                                            value={infoForm.first_name}
                                            onChange={(e) => {
                                                setInfoForm({ ...infoForm, first_name: e.target.value });
                                                if (infoErrors.first_name) setInfoErrors({ ...infoErrors, first_name: null });
                                            }}
                                        />
                                        {infoErrors.first_name && <span className={styles.errorText}>{infoErrors.first_name}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Фамилия *</label>
                                        <input
                                            type="text"
                                            className={`${styles.formInput} ${infoErrors.last_name ? styles.inputError : ''}`}
                                            value={infoForm.last_name}
                                            onChange={(e) => {
                                                setInfoForm({ ...infoForm, last_name: e.target.value });
                                                if (infoErrors.last_name) setInfoErrors({ ...infoErrors, last_name: null });
                                            }}
                                        />
                                        {infoErrors.last_name && <span className={styles.errorText}>{infoErrors.last_name}</span>}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Отчество</label>
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${infoErrors.patronymic ? styles.inputError : ''}`}
                                        value={infoForm.patronymic}
                                        onChange={(e) => {
                                            setInfoForm({ ...infoForm, patronymic: e.target.value });
                                            if (infoErrors.patronymic) setInfoErrors({ ...infoErrors, patronymic: null });
                                        }}
                                    />
                                    {infoErrors.patronymic && <span className={styles.errorText}>{infoErrors.patronymic}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Email *</label>
                                    <input
                                        type="email"
                                        className={`${styles.formInput} ${infoErrors.email ? styles.inputError : ''}`}
                                        value={infoForm.email}
                                        onChange={(e) => {
                                            setInfoForm({ ...infoForm, email: e.target.value });
                                            if (infoErrors.email) setInfoErrors({ ...infoErrors, email: null });
                                        }}
                                    />
                                    {infoErrors.email && <span className={styles.errorText}>{infoErrors.email}</span>}
                                </div>

                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.btnSave}>
                                        💾 Сохранить изменения
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className={styles.profileSection}>
                            <h2 className={styles.sectionTitle}>Смена пароля</h2>
                            <form onSubmit={handleChangePassword} className={styles.profileForm}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Текущий пароль *</label>
                                    <div className={styles.passwordInputWrapper}>
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            className={`${styles.formInput} ${passwordErrors.currentPassword ? styles.inputError : ''}`}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                                                if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: null });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        >
                                            {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {passwordErrors.currentPassword && <span className={styles.errorText}>{passwordErrors.currentPassword}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Новый пароль *</label>
                                    <div className={styles.passwordInputWrapper}>
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            className={`${styles.formInput} ${passwordErrors.newPassword ? styles.inputError : ''}`}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                                                if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: null });
                                            }}
                                            placeholder="Минимум 6 символов"
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        >
                                            {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {passwordErrors.newPassword && <span className={styles.errorText}>{passwordErrors.newPassword}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Подтвердите пароль *</label>
                                    <div className={styles.passwordInputWrapper}>
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            className={`${styles.formInput} ${passwordErrors.confirmPassword ? styles.inputError : ''}`}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                                                if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: null });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        >
                                            {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {passwordErrors.confirmPassword && <span className={styles.errorText}>{passwordErrors.confirmPassword}</span>}
                                </div>

                                <div className={styles.securityNote}>
                                    <span className={styles.securityIcon}>ℹ️</span>
                                    <div>
                                        <strong>Требования к паролю:</strong>
                                        <ul>
                                            <li>Минимум 6 символов</li>
                                            <li>Только латинские буквы и цифры</li>
                                            <li>Хотя бы одна цифра</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.btnSave}>
                                        🔐 Изменить пароль
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;