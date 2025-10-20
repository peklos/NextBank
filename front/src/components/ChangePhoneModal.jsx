// src/components/ChangePhoneModal.jsx
import { changePhone } from '../api/profile';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { validatePhone, formatPhoneInput } from '../utils/validation';
import styles from '../styles/profile.module.css';

const ChangePhoneModal = ({
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

    const handleChangePhone = async () => {
        const validationError = validatePhone(forms.phone);
        if (validationError) {
            onSetError(validationError);
            return;
        }

        const { data, error } = await changePhone(
            forms.phone.newPhone,
            forms.phone.password
        );

        if (error || !data) {
            onSetError(error || 'Произошла ошибка при смене телефона');
            return;
        }

        dispatch(setUser({
            phone: data.phone
        }));

        onSetSuccess('Телефон успешно изменен');
        onSetError('');
        onUpdateForm('phone', 'newPhone', '');
        onUpdateForm('phone', 'password', '');
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
                        <span className={styles.modalIcon}>📱</span>
                        Изменение номера телефона
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
                        <span className={styles.currentLabel}>Текущий телефон:</span>
                        <span className={styles.currentValue}>{userData.phone}</span>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Новый номер телефона</label>
                            <input
                                type="tel"
                                value={forms.phone.newPhone}
                                onChange={(e) => {
                                    const formatted = formatPhoneInput(e.target.value);
                                    onUpdateForm('phone', 'newPhone', formatted);
                                }}
                                className={styles.formInput}
                                placeholder="+7 (999) 123-45-67"
                                maxLength="18"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Подтвердите паролем</label>
                            <input
                                type="password"
                                value={forms.phone.password}
                                onChange={(e) => onUpdateForm('phone', 'password', e.target.value)}
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
                        <button className={styles.saveButton} onClick={handleChangePhone}>
                            Изменить телефон
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePhoneModal;