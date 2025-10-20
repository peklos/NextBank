// src/components/ChangePasswordModal.jsx
import { changePassword } from '../api/profile';
import { validatePassword } from '../utils/validation';
import styles from '../styles/profile.module.css';

const ChangePasswordModal = ({
    isOpen,
    onClose,
    forms,
    error,
    success,
    onUpdateForm,
    onSetError,
    onSetSuccess
}) => {
    const handleChangePassword = async () => {
        const validationError = validatePassword(forms.password);
        if (validationError) {
            onSetError(validationError);
            return;
        }

        const { data, error } = await changePassword(
            forms.password.currentPassword,
            forms.password.newPassword
        );

        if (error || !data) {
            onSetError(error || 'Произошла ошибка при смене пароля');
            return;
        }

        onSetSuccess('Пароль успешно изменен');
        onSetError('');
        onUpdateForm('password', 'currentPassword', '');
        onUpdateForm('password', 'newPassword', '');
        onUpdateForm('password', 'confirmPassword', '');
        setTimeout(() => {
            onClose();
            onSetSuccess('');
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>🔐</span>
                        Смена пароля
                    </h2>
                    <button
                        className={styles.modalClose}
                        onClick={onClose}
                    >
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Текущий пароль</label>
                            <input
                                type="password"
                                value={forms.password.currentPassword}
                                onChange={(e) => onUpdateForm('password', 'currentPassword', e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите текущий пароль"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Новый пароль</label>
                            <input
                                type="password"
                                value={forms.password.newPassword}
                                onChange={(e) => onUpdateForm('password', 'newPassword', e.target.value)}
                                className={styles.formInput}
                                placeholder="Минимум 6 символов, включая цифры"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Подтвердите новый пароль</label>
                            <input
                                type="password"
                                value={forms.password.confirmPassword}
                                onChange={(e) => onUpdateForm('password', 'confirmPassword', e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите пароль еще раз"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorContainer}>
                            <p className={styles.errorMessage}>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className={styles.successContainer}>
                            <p className={styles.successMessage}>{success}</p>
                        </div>
                    )}

                    <div className={styles.modalFooter}>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button className={styles.saveButton} onClick={handleChangePassword}>
                            Изменить пароль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;