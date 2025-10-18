import React, { useState } from 'react';
import styles from '../styles/admin.module.css';

const EmployeeCreateModal = ({ roles, branches, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        patronymic: "",
        email: "",
        password: "",
        confirmPassword: "",
        role_id: roles[0]?.id || "",
        branch_id: branches[0]?.id || "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Имя
        if (!formData.first_name.trim()) {
            newErrors.first_name = "Введите имя";
        } else if (formData.first_name.length > 50) {
            newErrors.first_name = "Имя не может быть длиннее 50 символов";
        } else if (!/^[а-яА-ЯёЁ\s\-]+$/.test(formData.first_name)) {
            newErrors.first_name = "Имя должно содержать только русские буквы";
        }

        // Фамилия
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Введите фамилию";
        } else if (formData.last_name.length > 50) {
            newErrors.last_name = "Фамилия не может быть длиннее 50 символов";
        } else if (!/^[а-яА-ЯёЁ\s\-]+$/.test(formData.last_name)) {
            newErrors.last_name = "Фамилия должна содержать только русские буквы";
        }

        // Отчество (опционально, но если заполнено - проверяем)
        if (formData.patronymic && formData.patronymic.trim()) {
            if (formData.patronymic.length > 50) {
                newErrors.patronymic = "Отчество не может быть длиннее 50 символов";
            } else if (!/^[а-яА-ЯёЁ\s\-]+$/.test(formData.patronymic)) {
                newErrors.patronymic = "Отчество должно содержать только русские буквы";
            }
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Введите email";
        } else if (formData.email.length > 100) {
            newErrors.email = "Email не может быть длиннее 100 символов";
        } else if (
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(
                formData.email
            )
        ) {
            newErrors.email = "Некорректный email";
        }

        // Пароль
        if (!formData.password) {
            newErrors.password = "Введите пароль";
        } else if (formData.password.length < 6) {
            newErrors.password = "Пароль должен содержать минимум 6 символов";
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
            newErrors.password = "Пароль должен содержать только латинские буквы и цифры";
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Пароль должен содержать хотя бы одну цифру";
        }

        // Подтверждение пароля
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Подтвердите пароль";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        // Роль и отделение
        if (!formData.role_id) {
            newErrors.role_id = "Выберите роль";
        }

        if (!formData.branch_id) {
            newErrors.branch_id = "Выберите отделение";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;
        onSave(dataToSend);
    };

    const availableRoles = roles.filter((role) => role.name !== "SuperAdmin");

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>👤</span>
                        Добавить сотрудника
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Имя *</label>
                        <input
                            type="text"
                            className={`${styles.formInput} ${errors.first_name ? styles.inputError : ""}`}
                            value={formData.first_name}
                            onChange={(e) => {
                                setFormData({ ...formData, first_name: e.target.value });
                                if (errors.first_name) setErrors({ ...errors, first_name: null });
                            }}
                            placeholder="Иван"
                        />
                        {errors.first_name && <span className={styles.errorText}>{errors.first_name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Фамилия *</label>
                        <input
                            type="text"
                            className={`${styles.formInput} ${errors.last_name ? styles.inputError : ""}`}
                            value={formData.last_name}
                            onChange={(e) => {
                                setFormData({ ...formData, last_name: e.target.value });
                                if (errors.last_name) setErrors({ ...errors, last_name: null });
                            }}
                            placeholder="Иванов"
                        />
                        {errors.last_name && <span className={styles.errorText}>{errors.last_name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отчество</label>
                        <input
                            type="text"
                            className={`${styles.formInput} ${errors.patronymic ? styles.inputError : ""}`}
                            value={formData.patronymic}
                            onChange={(e) => {
                                setFormData({ ...formData, patronymic: e.target.value });
                                if (errors.patronymic) setErrors({ ...errors, patronymic: null });
                            }}
                            placeholder="Иванович"
                        />
                        {errors.patronymic && <span className={styles.errorText}>{errors.patronymic}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email *</label>
                        <input
                            type="email"
                            className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            placeholder="employee@nextbank.ru"
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Пароль *</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                placeholder="Минимум 6 символов"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Подтверждение пароля *</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ""}`}
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                                }}
                                placeholder="Повторите пароль"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Роль *</label>
                        <select
                            className={`${styles.formInput} ${errors.role_id ? styles.inputError : ""}`}
                            value={formData.role_id}
                            onChange={(e) => {
                                setFormData({ ...formData, role_id: parseInt(e.target.value) });
                                if (errors.role_id) setErrors({ ...errors, role_id: null });
                            }}
                        >
                            <option value="">Выберите роль</option>
                            {availableRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <span className={styles.errorText}>{errors.role_id}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отделение *</label>
                        <select
                            className={`${styles.formInput} ${errors.branch_id ? styles.inputError : ""}`}
                            value={formData.branch_id}
                            onChange={(e) => {
                                setFormData({ ...formData, branch_id: parseInt(e.target.value) });
                                if (errors.branch_id) setErrors({ ...errors, branch_id: null });
                            }}
                        >
                            <option value="">Выберите отделение</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && <span className={styles.errorText}>{errors.branch_id}</span>}
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.btnSave}>
                            Создать сотрудника
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreateModal;