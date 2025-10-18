import React, { useState } from 'react';
import styles from '../styles/admin.module.css';
import RoleFormModal from './RoleFormModal';

const RolesTab = ({ roles, onCreate, onUpdate, onDelete }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление ролями</h2>
                <button className={styles.btnCreate} onClick={() => setShowCreateModal(true)}>
                    <span className={styles.btnIcon}>+</span>
                    Создать роль
                </button>
            </div>

            <div className={styles.cardsGrid}>
                {roles.map((role) => (
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

export default RolesTab;