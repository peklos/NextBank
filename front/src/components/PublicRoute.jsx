import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
    const { isLoggedIn } = useSelector(state => state.auth)

    if (isLoggedIn) {
        return <Navigate to='/dashboard' />
    }

    return children
}