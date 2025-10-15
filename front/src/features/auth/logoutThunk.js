import { logout } from "./authSlice";
import { clearPersonalInfo } from "./personalInfoSlice";
import { clearAccounts } from '../accounts/accSlice';
import { clearCards } from "../cards/cardSlice";
import { clearLoans } from "../loans/loansSlice"; // 🆕
import { clearProcesses } from "../processes/processesSlice"; // 🆕

export const fullLogout = () => (dispatch) => {
    dispatch(logout());
    dispatch(clearPersonalInfo());
    dispatch(clearAccounts());
    dispatch(clearCards());
    dispatch(clearLoans()); // 🆕
    dispatch(clearProcesses()); // 🆕
}