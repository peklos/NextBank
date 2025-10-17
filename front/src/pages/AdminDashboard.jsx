import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/admin.module.css';
import {
    getAllEmployees,
    getAllRoles,
    getAllBranches,
    getAllClients,
    getPendingProcesses,
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
    completeProcess
} from '../api/admin';
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
    updateProcess
} from '../features/admin/adminSlice';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);

        const [
            employeesRes,
            rolesRes,
            branchesRes,
            clientsRes,
            processesRes,
            employeesStatsRes,
            clientsStatsRes,
            processesStatsRes
        ] = await Promise.all([
            getAllEmployees(),
            getAllRoles(),
            getAllBranches(),
            getAllClients(),
            getPendingProcesses(),
            getEmployeesStats(),
            getClientsStats(),
            getProcessesStats()
        ]);

        if (employeesRes.data) dispatch(setEmployees(employeesRes.data));
        if (rolesRes.data) dispatch(setRoles(rolesRes.data));
        if (branchesRes.data) dispatch(setBranches(branchesRes.data));
        if (clientsRes.data) dispatch(setClients(clientsRes.data));
        if (processesRes.data) dispatch(setProcesses(processesRes.data));

        if (employeesStatsRes.data && clientsStatsRes.data && processesStatsRes.data) {
            dispatch(setStats({
                employees: employeesStatsRes.data,
                clients: clientsStatsRes.data,
                processes: processesStatsRes.data
            }));
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className={styles.adminContainer}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
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
                            Управление системой NextBank
                        </p>
                    </div>
                </header>

                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Обзор
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'employees' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('employees')}
                    >
                        👥 Сотрудники ({admin.employees.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'roles' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('roles')}
                    >
                        🎭 Роли ({admin.roles.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'branches' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('branches')}
                    >
                        🏢 Отделения ({admin.branches.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'clients' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        👤 Клиенты ({admin.clients.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'processes' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('processes')}
                    >
                        📋 Процессы ({admin.processes.length})
                    </button>
                </div>

                <main className={styles.tabContent}>
                    {activeTab === 'overview' && <OverviewTab stats={admin.stats} />}
                    {activeTab === 'employees' && (
                        <EmployeesTab
                            employees={admin.employees}
                            roles={admin.roles}
                            branches={admin.branches}
                            onUpdate={(id, data) => handleEmployeeUpdate(id, data)}
                            onDelete={(id) => handleEmployeeDelete(id)}
                            onToggleActive={(id) => handleEmployeeToggle(id)}
                            showNotification={showNotification}
                        />
                    )}
                    {activeTab === 'roles' && (
                        <RolesTab
                            roles={admin.roles}
                            onCreate={(data) => handleRoleCreate(data)}
                            onUpdate={(id, data) => handleRoleUpdate(id, data)}
                            onDelete={(id) => handleRoleDelete(id)}
                            showNotification={showNotification}
                        />
                    )}
                    {activeTab === 'branches' && (
                        <BranchesTab
                            branches={admin.branches}
                            onCreate={(data) => handleBranchCreate(data)}
                            onUpdate={(id, data) => handleBranchUpdate(id, data)}
                            onDelete={(id) => handleBranchDelete(id)}
                            showNotification={showNotification}
                        />
                    )}
                    {activeTab === 'clients' && <ClientsTab clients={admin.clients} />}
                    {activeTab === 'processes' && (
                        <ProcessesTab
                            processes={admin.processes}
                            onApprove={(id) => handleProcessApprove(id)}
                            onReject={(id) => handleProcessReject(id)}
                            onComplete={(id) => handleProcessComplete(id)}
                            showNotification={showNotification}
                        />
                    )}
                </main>
            </div>
        </div>
    );

    // Handlers
    async function handleRoleCreate(data) {
        const res = await createRole(data);
        if (res.data) {
            dispatch(addRole(res.data));
            showNotification('Роль успешно создана', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleRoleUpdate(id, data) {
        const res = await updateRole(id, data);
        if (res.data) {
            dispatch(updateRoleAction(res.data));
            showNotification('Роль успешно обновлена', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleRoleDelete(id) {
        const res = await deleteRole(id);
        if (res.data) {
            dispatch(removeRole(id));
            showNotification('Роль успешно удалена', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleBranchCreate(data) {
        const res = await createBranch(data);
        if (res.data) {
            dispatch(addBranch(res.data));
            showNotification('Отделение успешно создано', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleBranchUpdate(id, data) {
        const res = await updateBranch(id, data);
        if (res.data) {
            dispatch(updateBranchAction(res.data));
            showNotification('Отделение успешно обновлено', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleBranchDelete(id) {
        const res = await deleteBranch(id);
        if (res.data) {
            dispatch(removeBranch(id));
            showNotification('Отделение успешно удалено', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleEmployeeUpdate(id, data) {
        const res = await updateEmployee(id, data);
        if (res.data) {
            dispatch(updateEmployeeAction(res.data));
            showNotification('Сотрудник успешно обновлен', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleEmployeeDelete(id) {
        const res = await deleteEmployee(id);
        if (res.data) {
            dispatch(removeEmployee(id));
            showNotification('Сотрудник успешно удален', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleEmployeeToggle(id) {
        const res = await toggleEmployeeActive(id);
        if (res.data) {
            const updatedRes = await getAllEmployees();
            if (updatedRes.data) dispatch(setEmployees(updatedRes.data));
            showNotification(res.data.message, 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleProcessApprove(id) {
        const res = await approveProcess(id);
        if (res.data) {
            dispatch(updateProcess(res.data));
            showNotification('Процесс одобрен', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleProcessReject(id) {
        const res = await rejectProcess(id);
        if (res.data) {
            dispatch(updateProcess(res.data));
            showNotification('Процесс отклонен', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }

    async function handleProcessComplete(id) {
        const res = await completeProcess(id);
        if (res.data) {
            dispatch(updateProcess(res.data));
            showNotification('Процесс завершен', 'success');
            return true;
        } else {
            showNotification(res.error, 'error');
            return false;
        }
    }
};

// ========== OVERVIEW TAB ==========
const OverviewTab = ({ stats }) => {
    if (!stats) return <div className={styles.loadingText}>Статистика загружается...</div>;

    return (
        <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <h3 className={styles.statTitle}>Сотрудники</h3>
                <div className={styles.statValue}>{stats.employees.total_employees}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Активных:</span>
                        <span className={styles.statSuccess}>{stats.employees.active_employees}</span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Неактивных:</span>
                        <span className={styles.statWarning}>{stats.employees.inactive_employees}</span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>👤</div>
                <h3 className={styles.statTitle}>Клиенты</h3>
                <div className={styles.statValue}>{stats.clients.total_clients}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Счетов:</span>
                        <span>{stats.clients.total_accounts}</span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Карт:</span>
                        <span>{stats.clients.total_cards}</span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Кредитов:</span>
                        <span>{stats.clients.total_loans}</span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <h3 className={styles.statTitle}>Финансы</h3>
                <div className={styles.statValue}>
                    {stats.clients.total_balance.toLocaleString('ru-RU')} ₽
                </div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>Долг:</span>
                        <span className={styles.statDanger}>
                            {stats.clients.total_debt.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>
                    <div className={styles.statDetail}>
                        <span>Активных кредитов:</span>
                        <span>{stats.clients.active_loans}</span>
                    </div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <h3 className={styles.statTitle}>Процессы</h3>
                <div className={styles.statValue}>{stats.processes.total_processes}</div>
                <div className={styles.statDetails}>
                    <div className={styles.statDetail}>
                        <span>В ожидании:</span>
                        <span className={styles.statWarning}>{stats.processes.pending_processes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========== EMPLOYEES TAB ==========
const EmployeesTab = ({ employees, roles, branches, onUpdate, onDelete, onToggleActive, showNotification }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const filteredEmployees = employees.filter(emp =>
        emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление сотрудниками</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Поиск по имени или email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <span className={styles.searchIcon}>🔍</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Отделение</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{`${emp.last_name} ${emp.first_name} ${emp.patronymic || ''}`}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role?.name || 'Не указана'}</td>
                                <td>{emp.branch?.name || 'Не указано'}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${emp.is_active ? styles.statusActive : styles.statusInactive}`}>
                                        {emp.is_active ? 'Активен' : 'Неактивен'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.btnEdit}
                                            onClick={() => handleEdit(emp)}
                                            title="Редактировать"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.btnToggle}
                                            onClick={() => onToggleActive(emp.id)}
                                            title={emp.is_active ? 'Деактивировать' : 'Активировать'}
                                        >
                                            {emp.is_active ? '🔒' : '🔓'}
                                        </button>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => {
                                                if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
                                                    onDelete(emp.id);
                                                }
                                            }}
                                            title="Удалить"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <EmployeeEditModal
                    employee={selectedEmployee}
                    roles={roles}
                    branches={branches}
                    onClose={() => setShowEditModal(false)}
                    onSave={async (data) => {
                        const success = await onUpdate(selectedEmployee.id, data);
                        if (success) setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

// ========== EMPLOYEE EDIT MODAL ==========
const EmployeeEditModal = ({ employee, roles, branches, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: employee.first_name,
        last_name: employee.last_name,
        patronymic: employee.patronymic || '',
        email: employee.email,
        role_id: employee.role_id,
        branch_id: employee.branch_id
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Редактировать сотрудника</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Имя</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Фамилия</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отчество</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formData.patronymic}
                            onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Роль</label>
                        <select
                            className={styles.formInput}
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                            required
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Отделение</label>
                        <select
                            className={styles.formInput}
                            value={formData.branch_id}
                            onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value) })}
                            required
                        >
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.btnSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ========== ROLES TAB ==========
const RolesTab = ({ roles, onCreate, onUpdate, onDelete, showNotification }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление ролями</h2>
                <button
                    className={styles.btnCreate}
                    onClick={() => setShowCreateModal(true)}
                >
                    <span className={styles.btnIcon}>+</span>
                    Создать роль
                </button>
            </div>

            <div className={styles.cardsGrid}>
                {roles.map(role => (
                    <div key={role.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{role.name}</h3>
                            <span className={styles.cardId}>ID: {role.id}</span>
                        </div>
                        <div className={styles.cardActions}>
                            <button
                                className={styles.btnEdit}
                                onClick={() => {
                                    setSelectedRole(role);
                                    setShowEditModal(true);
                                }}
                            >
                                ✏️ Редактировать
                            </button>
                            <button
                                className={styles.btnDelete}
                                onClick={() => {
                                    if (window.confirm(`Удалить роль "${role.name}"?`)) {
                                        onDelete(role.id);
                                    }
                                }}
                            >
                                🗑️ Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <RoleFormModal
                    title="Создать роль"
                    onClose={() => setShowCreateModal(false)}
                    onSave={async (data) => {
                        const success = await onCreate(data);
                        if (success) setShowCreateModal(false);
                    }}
                />
            )}

            {showEditModal && selectedRole && (
                <RoleFormModal
                    title="Редактировать роль"
                    initialData={selectedRole}
                    onClose={() => setShowEditModal(false)}
                    onSave={async (data) => {
                        const success = await onUpdate(selectedRole.id, data);
                        if (success) setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

// ========== ROLE FORM MODAL ==========
const RoleFormModal = ({ title, initialData = null, onClose, onSave }) => {
    const [name, setName] = useState(initialData?.name || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Название роли</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: Manager"
                            required
                        />
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.btnSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ========== BRANCHES TAB ==========
const BranchesTab = ({ branches, onCreate, onUpdate, onDelete, showNotification }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление отделениями</h2>
                <button
                    className={styles.btnCreate}
                    onClick={() => setShowCreateModal(true)}
                >
                    <span className={styles.btnIcon}>+</span>
                    Создать отделение
                </button>
            </div>

            <div className={styles.cardsGrid}>
                {branches.map(branch => (
                    <div key={branch.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{branch.name}</h3>
                            <span className={styles.cardId}>ID: {branch.id}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.cardDetail}>
                                <span className={styles.detailLabel}>📍 Адрес:</span>
                                <span className={styles.detailValue}>{branch.address}</span>
                            </div>
                            {branch.phone && (
                                <div className={styles.cardDetail}>
                                    <span className={styles.detailLabel}>📞 Телефон:</span>
                                    <span className={styles.detailValue}>{branch.phone}</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.cardActions}>
                            <button
                                className={styles.btnEdit}
                                onClick={() => {
                                    setSelectedBranch(branch);
                                    setShowEditModal(true);