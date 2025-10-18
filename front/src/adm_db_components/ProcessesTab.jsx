import React, { useState } from 'react';
import styles from '../styles/admin.module.css';

const ProcessesTab = ({ processes, onApprove, onReject, onComplete, canManage }) => {
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredProcesses =
        filterStatus === "all" ? processes : processes.filter((p) => p.status === filterStatus);

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            in_progress: styles.statusPending,
            approved: styles.statusSuccess,
            rejected: styles.statusDanger,
            completed: styles.statusSuccess,
        };
        return statusMap[status] || styles.statusPending;
    };

    const getStatusText = (status) => {
        const statusMap = {
            in_progress: "В обработке",
            approved: "Одобрен",
            rejected: "Отклонен",
            completed: "Завершен",
        };
        return statusMap[status] || status;
    };

    const getProcessTypeText = (type) => {
        const typeMap = {
            loan_application: "Заявка на кредит",
            card_issue: "Выпуск карты",
            account_opening: "Открытие счета",
        };
        return typeMap[type] || type;
    };

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление процессами</h2>
                <div className={styles.filterButtons}>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "all" ? styles.filterActive : ""}`}
                        onClick={() => setFilterStatus("all")}
                    >
                        Все
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "in_progress" ? styles.filterActive : ""
                            }`}
                        onClick={() => setFilterStatus("in_progress")}
                    >
                        В обработке
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "approved" ? styles.filterActive : ""
                            }`}
                        onClick={() => setFilterStatus("approved")}
                    >
                        Одобренные
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "rejected" ? styles.filterActive : ""
                            }`}
                        onClick={() => setFilterStatus("rejected")}
                    >
                        Отклоненные
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тип</th>
                            <th>Клиент</th>
                            <th>Статус</th>
                            <th>Дата создания</th>
                            {canManage && <th>Действия</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcesses.map((process) => (
                            <tr key={process.id}>
                                <td>{process.id}</td>
                                <td>{getProcessTypeText(process.process_type)}</td>
                                <td>ID: {process.client_id}</td>
                                <td>
                                    <span
                                        className={`${styles.statusBadge} ${getStatusBadgeClass(process.status)}`}
                                    >
                                        {getStatusText(process.status)}
                                    </span>
                                </td>
                                <td>{new Date(process.created_at).toLocaleDateString("ru-RU")}</td>
                                {canManage && (
                                    <td>
                                        <div className={styles.actionButtons}>
                                            {process.status === "in_progress" && (
                                                <>
                                                    <button
                                                        className={styles.btnApprove}
                                                        onClick={() => {
                                                            if (window.confirm("Одобрить этот процесс?")) {
                                                                onApprove(process.id);
                                                            }
                                                        }}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        className={styles.btnReject}
                                                        onClick={() => {
                                                            if (window.confirm("Отклонить этот процесс?")) {
                                                                onReject(process.id);
                                                            }
                                                        }}
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            )}
                                            {process.status === "approved" && (
                                                <button
                                                    className={styles.btnComplete}
                                                    onClick={() => {
                                                        if (window.confirm("Завершить этот процесс?")) {
                                                            onComplete(process.id);
                                                        }
                                                    }}
                                                >
                                                    ✔️
                                                </button>
                                            )}
                                            {(process.status === "rejected" || process.status === "completed") && (
                                                <span className={styles.noActions}>—</span>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcessesTab;