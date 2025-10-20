// src/components/PersonalInfoModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fillPersonInfo } from '../api/clients';
import { setPersonalInfo as setPersInfAction } from '../features/auth/personalInfoSlice';
import { validatePersonalInfo } from '../utils/validation';
import styles from '../styles/profile.module.css';

const PersonalInfoModal = ({
    isOpen,
    onClose,
    personalInfoFromStore,
    forms,
    error,
    success,
    onUpdateForm,
    onSetError,
    onSetSuccess
}) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('view');

    const handleEditClick = () => {
        const birthDate = personalInfoFromStore.birth_date?.split('T')[0] || '';
        onUpdateForm('personalInfo', 'passport_number', personalInfoFromStore.passport_number || '');
        onUpdateForm('personalInfo', 'address', personalInfoFromStore.address || '');
        onUpdateForm('personalInfo', 'birth_date', birthDate);
        onUpdateForm('personalInfo', 'employment_status', personalInfoFromStore.employment_status || '');
        setActiveTab('edit');
        onSetError('');
        onSetSuccess('');
    };

    const handleCancelEdit = () => {
        const hasPersonalInfo = Object.values(personalInfoFromStore).some(val => val?.trim());
        hasPersonalInfo ? setActiveTab('view') : onClose();
        onSetError('');
        onSetSuccess('');
    };

    const handleSavePersonalInfo = async () => {
        const validationError = validatePersonalInfo(forms.personalInfo);
        if (validationError) {
            onSetError(validationError);
            return;
        }

        const { data, error } = await fillPersonInfo(forms.personalInfo);

        if (error || !data) {
            onSetError(error || 'Произошла ошибка при сохранении данных');
            return;
        }

        dispatch(setPersInfAction({
            passport_number: data.personal_info.passport_number,
            address: data.personal_info.address,
            birth_date: data.personal_info.birth_date.split('T')[0],
            employment_status: data.personal_info.employment_status
        }));

        onSetSuccess('Персональная информация успешно сохранена');
        onSetError('');
        setTimeout(() => {
            onClose();
            setActiveTab('view');
            onSetSuccess('');
        }, 2000);
    };

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        onUpdateForm('personalInfo', name, name === 'birth_date' ? value.split('T')[0] : value);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.modalIcon}>📄</span>
                        Персональная информация
                    </h2>
                    <button
                        className={styles.modalClose}
                        onClick={() => {
                            onClose();
                            setActiveTab('view');
                            onSetError('');
                            onSetSuccess('');
                        }}
                    >
                        X
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {activeTab === 'view' ? (
                        <div className={styles.viewTab}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>Номер паспорта</div>
                                    <div className={styles.infoValue}>{personalInfoFromStore.passport_number || '—'}</div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>Адрес проживания</div>
                                    <div className={styles.infoValue}>{personalInfoFromStore.address || '—'}</div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>Дата рождения</div>
                                    <div className={styles.infoValue}>
                                        {personalInfoFromStore.birth_date
                                            ? new Date(personalInfoFromStore.birth_date).toLocaleDateString('ru-RU')
                                            : '—'
                                        }
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>Статус занятости</div>
                                    <div className={styles.infoValue}>{personalInfoFromStore.employment_status || '—'}</div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.editInfoButton} onClick={handleEditClick}>
                                    <span>Изменить информацию</span>
                                    <svg viewBox="0 0 24 24" fill="none">
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
                                    <label className={styles.formLabel}>Номер паспорта</label>
                                    <input
                                        type="text"
                                        value={forms.personalInfo.passport_number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            onUpdateForm('personalInfo', 'passport_number', value);
                                        }}
                                        className={styles.formInput}
                                        placeholder="1234567890"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Адрес проживания</label>
                                    <textarea
                                        name="address"
                                        value={forms.personalInfo.address}
                                        onChange={handlePersonalInfoChange}
                                        className={styles.formTextarea}
                                        placeholder="Введите ваш полный адрес"
                                        rows="3"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Дата рождения</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={forms.personalInfo.birth_date || ''}
                                        onChange={handlePersonalInfoChange}
                                        className={styles.formInput}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Статус занятости</label>
                                    <div className={styles.customSelect}>
                                        <select
                                            name="employment_status"
                                            value={forms.personalInfo.employment_status}
                                            onChange={handlePersonalInfoChange}
                                            className={`${styles.formSelect} ${!forms.personalInfo.employment_status ? styles.formSelectError : ''}`}
                                            required
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
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
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
                                <button className={styles.cancelButton} onClick={handleCancelEdit}>
                                    Отмена
                                </button>
                                <button className={styles.saveButton} onClick={handleSavePersonalInfo}>
                                    Применить изменения
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoModal;