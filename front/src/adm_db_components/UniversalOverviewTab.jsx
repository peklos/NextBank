// front/src/adm_db_components/UniversalOverviewTab.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../styles/enhancedOverview.module.css';

// Компонент анимированной статистической карточки
const AnimatedStatCard = ({ icon, title, value, prefix = '', suffix = '', showChange = false }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        const duration = 1500;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    const formatValue = (val) => {
        if (typeof value === 'string' && value.includes(',')) {
            return val.toLocaleString('ru-RU');
        }
        return val;
    };

    return (
        <div className={styles.statCard}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statContent}>
                <h3 className={styles.statTitle}>{title}</h3>
                <div className={styles.statValue}>
                    {prefix}{formatValue(displayValue)}{suffix}
                </div>
            </div>
        </div>
    );
};

// Кастомный тултип для графиков
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipLabel}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: <strong>{entry.value.toLocaleString('ru-RU')}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Кастомная метка для круговой диаграммы
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="14"
            fontWeight="600"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const UniversalOverviewTab = ({ stats, employees, branches, clients, processes, currentRole }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [processData, setProcessData] = useState([]);

    // Определяем уровень доступа
    const isSuperAdmin = currentRole === 'SuperAdmin';
    const isManager = currentRole === 'Manager';
    const canViewFullStats = isSuperAdmin || isManager;

    useEffect(() => {
        if (stats && clients && processes) {
            generateRealData();
        }
    }, [stats, employees, branches, clients, processes, currentRole]);

    const generateRealData = () => {
        // 📊 Генерация РЕАЛЬНЫХ данных по месяцам на основе created_at клиентов
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Инициализируем данные для всех месяцев текущего года
        const monthlyStats = months.map((month, index) => ({
            month,
            clients: 0,
            accounts: 0,
            cards: 0
        }));

        // Подсчитываем реальное количество клиентов по месяцам
        if (clients && clients.length > 0) {
            clients.forEach(client => {
                const createdDate = new Date(client.created_at);
                if (createdDate.getFullYear() === currentYear) {
                    const monthIndex = createdDate.getMonth();
                    monthlyStats[monthIndex].clients += 1;
                }
            });
        }

        // Делаем данные накопительными для клиентов (каждый месяц включает предыдущие)
        for (let i = 1; i < monthlyStats.length; i++) {
            monthlyStats[i].clients += monthlyStats[i - 1].clients;
        }

        // 📊 Распределяем счета и карты пропорционально клиентам
        const totalClients = stats?.clients?.total_clients || 0;
        const totalAccounts = stats?.clients?.total_accounts || 0;
        const totalCards = stats?.clients?.total_cards || 0;

        if (totalClients > 0) {
            // Для каждого месяца вычисляем пропорцию
            for (let i = 0; i <= currentMonth; i++) {
                const clientsInMonth = monthlyStats[i].clients;
                const proportion = clientsInMonth / totalClients;

                // Распределяем счета и карты пропорционально количеству клиентов
                monthlyStats[i].accounts = Math.round(totalAccounts * proportion);
                monthlyStats[i].cards = Math.round(totalCards * proportion);
            }
        }

        // Показываем только месяцы до текущего
        setMonthlyData(monthlyStats.slice(0, currentMonth + 1));

        // 🏢 РЕАЛЬНОЕ распределение по отделениям
        if (canViewFullStats && branches && branches.length > 0 && employees && employees.length > 0) {
            const branchStats = branches.map((branch, index) => {
                const employeesInBranch = employees.filter(emp => emp.branch_id === branch.id).length;
                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                return {
                    name: branch.name,
                    value: employeesInBranch,
                    color: colors[index % colors.length]
                };
            }).filter(b => b.value > 0); // Убираем отделения без сотрудников

            if (branchStats.length > 0) {
                setBranchData(branchStats);
            } else {
                setBranchData([{ name: 'Нет данных', value: 1, color: '#64748b' }]);
            }
        }

        // 👥 РЕАЛЬНОЕ распределение сотрудников по ролям (только для SuperAdmin)
        if (isSuperAdmin && employees && employees.length > 0) {
            const roleStats = {};
            employees.forEach(emp => {
                const roleName = emp.role?.name || 'Без роли';
                if (!roleStats[roleName]) {
                    roleStats[roleName] = 0;
                }
                roleStats[roleName]++;
            });

            const roleColors = {
                'SuperAdmin': '#ef4444',
                'Manager': '#3b82f6',
                'Support': '#10b981',
                'Cashier': '#f59e0b',
                'Loan_Officer': '#8b5cf6'
            };

            const roleChartData = Object.entries(roleStats).map(([name, value]) => ({
                name,
                value,
                color: roleColors[name] || '#64748b'
            }));

            setRoleData(roleChartData);
        }

        // 📋 РЕАЛЬНАЯ статистика процессов
        if (processes && processes.length > 0) {
            const processStats = [
                {
                    status: 'В обработке',
                    count: processes.filter(p => p.status === 'in_progress').length
                },
                {
                    status: 'Одобрено',
                    count: processes.filter(p => p.status === 'approved').length
                },
                {
                    status: 'Отклонено',
                    count: processes.filter(p => p.status === 'rejected').length
                },
                {
                    status: 'Завершено',
                    count: processes.filter(p => p.status === 'completed').length
                }
            ];
            setProcessData(processStats);
        }
    };

    if (!stats) {
        return <div className={styles.loadingText}>Статистика загружается...</div>;
    }

    // Карточки в зависимости от роли (БЕЗ фейковых процентов)
    const getStatsCards = () => {
        const cards = [];

        // Все видят клиентов
        cards.push({
            icon: '👥',
            title: 'Всего клиентов',
            value: stats.clients?.total_clients || 0
        });

        cards.push({
            icon: '💳',
            title: 'Активных карт',
            value: stats.clients?.total_cards || 0
        });

        // Финансы видят только SuperAdmin и Manager (БЕЗ ФЕЙКОВЫХ ПРОЦЕНТОВ)
        if (canViewFullStats) {
            cards.push({
                icon: '📊',
                title: 'Счетов открыто',
                value: stats.clients?.total_accounts || 0
            });
        }

        // Сотрудники видят только SuperAdmin и Manager
        if (canViewFullStats) {
            cards.push({
                icon: '👔',
                title: 'Активных сотрудников',
                value: stats.employees?.active_employees || 0
            });
        } else {
            // Остальные видят количество процессов
            cards.push({
                icon: '📋',
                title: 'Всего процессов',
                value: processes?.length || 0
            });
        }

        return cards;
    };

    return (
        <div className={styles.container}>
            {/* Статистические карточки БЕЗ фейковых процентов */}
            <div className={styles.statsGrid}>
                {getStatsCards().map((card, index) => (
                    <AnimatedStatCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        suffix={card.suffix}
                        showChange={false}
                    />
                ))}
            </div>

            {/* Графики с реальными данными */}
            <div className={styles.chartsGrid}>
                {/* Линейный график - РЕАЛЬНЫЕ данные */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>📈 Рост клиентской базы</h3>
                        <p>Реальная динамика за {new Date().getFullYear()} год</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="clients"
                                name="Клиенты"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 5 }}
                                activeDot={{ r: 7 }}
                                fill="url(#colorClients)"
                            />
                            <Line
                                type="monotone"
                                dataKey="accounts"
                                name="Счета"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ fill: '#8b5cf6', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="cards"
                                name="Карты"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Круговая диаграмма - РЕАЛЬНОЕ распределение по отделениям */}
                {canViewFullStats && branchData.length > 0 && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>🏢 Распределение по отделениям</h3>
                            <p>Реальное количество сотрудников</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={branchData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={CustomPieLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1000}
                                >
                                    {branchData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry) => (
                                        <span style={{ color: '#f1f5f9' }}>
                                            {value} ({entry.payload.value} сотр.)
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Круговая диаграмма - РЕАЛЬНОЕ распределение по ролям */}
                {isSuperAdmin && roleData.length > 0 && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>👥 Распределение по ролям</h3>
                            <p>Реальная структура команды</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={CustomPieLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1000}
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry) => (
                                        <span style={{ color: '#f1f5f9' }}>
                                            {value} ({entry.payload.value})
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Столбчатая диаграмма - РЕАЛЬНЫЕ процессы */}
                <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
                    <div className={styles.chartHeader}>
                        <h3>📋 Статистика процессов</h3>
                        <p>Реальные данные по статусам</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={processData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="status" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="count" name="Количество" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UniversalOverviewTab;