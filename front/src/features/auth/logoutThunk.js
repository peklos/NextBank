import { logout } from "./authSlice";
import { clearPersonalInfo } from "./personalInfoSlice";

export const fullLogout = () => (dispatch) => {
    dispatch(logout())
    dispatch(clearPersonalInfo())
}