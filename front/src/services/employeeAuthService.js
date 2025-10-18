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

// Автологин для сотрудника
export const autoLoginEmployee = async (dispatch) => {
  const token = localStorage.getItem("employee_token");

  console.log("🔍 Автологин сотрудника, токен:", token); // Для отладки

  if (!token) {
    console.log("❌ Токен не найден");
    dispatch(logoutEmployee());
    return false;
  }

  const res = await getEmployeeMe();

  if (res.data) {
    console.log("✅ Данные сотрудника получены:", res.data);

    dispatch(
      setEmployee({
        access_token: token,
        ...res.data,
      })
    );

    // Загружаем данные для админ-панели
    const [employeesRes, rolesRes, branchesRes, clientsRes, processesRes] =
      await Promise.all([
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

    return true;
  } else {
    console.log("❌ Не удалось получить данные сотрудника:", res.error);
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
