// front/src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Клиентские страницы
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Loans from './pages/Loans';
import Transfers from './pages/Transactions';
import Profile from './pages/Profile';

// Админские страницы
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeProfile from './pages/EmployeeProfile';

// Компоненты
import PrivateLayout from './components/PrivateLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoadingScreen from './components/LoadingScreen';

// Админские компоненты из adm_db_components
import { AdminProtectedRoute, AdminPublicRoute } from './adm_db_components';

// Сервисы
import { autoLogin } from './services/authService';
import { autoLoginEmployee } from './services/employeeAuthService';

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🚀 Инициализация аутентификации...");

      const promises = [];

      // ✅ Автологин для клиента
      if (localStorage.getItem('access_token')) {
        console.log("🔍 Найден токен клиента - проверяем...");
        promises.push(
          autoLogin(dispatch).then(success => {
            if (success) {
              console.log("✅ Клиент успешно авторизован");
            } else {
              console.log("❌ Невалидный токен клиента");
            }
            return success;
          }).catch(err => {
            console.error("❌ Критическая ошибка автологина клиента:", err);
            return false;
          })
        );
      }

      // ✅ Автологин для сотрудника
      if (localStorage.getItem('employee_token')) {
        console.log("🔍 Найден токен сотрудника - проверяем...");
        promises.push(
          autoLoginEmployee(dispatch).then(success => {
            if (success) {
              console.log("✅ Сотрудник успешно авторизован");
            } else {
              console.log("❌ Невалидный токен сотрудника");
            }
            return success;
          }).catch(err => {
            console.error("❌ Критическая ошибка автологина сотрудника:", err);
            return false;
          })
        );
      }

      // Ждем завершения всех автологинов
      await Promise.allSettled(promises);

      // Минимальная задержка для плавности (опционально)
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("✅ Инициализация завершена");
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  // Показываем LoadingScreen во время инициализации
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Клиентские публичные роуты */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Клиентские защищенные роуты */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="loans" element={<Loans />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Админские публичные роуты */}
        <Route
          path="/admin/login"
          element={
            <AdminPublicRoute>
              <AdminLogin />
            </AdminPublicRoute>
          }
        />

        {/* Админские защищенные роуты */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminProtectedRoute>
              <EmployeeProfile />
            </AdminProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;