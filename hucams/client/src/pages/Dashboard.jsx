import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Zap, Droplets, Wallet, AlertTriangle, TrendingDown, Users } from 'lucide-react';
import { getUser } from '../utils/auth';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const user = getUser();
    const role = user?.role || 'ADMIN';

    const stats = [
        { label: 'Electricity (Today)', value: '450 kWh', icon: Zap, color: 'text-yellow-500', trend: '-2.4%' },
        { label: 'Water (Today)', value: '1,200 L', icon: Droplets, color: 'text-blue-500', trend: '+0.5%' },
        { label: 'Residents Active', value: '482', icon: Users, color: 'text-indigo-500', trend: 'Full' },
        { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-red-500', trend: 'Requires action' },
    ];

    const trendData = {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
        datasets: [
            {
                label: 'Electricity (kWh)',
                data: [30, 45, 85, 120, 95, 140, 60],
                borderColor: '#EAB308',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const wastingRoomsData = {
        labels: ['Room 102', 'Room 305', 'Room 211', 'Room 106', 'Room 402'],
        datasets: [
            {
                label: 'Excess Consumption (%)',
                data: [45, 38, 30, 25, 20],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(239, 68, 68, 0.4)',
                    'rgba(239, 68, 68, 0.3)',
                    'rgba(239, 68, 68, 0.2)',
                ],
                borderRadius: 8,
            },
        ],
    };

    return (
        <Layout role={role}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hostel Overview</h1>
                    <p className="text-gray-500">Real-time monitoring and utility insights.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-700">System Live</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('-') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Consumption Trends</h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-bold uppercase">Peak Usage Expected at 9PM</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <Line
                            data={trendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { borderDash: [2, 4] } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Top Wasting Rooms</h3>
                        <TrendingDown size={20} className="text-red-500" />
                    </div>
                    <div className="h-72">
                        <Bar
                            data={wastingRoomsData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                indexAxis: 'y',
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { borderDash: [2, 4] }, title: { display: true, text: 'Excess %' } },
                                    y: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                    <p className="mt-4 text-xs text-center text-gray-400 italic">Data reflects anomaly detection for the last 24 hours.</p>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
