import { useSelector } from 'react-redux';
import ProfileHeader from '../components/ProfileHeader';
import PersonalInfoSection from '../components/PersonalInfoSection';
import AccountsSection from '../components/AccountsSection';
import QuickActionsSection from '../components/QuickActionsSection';
import LogoutSection from '../components/LogoutSection';
import PersonalInfoModal from '../components/PersonalInfoModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeEmailModal from '../components/ChangeEmailModal';
import ChangePhoneModal from '../components/ChangePhoneModal';
import { useProfileData } from '../hooks/useProfileData';
import { useProfileModals } from '../hooks/useProfileModals';
import styles from '../styles/profile.module.css';

const Profile = () => {
    const user = useSelector(state => state.auth);
    const personalInfoFromStore = useSelector(state => state.personalInfo);
    const accounts = useSelector(state => state.accounts);

    const {
        userData,
        fullName,
        totalBalance,
        formatAccountNumber,
        formatCreatedDate
    } = useProfileData(user, accounts);

    const {
        modals,
        forms,
        error,
        success,
        openModal,
        closeModal,
        updateForm,
        setError,
        setSuccess
    } = useProfileModals();

    return (
        <div className={styles.profileContainer}>
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.profileContent}>
                <ProfileHeader
                    userData={userData}
                    fullName={fullName}
                    accountsCount={accounts.list.length}
                />

                <main className={styles.profileMain}>
                    <div className={styles.contentGrid}>
                        <div className={styles.leftColumn}>
                            <PersonalInfoSection
                                userData={userData}
                                onEditPersonalInfo={() => openModal('personalInfo')}
                            />

                            <AccountsSection
                                accounts={accounts.list}
                                totalBalance={totalBalance}
                                formatAccountNumber={formatAccountNumber}
                                formatCreatedDate={formatCreatedDate}
                            />
                        </div>

                        <div className={styles.rightColumn}>
                            <QuickActionsSection
                                onOpenPersonalInfo={() => openModal('personalInfo')}
                                onChangePassword={() => openModal('changePassword')}
                                onChangeEmail={() => openModal('changeEmail')}
                                onChangePhone={() => openModal('changePhone')}
                            />

                            <LogoutSection />
                        </div>
                    </div>
                </main>
            </div>

            {/* Модальные окна */}
            <PersonalInfoModal
                isOpen={modals.personalInfo}
                onClose={() => closeModal('personalInfo')}
                personalInfoFromStore={personalInfoFromStore}
                forms={forms}
                error={error}
                success={success}
                onUpdateForm={updateForm}
                onSetError={setError}
                onSetSuccess={setSuccess}
            />

            <ChangePasswordModal
                isOpen={modals.changePassword}
                onClose={() => closeModal('changePassword')}
                forms={forms}
                error={error}
                success={success}
                onUpdateForm={updateForm}
                onSetError={setError}
                onSetSuccess={setSuccess}
            />

            <ChangeEmailModal
                isOpen={modals.changeEmail}
                onClose={() => closeModal('changeEmail')}
                userData={userData}
                forms={forms}
                error={error}
                success={success}
                onUpdateForm={updateForm}
                onSetError={setError}
                onSetSuccess={setSuccess}
            />

            <ChangePhoneModal
                isOpen={modals.changePhone}
                onClose={() => closeModal('changePhone')}
                userData={userData}
                forms={forms}
                error={error}
                success={success}
                onUpdateForm={updateForm}
                onSetError={setError}
                onSetSuccess={setSuccess}
            />
        </div>
    );
};

export default Profile;