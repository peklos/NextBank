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
    console.error('Ошибка загрузки данных админ-панели:', error);
  }
};

// Автологин для сотрудника
export const autoLoginEmployee = async (dispatch) => {
  const token = localStorage.getItem("employee_token");

  if (!token) {
    console.log("❌ Employee токен не найден - выполняется разлогин");
    dispatch(logoutEmployee());
    return false; // ❌ Токен не найден
  }

  try {
    console.log("🔍 Проверка employee токена...");
    const res = await getEmployeeMe();

    if (res.data) {
      console.log("✅ Employee токен валидный - автологин успешен");
      dispatch(
        setEmployee({
          access_token: token,
          ...res.data,
        })
      );

      // Загружаем данные для админ-панели параллельно
      await loadAdminData(dispatch);

      return true; // ✅ Успешный автологин
    } else {
      console.log("❌ Невалидный employee токен - выполняется разлогин");
      dispatch(logoutEmployee());
      localStorage.removeItem("employee_token");
      return false; // ❌ Невалидный токен
    }
  } catch (error) {
    console.error('❌ Ошибка автологина сотрудника:', error);
    dispatch(logoutEmployee());
    localStorage.removeItem("employee_token");
    return false; // ❌ Ошибка автологина
  }
};

// Полный выход сотрудника
export const fullEmployeeLogout = (dispatch) => {
  dispatch(logoutEmployee());
  localStorage.removeItem("employee_token");
};