// src/components/ProfileHeader.jsx
import styles from '../styles/profile.module.css';

const ProfileHeader = ({ userData, fullName, accountsCount }) => {
    return (
        <header className={styles.profileHeader}>
            <div className={styles.headerMain}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarInitials}>
                            {`${userData.lastName[0]}${userData.firstName[0]}`}
                        </span>
                    </div>
                    <div className={styles.userInfo}>
                        <h1 className={styles.userName}>{fullName}</h1>
                        <div className={styles.userBadges}>
                            <span className={styles.badgePrimary}>{userData.tier}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Клиент с</span>
                        <span className={styles.statValue}>{userData.joinDate}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Всего счетов</span>
                        <span className={styles.statValue}>{accountsCount}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProfileHeader;