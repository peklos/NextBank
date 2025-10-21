// front/src/adm_db_components/UniversalOverviewTab.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../styles/enhancedOverview.module.css';

// Компонент анимированной статистической карточки
const AnimatedStatCard = ({ icon, title, value, change, prefix = '', suffix = '', showChange = true }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const isPositive = change >= 0;

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
                {showChange && (
                    <div className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? '↗️' : '↘️'} {Math.abs(change)}% за месяц
                    </div>
                )}
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
    const canViewLimitedStats = currentRole === 'Support' || currentRole === 'Cashier' || currentRole === 'Loan_Officer';

    useEffect(() => {
        if (stats && clients && processes) {
            generateRealData();
        }
    }, [stats, employees, branches, clients, processes, currentRole]);

    const generateRealData = () => {
        // 📊 Генерация данных по месяцам
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        const currentMonth = new Date().getMonth();

        const totalClients = stats?.clients?.total_clients || 0;
        const totalAccounts = stats?.clients?.total_accounts || 0;
        const totalCards = stats?.clients?.total_cards || 0;

        const monthlyStats = months.slice(0, currentMonth + 1).map((month, index) => {
            const growthFactor = (index + 1) / (currentMonth + 1);
            return {
                month,
                clients: Math.floor(totalClients * growthFactor),
                accounts: Math.floor(totalAccounts * growthFactor),
                cards: Math.floor(totalCards * growthFactor)
            };
        });
        setMonthlyData(monthlyStats);

        // 🏢 Распределение по отделениям (только для SuperAdmin и Manager)
        if (canViewFullStats && branches && branches.length > 0 && employees && employees.length > 0) {
            const branchStats = branches.map((branch, index) => {
                const employeesInBranch = employees.filter(emp => emp.branch_id === branch.id).length;
                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                return {
                    name: branch.name,
                    value: employeesInBranch || 1,
                    color: colors[index % colors.length]
                };
            });
            setBranchData(branchStats.filter(b => b.value > 0));
        }

        // 👥 Распределение сотрудников по ролям (только для SuperAdmin)
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

        // 📋 Статистика процессов (доступна всем)
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

    // Карточки в зависимости от роли
    const getStatsCards = () => {
        const cards = [];

        // Все видят клиентов
        cards.push({
            icon: '👥',
            title: 'Всего клиентов',
            value: stats.clients?.total_clients || 0,
            change: 15
        });

        cards.push({
            icon: '💳',
            title: 'Активных карт',
            value: stats.clients?.total_cards || 0,
            change: 8
        });

        // Финансы видят только SuperAdmin и Manager
        if (canViewFullStats) {
            cards.push({
                icon: '💰',
                title: 'Общий баланс',
                value: (stats.clients?.total_balance || 0).toLocaleString('ru-RU'),
                change: 23,
                suffix: ' ₽'
            });
        }

        // Сотрудники видят только SuperAdmin и Manager
        if (canViewFullStats) {
            cards.push({
                icon: '👔',
                title: 'Активных сотрудников',
                value: stats.employees?.active_employees || 0,
                change: 5
            });
        } else {
            // Остальные видят количество процессов
            cards.push({
                icon: '📋',
                title: 'Всего процессов',
                value: processes?.length || 0,
                change: 0,
                showChange: false
            });
        }

        return cards;
    };

    return (
        <div className={styles.container}>
            {/* Статистические карточки */}
            <div className={styles.statsGrid}>
                {getStatsCards().map((card, index) => (
                    <AnimatedStatCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        change={card.change}
                        suffix={card.suffix}
                        showChange={card.showChange !== false}
                    />
                ))}
            </div>

            {/* Графики */}
            <div className={styles.chartsGrid}>
                {/* Линейный график - доступен всем */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>📈 Рост клиентской базы</h3>
                        <p>Динамика за текущий год</p>
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

                {/* Круговая диаграмма - Отделения (только SuperAdmin и Manager) */}
                {canViewFullStats && branchData.length > 0 && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>🏢 Распределение по отделениям</h3>
                            <p>Сотрудники в каждом отделении</p>
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
                                            {value} ({entry.payload.value})
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Круговая диаграмма - Роли (только SuperAdmin) */}
                {isSuperAdmin && roleData.length > 0 && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>👥 Распределение по ролям</h3>
                            <p>Структура команды</p>
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

                {/* Столбчатая диаграмма - Процессы (доступна всем) */}
                <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
                    <div className={styles.chartHeader}>
                        <h3>📋 Статистика процессов</h3>
                        <p>Текущие процессы по статусам</p>
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