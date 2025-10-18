import React, { useState } from 'react';
import styles from '../styles/admin.module.css';

const EmployeeEditModal = ({ employee, roles, branches, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: employee.first_name,
        last_name: employee.last_name,
        patronymic: employee.patronymic || "",
        email: employee.email,
        role_id: employee.role_id,
        branch_id: employee.branch_id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const availableRoles = roles.filter((role) => role.name !== "SuperAdmin");

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Редактировать сотрудника</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Имя</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Фамилия</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отчество</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.patronymic}
                            onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Роль</label>
                        <select
                            className={styles.formInput}
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                            required
                        >
                            {availableRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отделение</label>
                        <select
                            className={styles.formInput}
                            value={formData.branch_id}
                            onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value) })}
                            required
                        >
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.btnSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeEditModal;