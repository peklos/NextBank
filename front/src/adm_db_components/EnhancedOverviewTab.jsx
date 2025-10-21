// front/src/adm_db_components/EnhancedOverviewTab.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../styles/enhancedOverview.module.css';

// Генерация данных для графиков
const generateMonthlyData = (stats) => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const currentMonth = new Date().getMonth();

    return months.slice(0, currentMonth + 1).map((month, index) => ({
        month,
        clients: Math.floor(stats?.clients?.total_clients * 0.6 + Math.random() * 200 + index * 50),
        accounts: Math.floor(stats?.clients?.total_accounts * 0.5 + Math.random() * 150 + index * 40),
        cards: Math.floor(stats?.clients?.total_cards * 0.4 + Math.random() * 100 + index * 30)
    }));
};

const generateBranchData = () => [
    { name: 'Москва', value: 450, color: '#3b82f6' },
    { name: 'Санкт-Петербург', value: 320, color: '#8b5cf6' },
    { name: 'Новосибирск', value: 180, color: '#ec4899' },
    { name: 'Екатеринбург', value: 150, color: '#f59e0b' },
    { name: 'Казань', value: 134, color: '#10b981' }
];

const generateLoanData = () => {
    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    return quarters.map(quarter => ({
        quarter,
        issued: Math.floor(50 + Math.random() * 50),
        approved: Math.floor(60 + Math.random() * 60),
        rejected: Math.floor(10 + Math.random() * 20)
    }));
};

// Компонент анимированной статистической карточки
const AnimatedStatCard = ({ icon, title, value, change, prefix = '', suffix = '' }) => {
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
                <div className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? '↗️' : '↘️'} {Math.abs(change)}% за месяц
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

const EnhancedOverviewTab = ({ stats }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [branchData] = useState(generateBranchData());
    const [loanData] = useState(generateLoanData());

    useEffect(() => {
        if (stats) {
            setMonthlyData(generateMonthlyData(stats));
        }
    }, [stats]);

    if (!stats) {
        return <div className={styles.loadingText}>Статистика загружается...</div>;
    }

    // Подготовка данных для карточек
    const cardStats = {
        totalClients: {
            value: stats.clients.total_clients,
            change: 15,
            icon: '👥'
        },
        activeCards: {
            value: stats.clients.total_cards,
            change: 8,
            icon: '💳'
        },
        totalBalance: {
            value: stats.clients.total_balance.toLocaleString('ru-RU'),
            change: 23,
            icon: '💰',
            suffix: ' ₽'
        },
        activeEmployees: {
            value: stats.employees.active_employees,
            change: 5,
            icon: '👔'
        }
    };

    return (
        <div className={styles.container}>
            {/* Статистические карточки */}
            <div className={styles.statsGrid}>
                <AnimatedStatCard
                    icon={cardStats.totalClients.icon}
                    title="Всего клиентов"
                    value={cardStats.totalClients.value}
                    change={cardStats.totalClients.change}
                />
                <AnimatedStatCard
                    icon={cardStats.activeCards.icon}
                    title="Активных карт"
                    value={cardStats.activeCards.value}
                    change={cardStats.activeCards.change}
                />
                <AnimatedStatCard
                    icon={cardStats.totalBalance.icon}
                    title="Общий баланс"
                    value={cardStats.totalBalance.value}
                    change={cardStats.totalBalance.change}
                    suffix={cardStats.totalBalance.suffix}
                />
                <AnimatedStatCard
                    icon={cardStats.activeEmployees.icon}
                    title="Активных сотрудников"
                    value={cardStats.activeEmployees.value}
                    change={cardStats.activeEmployees.change}
                />
            </div>

            {/* Графики */}
            <div className={styles.chartsGrid}>
                {/* Линейный график роста */}
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

                {/* Круговая диаграмма */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>🗺️ Распределение по городам</h3>
                        <p>Клиентская база по регионам</p>
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

                {/* Столбчатая диаграмма */}
                <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
                    <div className={styles.chartHeader}>
                        <h3>📊 Статистика кредитов</h3>
                        <p>Выдача кредитов по кварталам</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={loanData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="quarter" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="issued" name="Выдано" fill="#10b981" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="approved" name="Одобрено" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="rejected" name="Отклонено" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EnhancedOverviewTab;