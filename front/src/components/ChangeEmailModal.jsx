// src/components/ChangeEmailModal.jsx
import { changeEmail } from '../api/profile';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { validateEmail } from '../utils/validation';
import styles from '../styles/profile.module.css';

const ChangeEmailModal = ({
    isOpen,
    onClose,
    userData,
    forms,
    error,
    success,
    onUpdateForm,
    onSetError,
    onSetSuccess
}) => {
    const dispatch = useDispatch();

    const handleChangeEmail = async () => {
        const validationError = validateEmail(forms.email, userData.email);
        if (validationError) {
            onSetError(validationError);
            return;
        }

        const { data, error } = await changeEmail(
            forms.email.newEmail,
            forms.email.password
        );

        if (error || !data) {
            onSetError(error || 'Произошла ошибка при смене email');
            return;
        }

        dispatch(setUser({
            email: data.email
        }));

        onSetSuccess('Email успешно изменен');
        onSetError('');
        onUpdateForm('email', 'newEmail', '');
        onUpdateForm('email', 'password', '');
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
                        <span className={styles.modalIcon}>📧</span>
                        Изменение email
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
                    <div className={styles.currentInfo}>
                        <span className={styles.currentLabel}>Текущий email:</span>
                        <span className={styles.currentValue}>{userData.email}</span>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Новый email</label>
                            <input
                                type="email"
                                value={forms.email.newEmail}
                                onChange={(e) => onUpdateForm('email', 'newEmail', e.target.value)}
                                className={styles.formInput}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Подтвердите паролем</label>
                            <input
                                type="password"
                                value={forms.email.password}
                                onChange={(e) => onUpdateForm('email', 'password', e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите ваш пароль"
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
                        <button className={styles.saveButton} onClick={handleChangeEmail}>
                            Изменить email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmailModal;