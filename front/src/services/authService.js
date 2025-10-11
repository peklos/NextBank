import { loginClient, registerClient, getMe } from "../api/clients";
import { fetchClientAccounts } from "../api/accounts";
import { setUser } from '../features/auth/authSlice';
import { setPersonalInfo } from '../features/auth/personalInfoSlice';
import { setAccounts } from '../features/accounts/accSlice';
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
            created_at: res.data.created_at
        }));

        if (res.data.personal_info) {
            dispatch(setPersonalInfo({
                passport_number: res.data.personal_info.passport_number,
                address: res.data.personal_info.address,
                birth_date: res.data.personal_info.birth_date,
                employment_status: res.data.personal_info.employment_status
            }));
        }

        const accRes = await fetchClientAccounts(res.data.client_id);
        if (accRes.data) dispatch(setAccounts(accRes.data));

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
            created_at: res.data.created_at
        }));

        if (res.data.personal_info) {
            dispatch(setPersonalInfo({
                passport_number: res.data.personal_info.passport_number,
                address: res.data.personal_info.address,
                birth_date: res.data.personal_info.birth_date,
                employment_status: res.data.personal_info.employment_status
            }));
        }

        const accRes = await fetchClientAccounts(res.data.client_id);
        if (accRes.data) dispatch(setAccounts(accRes.data));

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

        const accRes = await fetchClientAccounts(res.data.id);
        if (accRes.data) dispatch(setAccounts(accRes.data));

    } else {
        dispatch(fullLogout());
    }
};
