import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Публичный роут для админ-панели
 * Если сотрудник уже залогинен - редирект на дашборд
 */
export default function AdminPublicRoute({ children }) {
    const { isLoggedIn } = useSelector(state => state.employee || { isLoggedIn: false });

    if (isLoggedIn) {
        return <Navigate to='/admin/dashboard' replace />;
    }

    return children;
}