import React, { useState } from 'react';
import styles from '../styles/admin.module.css';
import EmployeeCreateModal from './EmployeeCreateModal';
import EmployeeEditModal from './EmployeeEditModal';

const EmployeesTab = ({
    employees,
    roles,
    branches,
    onCreate,
    onUpdate,
    onDelete,
    onToggleActive,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const filteredEmployees = employees.filter(
        (emp) =>
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
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                    <button className={styles.btnCreate} onClick={() => setShowCreateModal(true)}>
                        <span className={styles.btnIcon}>+</span>
                        Добавить сотрудника
                    </button>
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
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{`${emp.last_name} ${emp.first_name} ${emp.patronymic || ""}`}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role?.name || "—"}</td>
                                <td>{emp.branch?.name || "—"}</td>
                                <td>
                                    <span
                                        className={`${styles.statusBadge} ${emp.is_active ? styles.statusActive : styles.statusInactive
                                            }`}
                                    >
                                        {emp.is_active ? "Активен" : "Неактивен"}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.btnEdit} onClick={() => handleEdit(emp)}>
                                            ✏️
                                        </button>
                                        <button className={styles.btnToggle} onClick={() => onToggleActive(emp.id)}>
                                            {emp.is_active ? "🔒" : "🔓"}
                                        </button>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => {
                                                if (window.confirm("Удалить сотрудника?")) {
                                                    onDelete(emp.id);
                                                }
                                            }}
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

            {showCreateModal && (
                <EmployeeCreateModal
                    roles={roles}
                    branches={branches}
                    onClose={() => setShowCreateModal(false)}
                    onSave={async (data) => {
                        const success = await onCreate(data);
                        if (success) setShowCreateModal(false);
                    }}
                />
            )}

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

export default EmployeesTab;