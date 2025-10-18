import React, { useState } from 'react';
import styles from '../styles/admin.module.css';

const RoleFormModal = ({ title, initialData = null, onClose, onSave }) => {
    const [name, setName] = useState(initialData?.name || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name });
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
                        <label className={styles.formLabel}>Название роли</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: Manager"
                            required
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

export default RoleFormModal;