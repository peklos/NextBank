import axios from "./axios";

// ========== EMPLOYEES ==========
export const getAllEmployees = async () => {
  try {
    const res = await axios.get("/employees/");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить сотрудников";
    return { data: null, error: detail };
  }
};

export const getEmployeeById = async (employeeId) => {
  try {
    const res = await axios.get(`/employees/${employeeId}`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить сотрудника";
    return { data: null, error: detail };
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const res = await axios.patch(`/employees/${employeeId}`, employeeData);
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось обновить сотрудника";
    return { data: null, error: detail };
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const res = await axios.delete(`/employees/${employeeId}`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось удалить сотрудника";
    return { data: null, error: detail };
  }
};

export const toggleEmployeeActive = async (employeeId) => {
  try {
    const res = await axios.patch(`/employees/${employeeId}/toggle-active`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось изменить статус";
    return { data: null, error: detail };
  }
};

export const getEmployeesStats = async () => {
  try {
    const res = await axios.get("/employees/stats/overview");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить статистику";
    return { data: null, error: detail };
  }
};

// ========== ROLES ==========
export const getAllRoles = async () => {
  try {
    const res = await axios.get("/roles/");
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить роли";
    return { data: null, error: detail };
  }
};

export const createRole = async (roleData) => {
  try {
    const res = await axios.post("/roles/", roleData);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось создать роль";
    return { data: null, error: detail };
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const res = await axios.patch(`/roles/${roleId}`, roleData);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось обновить роль";
    return { data: null, error: detail };
  }
};

export const deleteRole = async (roleId) => {
  try {
    const res = await axios.delete(`/roles/${roleId}`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось удалить роль";
    return { data: null, error: detail };
  }
};

// ========== BRANCHES ==========
export const getAllBranches = async () => {
  try {
    const res = await axios.get("/branches/");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить отделения";
    return { data: null, error: detail };
  }
};

export const createBranch = async (branchData) => {
  try {
    const res = await axios.post("/branches/", branchData);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось создать отделение";
    return { data: null, error: detail };
  }
};

export const updateBranch = async (branchId, branchData) => {
  try {
    const res = await axios.patch(`/branches/${branchId}`, branchData);
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось обновить отделение";
    return { data: null, error: detail };
  }
};

export const deleteBranch = async (branchId) => {
  try {
    const res = await axios.delete(`/branches/${branchId}`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось удалить отделение";
    return { data: null, error: detail };
  }
};

export const getBranchesStats = async () => {
  try {
    const res = await axios.get("/branches/stats/overview");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить статистику";
    return { data: null, error: detail };
  }
};

// ========== ADMIN PROCESSES ==========
export const getAllProcesses = async (status = null, processType = null) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (processType) params.process_type = processType;

    const res = await axios.get("/admin/processes/", { params });
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить процессы";
    return { data: null, error: detail };
  }
};

export const getPendingProcesses = async () => {
  try {
    const res = await axios.get("/admin/processes/pending");
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить процессы";
    return { data: null, error: detail };
  }
};

export const approveProcess = async (processId) => {
  try {
    const res = await axios.patch(`/admin/processes/${processId}/approve`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось одобрить процесс";
    return { data: null, error: detail };
  }
};

export const rejectProcess = async (processId) => {
  try {
    const res = await axios.patch(`/admin/processes/${processId}/reject`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось отклонить процесс";
    return { data: null, error: detail };
  }
};

export const completeProcess = async (processId) => {
  try {
    const res = await axios.patch(`/admin/processes/${processId}/complete`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось завершить процесс";
    return { data: null, error: detail };
  }
};

export const getProcessesStats = async () => {
  try {
    const res = await axios.get("/admin/processes/stats/overview");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить статистику";
    return { data: null, error: detail };
  }
};

// ========== ADMIN CLIENTS ==========
export const getAllClients = async (skip = 0, limit = 100) => {
  try {
    const res = await axios.get("/admin/clients/", { params: { skip, limit } });
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить клиентов";
    return { data: null, error: detail };
  }
};

export const searchClients = async (query) => {
  try {
    const res = await axios.get("/admin/clients/search", { params: { query } });
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось найти клиентов";
    return { data: null, error: detail };
  }
};

export const getClientById = async (clientId) => {
  try {
    const res = await axios.get(`/admin/clients/${clientId}`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить клиента";
    return { data: null, error: detail };
  }
};

export const getClientAccounts = async (clientId) => {
  try {
    const res = await axios.get(`/admin/clients/${clientId}/accounts`);
    return { data: res.data, error: null };
  } catch (err) {
    const detail = err.response?.data?.detail || "Не удалось получить счета";
    return { data: null, error: detail };
  }
};

export const getClientTransactions = async (clientId, limit = 50) => {
  try {
    const res = await axios.get(`/admin/clients/${clientId}/transactions`, {
      params: { limit },
    });
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить транзакции";
    return { data: null, error: detail };
  }
};

export const getClientsStats = async () => {
  try {
    const res = await axios.get("/admin/clients/stats/overview");
    return { data: res.data, error: null };
  } catch (err) {
    const detail =
      err.response?.data?.detail || "Не удалось получить статистику";
    return { data: null, error: detail };
  }
};
