// src/components/EditNameModal.jsx
import { updateProfile } from '../api/profile';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import styles from '../styles/profile.module.css';

const EditNameModal = ({
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
    const currentUser = useSelector(state => state.auth);

    const validateName = (firstName, lastName, patronymic) => {
        if (!firstName || !lastName || !patronymic) {
            return 'Заполните все поля';
        }

        const nameRegex = /^[А-ЯЁа-яё\s-]+$/;

        if (!nameRegex.test(firstName)) {
            return 'Имя должно содержать только русские буквы';
        }

        if (!nameRegex.test(lastName)) {
            return 'Фамилия должна содержать только русские буквы';
        }

        if (!nameRegex.test(patronymic)) {
            return 'Отчество должно содержать только русские буквы';
        }

        if (firstName.length < 2 || firstName.length > 50) {
            return 'Имя должно содержать от 2 до 50 символов';
        }

        if (lastName.length < 2 || lastName.length > 50) {
            return 'Фамилия должна содержать от 2 до 50 символов';
        }

        if (patronymic.length < 2 || patronymic.length > 50) {
            return 'Отчество должно содержать от 2 до 50 символов';
        }

        return null;
    };

    const handleUpdateName = async () => {
        const validationError = validateName(
            forms.name.firstName,
            forms.name.lastName,
            forms.name.patronymic
        );

        if (validationError) {
            onSetError(validationError);
            return;
        }

        const { data, error } = await updateProfile({
            first_name: forms.name.firstName,
            last_name: forms.name.lastName,
            patronymic: forms.name.patronymic
        });

        if (error || !data) {
            onSetError(error || 'Произошла ошибка при обновлении данных');
            return;
        }

        dispatch(setUser({
            ...currentUser,  // 👈 СОХРАНЯЕМ ВСЕ СТАРЫЕ ДАННЫЕ (включая токен!)
            first_name: data.first_name,
            last_name: data.last_name,
            patronymic: data.patronymic
        }));

        onSetSuccess('ФИО успешно обновлено');
        onSetError('');
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
                        <span className={styles.modalIcon}>👤</span>
                        Редактирование ФИО
                    </h2>
                    <button
                        className={styles.modalClose}
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Фамилия</label>
                            <input
                                type="text"
                                value={forms.name.lastName}
                                onChange={(e) => onUpdateForm('name', 'lastName', e.target.value)}
                                className={styles.formInput}
                                placeholder="Иванов"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Имя</label>
                            <input
                                type="text"
                                value={forms.name.firstName}
                                onChange={(e) => onUpdateForm('name', 'firstName', e.target.value)}
                                className={styles.formInput}
                                placeholder="Иван"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Отчество</label>
                            <input
                                type="text"
                                value={forms.name.patronymic}
                                onChange={(e) => onUpdateForm('name', 'patronymic', e.target.value)}
                                className={styles.formInput}
                                placeholder="Иванович"
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
                        <button className={styles.saveButton} onClick={handleUpdateName}>
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNameModal;