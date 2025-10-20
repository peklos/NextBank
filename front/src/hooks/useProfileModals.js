// src/hooks/useProfileModals.js
import { useState } from 'react';

export const useProfileModals = () => {
    const [modals, setModals] = useState({
        personalInfo: false,
        changePassword: false,
        changeEmail: false,
        changePhone: false
    });

    const [forms, setForms] = useState({
        personalInfo: {
            passport_number: '',
            address: '',
            birth_date: '',
            employment_status: ''
        },
        password: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        email: {
            newEmail: '',
            password: ''
        },
        phone: {
            newPhone: '',
            password: ''
        }
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const openModal = (modalName) => {
        setModals(prev => ({ ...prev, [modalName]: true }));
        setError('');
        setSuccess('');
    };

    const closeModal = (modalName) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
        setError('');
        setSuccess('');

        // Сброс формы при закрытии
        setForms(prev => ({
            ...prev,
            [modalName === 'personalInfo' ? 'personalInfo' :
                modalName === 'changePassword' ? 'password' :
                    modalName === 'changeEmail' ? 'email' : 'phone']:
                modalName === 'personalInfo' ? {
                    passport_number: '',
                    address: '',
                    birth_date: '',
                    employment_status: ''
                } : {
                    ...(modalName === 'changePassword' ? {
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    } : {
                        newEmail: '',
                        password: ''
                    })
                }
        }));
    };

    const updateForm = (formName, field, value) => {
        setForms(prev => ({
            ...prev,
            [formName]: {
                ...prev[formName],
                [field]: value
            }
        }));
    };

    return {
        modals,
        forms,
        error,
        success,
        openModal,
        closeModal,
        updateForm,
        setError,
        setSuccess
    };
};