// front/src/services/employeeAuthService.js
import { getEmployeeMe } from "../api/employee";
import {
  setEmployee,
  logoutEmployee,
} from "../features/employee/employeeSlice";
import {
  getAllEmployees,
  getAllRoles,
  getAllBranches,
  getAllClients,
  getPendingProcesses,
} from "../api/admin";
import {
  setEmployees,
  setRoles,
  setBranches,
  setClients,
  setProcesses,
} from "../features/admin/adminSlice";

// Функция для загрузки данных админ-панели
const loadAdminData = async (dispatch) => {
  try {
    const [employeesRes, rolesRes, branchesRes, clientsRes, processesRes] = await Promise.all([
      getAllEmployees(),
      getAllRoles(),
      getAllBranches(),
      getAllClients(),
      getPendingProcesses(),
    ]);

    if (employeesRes.data) dispatch(setEmployees(employeesRes.data));
    if (rolesRes.data) dispatch(setRoles(rolesRes.data));
    if (branchesRes.data) dispatch(setBranches(branchesRes.data));
    if (clientsRes.data) dispatch(setClients(clientsRes.data));
    if (processesRes.data) dispatch(setProcesses(processesRes.data));
  } catch (error) {
    console.error('❌ Ошибка загрузки данных админ-панели:', error);
    // Не пробрасываем ошибку дальше
  }
};

// Автологин для сотрудника
export const autoLoginEmployee = async (dispatch) => {
  const token = localStorage.getItem("employee_token");

  if (!token) {
    console.log("ℹ️ Токен сотрудника не найден");
    return false;
  }

  try {
    console.log("🔍 Проверка токена сотрудника...");
    const res = await getEmployeeMe();

    if (res.data) {
      console.log("✅ Токен сотрудника валидный - автологин успешен");

      dispatch(
        setEmployee({
          access_token: token,
          ...res.data,
        })
      );

      // Загружаем данные для админ-панели параллельно (НЕ блокируем UI)
      loadAdminData(dispatch).catch(err => {
        console.error('⚠️ Не удалось загрузить данные админ-панели:', err);
      });

      return true; // ✅ Успешный автологин
    } else {
      console.log("❌ Невалидный ответ от /admin/auth/me");
      dispatch(logoutEmployee());
      localStorage.removeItem("employee_token");
      return false;
    }
  } catch (error) {
    // Если ошибка 401 - axios interceptor уже обработал логаут
    if (error.response?.status === 401) {
      console.log("⚠️ 401 при автологине сотрудника - интерцептор обработал");
      return false;
    }

    // Для других ошибок делаем логаут вручную
    console.error('❌ Ошибка автологина сотрудника:', error.message);
    dispatch(logoutEmployee());
    localStorage.removeItem("employee_token");
    return false;
  }
};

// Полный выход сотрудника
export const fullEmployeeLogout = (dispatch) => {
  dispatch(logoutEmployee());
  localStorage.removeItem("employee_token");
};