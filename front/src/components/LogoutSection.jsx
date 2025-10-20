// src/components/LogoutSection.jsx
import { useDispatch } from 'react-redux';
import { fullLogout } from '../features/auth/logoutThunk';
import styles from '../styles/profile.module.css';

const LogoutSection = () => {
    const dispatch = useDispatch();

    return (
        <section className={styles.logoutCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>🚪</span>
                    Выход из системы
                </h2>
            </div>
            <p className={styles.logoutText}>
                Завершите текущий сеанс работы с интернет-банкингом
            </p>
            <button className={styles.logoutButton} onClick={() => dispatch(fullLogout())}>
                <span className={styles.logoutIcon}>🚪</span>
                Выйти из системы
            </button>
        </section>
    );
};

export default LogoutSection;