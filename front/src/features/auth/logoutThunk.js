import { logout } from "./authSlice";
import { clearPersonalInfo } from "./personalInfoSlice";
import { clearAccounts } from '../accounts/accSlice'
import { clearCards } from "../cards/cardSlice";

export const fullLogout = () => (dispatch) => {
    dispatch(logout())
    dispatch(clearPersonalInfo())
    dispatch(clearAccounts())
    dispatch(clearCards())
}