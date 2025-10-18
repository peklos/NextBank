import React from 'react';
import styles from '../styles/admin.module.css';

const ClientDetailsModal = ({ client, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Информация о клиенте</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.clientDetails}>
                        <div className={styles.detailGroup}>
                            <h3 className={styles.detailGroupTitle}>Основная информация</h3>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>ID:</span>
                                <span className={styles.detailValue}>{client.id}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>ФИО:</span>
                                <span className={styles.detailValue}>
                                    {`${client.last_name} ${client.first_name} ${client.patronymic || ""}`}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span className={styles.detailValue}>{client.email}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Телефон:</span>
                                <span className={styles.detailValue}>{client.phone || "—"}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Дата регистрации:</span>
                                <span className={styles.detailValue}>
                                    {new Date(client.created_at).toLocaleDateString("ru-RU")}
                                </span>
                            </div>
                        </div>

                        {client.personal_info && (
                            <div className={styles.detailGroup}>
                                <h3 className={styles.detailGroupTitle}>Персональные данные</h3>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Паспорт:</span>
                                    <span className={styles.detailValue}>
                                        {client.personal_info.passport_number || "—"}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Адрес:</span>
                                    <span className={styles.detailValue}>
                                        {client.personal_info.address || "—"}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Дата рождения:</span>
                                    <span className={styles.detailValue}>
                                        {client.personal_info.birth_date
                                            ? new Date(client.personal_info.birth_date).toLocaleDateString("ru-RU")
                                            : "—"}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Занятость:</span>
                                    <span className={styles.detailValue}>
                                        {client.personal_info.employment_status || "—"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsModal;