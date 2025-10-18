import React, { useState } from 'react';
import styles from '../styles/admin.module.css';
import ClientDetailsModal from './ClientDetailsModal';

const ClientsTab = ({ clients }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredClients = clients.filter(
        (client) =>
            client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetails = (client) => {
        setSelectedClient(client);
        setShowDetailsModal(true);
    };

    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Управление клиентами</h2>
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
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Дата регистрации</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{`${client.last_name} ${client.first_name} ${client.patronymic || ""}`}</td>
                                <td>{client.email}</td>
                                <td>{client.phone || "—"}</td>
                                <td>{new Date(client.created_at).toLocaleDateString("ru-RU")}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.btnView}
                                            onClick={() => handleViewDetails(client)}
                                            title="Просмотр"
                                        >
                                            👁️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showDetailsModal && selectedClient && (
                <ClientDetailsModal
                    client={selectedClient}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
        </div>
    );
};

export default ClientsTab;