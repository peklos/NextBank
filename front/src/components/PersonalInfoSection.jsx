// src/components/PersonalInfoSection.jsx
import styles from '../styles/profile.module.css';

const PersonalInfoSection = ({ userData, onEditPersonalInfo }) => {
    const personalInfoFields = [
        { label: 'Фамилия', value: userData.lastName, icon: '👤' },
        { label: 'Имя', value: userData.firstName, icon: '👤' },
        { label: 'Отчество', value: userData.patronymic, icon: '👤' },
        { label: 'Email', value: userData.email, icon: '📧' },
        { label: 'Телефон', value: userData.phone, icon: '📱' },
    ];

    return (
        <section className={styles.infoCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>👤</span>
                    Личная информация
                </h2>
                <button className={styles.editButton} onClick={onEditPersonalInfo}>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            <div className={styles.infoList}>
                {personalInfoFields.map((field, index) => (
                    <div key={index} className={styles.infoRow}>
                        <div className={styles.infoIcon}>{field.icon}</div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>{field.label}</span>
                            <span className={styles.infoValue}>{field.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PersonalInfoSection;