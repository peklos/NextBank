import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({ children }) {
    const { isLoggedIn } = useSelector(state => state.employee || { isLoggedIn: false });

    if (!isLoggedIn) {
        return <Navigate to='/admin/login' replace />;
    }

    return children;
}