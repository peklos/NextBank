// front/src/services/authService.js
import { loginClient, registerClient, getMe } from "../api/clients";
import { fetchMyAccounts } from "../api/accounts";
import { getClientCards } from "../api/cards";
import { getMyLoans } from "../api/loans";
import { getMyProcesses } from "../api/processes";
import { getMyTransactions } from "../api/transactions";
import { setUser } from '../features/auth/authSlice';
import { setPersonalInfo } from '../features/auth/personalInfoSlice';
import { setAccounts } from '../features/accounts/accSlice';
import { setCards } from '../features/cards/cardSlice';
import { setLoans } from '../features/loans/loansSlice';
import { setProcesses } from '../features/processes/processesSlice';
import { setTransactions } from '../features/transactions/transactionsSlice';
import { fullLogout } from "../features/auth/logoutThunk";

// Функция для загрузки всех данных пользователя
const loadUserData = async (dispatch, userId) => {
    try {
        const [accRes, cardsRes, loansRes, processesRes, transactionsRes] = await Promise.all([
            fetchMyAccounts(),
            getClientCards(),
            getMyLoans(),
            getMyProcesses(),
            getMyTransactions()
        ]);

        if (accRes.data) dispatch(setAccounts(accRes.data));
        if (cardsRes.data) dispatch(setCards(cardsRes.data));
        if (loansRes.data) dispatch(setLoans(loansRes.data));
        if (processesRes.data) dispatch(setProcesses(processesRes.data));
        if (transactionsRes.data) dispatch(setTransactions(transactionsRes.data));
    } catch (error) {
        console.error('❌ Ошибка загрузки данных пользователя:', error);
        // Не пробрасываем ошибку дальше, чтобы не ломать автологин
    }
};

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

        localStorage.setItem("access_token", res.data.access_token);

        // Загружаем остальные данные в фоне (не блокируем навигацию)
        loadUserData(dispatch, res.data.client_id);

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

        localStorage.setItem("access_token", res.data.access_token);

        // Загружаем остальные данные в фоне
        loadUserData(dispatch, res.data.client_id);

        return { success: true };
    }

    return { success: false, error: res.error };
};

// === АВТОЛОГИН ===
export const autoLogin = async (dispatch) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.log("ℹ️ Токен клиента не найден");
        return false;
    }

    try {
        console.log("🔍 Проверка токена клиента...");
        const res = await getMe();

        if (res.data) {
            console.log("✅ Токен клиента валидный - автологин успешен");

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

            // Загружаем остальные данные параллельно (НЕ блокируем UI)
            loadUserData(dispatch, res.data.id).catch(err => {
                console.error('⚠️ Не удалось загрузить дополнительные данные:', err);
            });

            return true; // ✅ Успешный автологин
        } else {
            console.log("❌ Невалидный ответ от /auth/me");
            dispatch(fullLogout());
            return false;
        }
    } catch (error) {
        // Если ошибка 401 - axios interceptor уже обработал логаут
        if (error.response?.status === 401) {
            console.log("⚠️ 401 при автологине - интерцептор обработал");
            return false;
        }

        // Для других ошибок делаем логаут вручную
        console.error('❌ Ошибка автологина клиента:', error.message);
        dispatch(fullLogout());
        return false;
    }
};