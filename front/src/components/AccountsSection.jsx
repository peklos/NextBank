// src/components/AccountsSection.jsx
import { NavLink } from 'react-router-dom';
import styles from '../styles/profile.module.css';

const AccountsSection = ({
    accounts,
    totalBalance,
    formatAccountNumber,
    formatCreatedDate
}) => {
    const handleCreateAccount = () => {
        console.log('Создание нового счета');
    };

    return (
        <section className={styles.accountsCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>💳</span>
                    Ваши счета
                </h2>
                {accounts.length > 0 && (
                    <div className={styles.totalBalance}>
                        <span className={styles.balanceLabel}>Общий баланс</span>
                        <span className={styles.balanceAmount}>
                            {new Intl.NumberFormat('ru-RU').format(totalBalance)} ₽
                        </span>
                    </div>
                )}
            </div>

            {accounts.length === 0 ? (
                <div className={styles.noAccounts}>
                    <div className={styles.noAccountsIcon}>💳</div>
                    <h3 className={styles.noAccountsTitle}>У вас пока нет счетов</h3>
                    <p className={styles.noAccountsText}>
                        Откройте свой первый счет и начните пользоваться всеми возможностями банка
                    </p>
                    <NavLink to='/accounts' className={styles.createAccountButton} onClick={handleCreateAccount}>
                        <span className={styles.createAccountIcon}>+</span>
                        Создать новый счет
                    </NavLink>
                </div>
            ) : (
                <>
                    <div className={styles.accountsList}>
                        {accounts.map((account) => (
                            <div key={account.id} className={styles.accountItem}>
                                <div className={styles.accountIcon}>
                                    <span>💳</span>
                                </div>
                                <div className={styles.accountInfo}>
                                    <div className={styles.accountMain}>
                                        <span className={styles.accountNumber}>
                                            {formatAccountNumber(account.account_number)}
                                        </span>
                                        <span className={styles.accountDate}>
                                            Открыт {formatCreatedDate(account.created_at)}
                                        </span>
                                    </div>
                                    <div className={styles.accountBalance}>
                                        <span className={styles.balance}>
                                            {new Intl.NumberFormat('ru-RU').format(account.balance)} ₽
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.accountActions}>
                                    <NavLink to='/accounts' className={styles.actionBtn}>→</NavLink>
                                </div>
                            </div>
                        ))}
                    </div>
                    <NavLink to='/accounts' className={styles.viewAllButton}>
                        <span>Показать все счета</span>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </NavLink>
                </>
            )}
        </section>
    );
};

export default AccountsSection;