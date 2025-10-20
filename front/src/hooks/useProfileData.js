// src/hooks/useProfileData.js
import { useMemo } from 'react';

export const useProfileData = (user, accounts) => {
    const userData = useMemo(() => ({
        firstName: user?.first_name || 'Иван',
        lastName: user?.last_name || 'Иванов',
        patronymic: user?.patronymic || 'Иванович',
        email: user?.email || 'ivan.ivanov@nextbank.ru',
        phone: user?.phone || '+7 (999) 123-45-67',
        joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '15 января 2024',
        tier: 'Пользователь',
    }), [user]);

    const fullName = useMemo(() =>
        `${userData.lastName} ${userData.firstName} ${userData.patronymic}`.trim(),
        [userData]
    );

    const totalBalance = useMemo(() =>
        accounts.list.reduce((total, account) => total + (account.balance || 0), 0),
        [accounts.list]
    );

    const formatAccountNumber = (number) => {
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatCreatedDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return {
        userData,
        fullName,
        totalBalance,
        formatAccountNumber,
        formatCreatedDate
    };
};