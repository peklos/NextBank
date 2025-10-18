import React, { useState } from 'react';
import styles from '../styles/admin.module.css';
import BranchFormModal from './BranchFormModal';

const BranchesTab = ({ branches, onCreate, onUpdate, onDelete }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление отделениями</h2>
                <button className={styles.btnCreate} onClick={() => setShowCreateModal(true)}>
                    <span className={styles.btnIcon}>+</span>
                    Создать отделение
                </button>
            </div>

            <div className={styles.cardsGrid}>
                {branches.map((branch) => (
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
                                }}
                            >
                                ✏️ Редактировать
                            </button>
                            <button
                                className={styles.btnDelete}
                                onClick={() => {
                                    if (window.confirm(`Удалить отделение "${branch.name}"?`)) {
                                        onDelete(branch.id);
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
                <BranchFormModal
                    title="Создать отделение"
                    onClose={() => setShowCreateModal(false)}
                    onSave={async (data) => {
                        const success = await onCreate(data);
                        if (success) setShowCreateModal(false);
                    }}
                />
            )}

            {showEditModal && selectedBranch && (
                <BranchFormModal
                    title="Редактировать отделение"
                    initialData={selectedBranch}
                    onClose={() => setShowEditModal(false)}
                    onSave={async (data) => {
                        const success = await onUpdate(selectedBranch.id, data);
                        if (success) setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default BranchesTab;