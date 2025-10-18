import React, { useState } from 'react';
import styles from '../styles/admin.module.css';

const BranchFormModal = ({ title, initialData = null, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        address: initialData?.address || "",
        phone: initialData?.phone || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Название отделения</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Например: Центральное отделение"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Адрес</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Например: г. Москва, ул. Ленина, д. 1"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Телефон</label>
                        <input
                            type="tel"
                            className={styles.formInput}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+7 (999) 123-45-67"
                        />
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

export default BranchFormModal;