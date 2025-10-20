// src/hooks/useProfileModals.js
import { useState } from 'react';

export const useProfileModals = () => {
    const [modals, setModals] = useState({
        editName: false,
        personalInfo: false,
        changePassword: false,
        changeEmail: false,
        changePhone: false
    });

    const [forms, setForms] = useState({
        name: {
            firstName: '',
            lastName: '',
            patronymic: ''
        },
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
        if (modalName === 'editName') {
            setForms(prev => ({
                ...prev,
                name: {
                    firstName: '',
                    lastName: '',
                    patronymic: ''
                }
            }));
        } else if (modalName === 'personalInfo') {
            setForms(prev => ({
                ...prev,
                personalInfo: {
                    passport_number: '',
                    address: '',
                    birth_date: '',
                    employment_status: ''
                }
            }));
        } else if (modalName === 'changePassword') {
            setForms(prev => ({
                ...prev,
                password: {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }
            }));
        } else if (modalName === 'changeEmail') {
            setForms(prev => ({
                ...prev,
                email: {
                    newEmail: '',
                    password: ''
                }
            }));
        } else if (modalName === 'changePhone') {
            setForms(prev => ({
                ...prev,
                phone: {
                    newPhone: '',
                    password: ''
                }
            }));
        }
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