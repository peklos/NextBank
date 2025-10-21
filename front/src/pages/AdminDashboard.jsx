// front/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/admin.module.css";
import AdminHeader from "../adm_db_components/AdminHeader";
import {
  getAllEmployees,
  getAllRoles,
  getAllBranches,
  getAllClients,
  getAllProcesses,
  getEmployeesStats,
  getClientsStats,
  getProcessesStats,
  createRole,
  updateRole,
  deleteRole,
  createBranch,
  updateBranch,
  deleteBranch,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeActive,
  approveProcess,
  rejectProcess,
  completeProcess,
} from "../api/admin";
import { registerEmployee } from "../api/employee";
import {
  setEmployees,
  setRoles,
  setBranches,
  setClients,
  setProcesses,
  setStats,
  addRole,
  updateRole as updateRoleAction,
  removeRole,
  addBranch,
  updateBranch as updateBranchAction,
  removeBranch,
  updateEmployee as updateEmployeeAction,
  removeEmployee,
  updateProcess,
} from "../features/admin/adminSlice";

import {
  UniversalOverviewTab,
  EmployeesTab,
  RolesTab,
  BranchesTab,
  ClientsTab,
  ProcessesTab
} from "../adm_db_components";

// Константы прав доступа
const ROLE_PERMISSIONS = {
  SuperAdmin: {
    canManageEmployees: true,
    canManageRoles: true,
    canManageBranches: true,
    canViewClients: true,
    canManageProcesses: true,
    canViewStats: true,
    canViewOverview: true,
  },
  Manager: {
    canManageEmployees: false,
    canManageRoles: false,
    canManageBranches: false,
    canViewClients: true,
    canManageProcesses: true,
    canViewStats: true,
    canViewOverview: true,
  },
  Support: {
    canManageEmployees: false,
    canManageRoles: false,
    canManageBranches: false,
    canViewClients: true,
    canManageProcesses: false,
    canViewStats: false,
    canViewOverview: true,
  },
  Cashier: {
    canManageEmployees: false,
    canManageRoles: false,
    canManageBranches: false,
    canViewClients: true,
    canManageProcesses: false,
    canViewStats: false,
    canViewOverview: true,
  },
  Loan_Officer: {
    canManageEmployees: false,
    canManageRoles: false,
    canManageBranches: false,
    canViewClients: true,
    canManageProcesses: true,
    canViewStats: false,
    canViewOverview: true,
  },
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const employee = useSelector((state) => state.employee);

  const currentPermissions = ROLE_PERMISSIONS[employee.role?.name] || {};

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000
    );
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);

    const requests = [];

    if (currentPermissions.canManageEmployees) {
      requests.push(getAllEmployees(), getAllRoles(), getAllBranches());
    }

    if (currentPermissions.canViewClients) {
      requests.push(getAllClients());
    }

    if (currentPermissions.canManageProcesses || employee.role?.name === "SuperAdmin") {
      requests.push(getAllProcesses());
    }

    // ✅ ИСПРАВЛЕНИЕ: Статистика сотрудников только для SuperAdmin
    if (employee.role?.name === "SuperAdmin") {
      requests.push(getEmployeesStats(), getClientsStats(), getProcessesStats());
    } else if (currentPermissions.canViewOverview) {
      // Для остальных ролей загружаем только статистику клиентов и процессов
      requests.push(getClientsStats(), getProcessesStats());
    }

    const results = await Promise.all(requests);

    let resultIndex = 0;

    if (currentPermissions.canManageEmployees) {
      if (results[resultIndex]?.data) dispatch(setEmployees(results[resultIndex].data));
      resultIndex++;
      if (results[resultIndex]?.data) dispatch(setRoles(results[resultIndex].data));
      resultIndex++;
      if (results[resultIndex]?.data) dispatch(setBranches(results[resultIndex].data));
      resultIndex++;
    }

    if (currentPermissions.canViewClients) {
      if (results[resultIndex]?.data) dispatch(setClients(results[resultIndex].data));
      resultIndex++;
    }

    if (currentPermissions.canManageProcesses || employee.role?.name === "SuperAdmin") {
      if (results[resultIndex]?.data) dispatch(setProcesses(results[resultIndex].data));
      resultIndex++;
    }

    // ✅ ИСПРАВЛЕНИЕ: Обработка статистики в зависимости от роли
    if (employee.role?.name === "SuperAdmin") {
      const employeesStatsRes = results[resultIndex];
      resultIndex++;
      const clientsStatsRes = results[resultIndex];
      resultIndex++;
      const processesStatsRes = results[resultIndex];

      if (employeesStatsRes?.data && clientsStatsRes?.data && processesStatsRes?.data) {
        dispatch(
          setStats({
            employees: employeesStatsRes.data,
            clients: clientsStatsRes.data,
            processes: processesStatsRes.data,
          })
        );
      }
    } else if (currentPermissions.canViewOverview) {
      const clientsStatsRes = results[resultIndex];
      resultIndex++;
      const processesStatsRes = results[resultIndex];

      if (clientsStatsRes?.data && processesStatsRes?.data) {
        dispatch(
          setStats({
            employees: {
              active_employees: 0,
              total_employees: 0,
              inactive_employees: 0,
              by_role: {},
              by_branch: {}
            },
            clients: clientsStatsRes.data,
            processes: processesStatsRes.data,
          })
        );
      }
    }

    setLoading(false);
  };

  const handleEmployeeCreate = async (data) => {
    const res = await registerEmployee(data);
    if (res.data) {
      const employeesRes = await getAllEmployees();
      if (employeesRes.data) dispatch(setEmployees(employeesRes.data));
      showNotification("Сотрудник успешно создан", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleRoleCreate = async (data) => {
    const res = await createRole(data);
    if (res.data) {
      dispatch(addRole(res.data));
      showNotification("Роль успешно создана", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleRoleUpdate = async (id, data) => {
    const res = await updateRole(id, data);
    if (res.data) {
      dispatch(updateRoleAction(res.data));
      showNotification("Роль успешно обновлена", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleRoleDelete = async (id) => {
    const res = await deleteRole(id);
    if (res.data) {
      dispatch(removeRole(id));
      showNotification("Роль успешно удалена", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleBranchCreate = async (data) => {
    const res = await createBranch(data);
    if (res.data) {
      dispatch(addBranch(res.data));
      showNotification("Отделение успешно создано", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleBranchUpdate = async (id, data) => {
    const res = await updateBranch(id, data);
    if (res.data) {
      dispatch(updateBranchAction(res.data));
      showNotification("Отделение успешно обновлено", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleBranchDelete = async (id) => {
    const res = await deleteBranch(id);
    if (res.data) {
      dispatch(removeBranch(id));
      showNotification("Отделение успешно удалено", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleEmployeeUpdate = async (id, data) => {
    const res = await updateEmployee(id, data);
    if (res.data) {
      dispatch(updateEmployeeAction(res.data));
      showNotification("Сотрудник успешно обновлен", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleEmployeeDelete = async (id) => {
    const res = await deleteEmployee(id);
    if (res.data) {
      dispatch(removeEmployee(id));
      showNotification("Сотрудник успешно удален", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleEmployeeToggle = async (id) => {
    const res = await toggleEmployeeActive(id);
    if (res.data) {
      const updatedRes = await getAllEmployees();
      if (updatedRes.data) dispatch(setEmployees(updatedRes.data));
      showNotification(res.data.message, "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleProcessApprove = async (id) => {
    const res = await approveProcess(id);
    if (res.data) {
      dispatch(updateProcess(res.data));
      showNotification("Процесс одобрен", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleProcessReject = async (id) => {
    const res = await rejectProcess(id);
    if (res.data) {
      dispatch(updateProcess(res.data));
      showNotification("Процесс отклонен", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  const handleProcessComplete = async (id) => {
    const res = await completeProcess(id);
    if (res.data) {
      dispatch(updateProcess(res.data));
      showNotification("Процесс завершен", "success");
      return true;
    } else {
      showNotification(res.error, "error");
      return false;
    }
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <AdminHeader />
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <AdminHeader />

      <div className={styles.background}>
        <div className={styles.gradientBlob}></div>
        <div className={styles.gradientBlob}></div>
        <div className={styles.gradientBlob}></div>
      </div>

      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.adminContent}>
        <header className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleIcon}>⚙️</span>
              Панель администратора
            </h1>
            <p className={styles.pageSubtitle}>
              Роль: {employee.role?.name} | Отделение: {employee.branch?.name}
            </p>
          </div>
        </header>

        <div className={styles.tabsContainer}>
          {currentPermissions.canViewOverview && (
            <button
              className={`${styles.tab} ${activeTab === "overview" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Обзор
            </button>
          )}
          {currentPermissions.canManageEmployees && (
            <>
              <button
                className={`${styles.tab} ${activeTab === "employees" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("employees")}
              >
                👥 Сотрудники ({admin.employees.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === "roles" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("roles")}
              >
                🎭 Роли ({admin.roles.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === "branches" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("branches")}
              >
                🏢 Отделения ({admin.branches.length})
              </button>
            </>
          )}
          {currentPermissions.canViewClients && (
            <button
              className={`${styles.tab} ${activeTab === "clients" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("clients")}
            >
              👤 Клиенты ({admin.clients.length})
            </button>
          )}
          {(currentPermissions.canManageProcesses || employee.role?.name === "SuperAdmin") && (
            <button
              className={`${styles.tab} ${activeTab === "processes" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("processes")}
            >
              📋 Процессы ({admin.processes.length})
            </button>
          )}
        </div>

        <main className={styles.tabContent}>
          {activeTab === "overview" && currentPermissions.canViewOverview && (
            <UniversalOverviewTab
              stats={admin.stats}
              employees={admin.employees}
              branches={admin.branches}
              clients={admin.clients}
              processes={admin.processes}
              currentRole={employee.role?.name}
            />
          )}
          {activeTab === "employees" && currentPermissions.canManageEmployees && (
            <EmployeesTab
              employees={admin.employees}
              roles={admin.roles}
              branches={admin.branches}
              onCreate={handleEmployeeCreate}
              onUpdate={handleEmployeeUpdate}
              onDelete={handleEmployeeDelete}
              onToggleActive={handleEmployeeToggle}
            />
          )}
          {activeTab === "roles" && currentPermissions.canManageRoles && (
            <RolesTab
              roles={admin.roles}
              onCreate={handleRoleCreate}
              onUpdate={handleRoleUpdate}
              onDelete={handleRoleDelete}
            />
          )}
          {activeTab === "branches" && currentPermissions.canManageBranches && (
            <BranchesTab
              branches={admin.branches}
              onCreate={handleBranchCreate}
              onUpdate={handleBranchUpdate}
              onDelete={handleBranchDelete}
            />
          )}
          {activeTab === "clients" && currentPermissions.canViewClients && (
            <ClientsTab clients={admin.clients} />
          )}
          {activeTab === "processes" && (currentPermissions.canManageProcesses || employee.role?.name === "SuperAdmin") && (
            <ProcessesTab
              processes={admin.processes}
              onApprove={handleProcessApprove}
              onReject={handleProcessReject}
              onComplete={handleProcessComplete}
              canManage={currentPermissions.canManageProcesses || employee.role?.name === "SuperAdmin"}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;