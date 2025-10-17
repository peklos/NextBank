import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Клиентские страницы
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Cards from './pages/Cards';
import Loans from './pages/Loans';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

// Админские страницы
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Компоненты
import PrivateLayout from './components/PrivateLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Сервисы
import { autoLogin } from './services/authService';
import { autoLoginEmployee } from './services/employeeAuthService';

function App() {
  const dispatch = useDispatch();
  const clientAuth = useSelector(state => state.auth);
  const employeeAuth = useSelector(state => state.employee);

  useEffect(() => {
    // Проверяем автологин для клиента
    const clientToken = localStorage.getItem('access_token');
    if (clientToken && !clientAuth.isLoggedIn) {
      autoLogin(dispatch);
    }

    // Проверяем автологин для сотрудника
    const employeeToken = localStorage.getItem('employee_token');
    if (employeeToken && !employeeAuth?.isLoggedIn) {
      autoLoginEmployee(dispatch);
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные роуты - клиент */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Защищённые роуты - клиент */}
        <Route element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/transfers" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Публичный роут - админ */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Защищённые роуты - админ */}
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />

        {/* Редиректы */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;