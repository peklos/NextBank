import { logout } from "./authSlice";
import { clearPersonalInfo } from "./personalInfoSlice";
import { clearAccounts } from '../accounts/accSlice'

export const fullLogout = () => (dispatch) => {
    dispatch(logout())
    dispatch(clearPersonalInfo())
    dispatch(clearAccounts())
}