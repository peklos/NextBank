import { loginClient, registerClient, getMe } from "../api/clients";
import { fetchMyAccounts } from "../api/accounts";
import { getClientCards } from "../api/cards";
import { getMyLoans } from "../api/loans"; // 🆕
import { getMyProcesses } from "../api/processes"; // 🆕
import { setUser } from '../features/auth/authSlice';
import { setPersonalInfo } from '../features/auth/personalInfoSlice';
import { setAccounts } from '../features/accounts/accSlice';
import { setCards } from '../features/cards/cardSlice';
import { setLoans } from '../features/loans/loansSlice'; // 🆕
import { setProcesses } from '../features/processes/processesSlice'; // 🆕
import { fullLogout } from "../features/auth/logoutThunk";

// === ЛОГИН ===
export const handleLogin = async (dispatch, email, password) => {
    const res = await loginClient(email, password);
    if (res.data) {
        dispatch(setUser({
            id: res.data.client_id,
            access_token: res.data.access_token,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            patronymic: res.data.patronymic,
            email: res.data.email,
            created_at: res.data.created_at,
            phone: res.data.phone
        }));

        if (res.data.personal_info) {
            dispatch(setPersonalInfo({
                passport_number: res.data.personal_info.passport_number,
                address: res.data.personal_info.address,
                birth_date: res.data.personal_info.birth_date,
                employment_status: res.data.personal_info.employment_status
            }));
        }

        // Получаем счета
        const accRes = await fetchMyAccounts();
        if (accRes.data) dispatch(setAccounts(accRes.data));

        // Получаем карты
        const cardsRes = await getClientCards();
        if (cardsRes.data) dispatch(setCards(cardsRes.data));

        // 🆕 Получаем кредиты
        const loansRes = await getMyLoans();
        if (loansRes.data) dispatch(setLoans(loansRes.data));

        // 🆕 Получаем процессы
        const processesRes = await getMyProcesses();
        if (processesRes.data) dispatch(setProcesses(processesRes.data));

        localStorage.setItem("access_token", res.data.access_token);
        return { success: true };
    }

    return { success: false, error: res.error };
};

// === РЕГИСТРАЦИЯ ===
export const handleRegister = async (dispatch, formData) => {
    const res = await registerClient(
        formData.firstName,
        formData.lastName,
        formData.patronymic,
        formData.email,
        formData.phone,
        formData.password
    );

    if (res.data) {
        dispatch(setUser({
            id: res.data.client_id,
            access_token: res.data.access_token,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            patronymic: res.data.patronymic,
            email: res.data.email,
            created_at: res.data.created_at,
            phone: res.data.phone
        }));

        if (res.data.personal_info) {
            dispatch(setPersonalInfo({
                passport_number: res.data.personal_info.passport_number,
                address: res.data.personal_info.address,
                birth_date: res.data.personal_info.birth_date,
                employment_status: res.data.personal_info.employment_status
            }));
        }

        // Получаем счета
        const accRes = await fetchMyAccounts();
        if (accRes.data) dispatch(setAccounts(accRes.data));

        // Получаем карты
        const cardsRes = await getClientCards();
        if (cardsRes.data) dispatch(setCards(cardsRes.data));

        // 🆕 Получаем кредиты
        const loansRes = await getMyLoans();
        if (loansRes.data) dispatch(setLoans(loansRes.data));

        // 🆕 Получаем процессы
        const processesRes = await getMyProcesses();
        if (processesRes.data) dispatch(setProcesses(processesRes.data));

        localStorage.setItem("access_token", res.data.access_token);
        return { success: true };
    }

    return { success: false, error: res.error };
};

// === АВТОЛОГИН ===
export const autoLogin = async (dispatch) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        dispatch(fullLogout());
        return;
    }

    const res = await getMe();
    if (res.data) {
        dispatch(setUser({
            access_token: token,
            ...res.data
        }));

        if (res.data.personal_info) {
            dispatch(setPersonalInfo({
                passport_number: res.data.personal_info.passport_number,
                address: res.data.personal_info.address,
                birth_date: res.data.personal_info.birth_date,
                employment_status: res.data.personal_info.employment_status
            }));
        }

        // Получаем счета
        const accRes = await fetchMyAccounts();
        if (accRes.data) dispatch(setAccounts(accRes.data));

        // Получаем карты
        const cardsRes = await getClientCards();
        if (cardsRes.data) dispatch(setCards(cardsRes.data));

        // 🆕 Получаем кредиты
        const loansRes = await getMyLoans();
        if (loansRes.data) dispatch(setLoans(loansRes.data));

        // 🆕 Получаем процессы
        const processesRes = await getMyProcesses();
        if (processesRes.data) dispatch(setProcesses(processesRes.data));

    } else {
        dispatch(fullLogout());
    }
};