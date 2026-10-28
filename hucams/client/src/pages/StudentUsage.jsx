import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Bar, Doughnut } from 'react-chartjs-2';
import { User as userIcon, Zap, Droplets, TrendingUp, Award, Sparkles } from 'lucide-react';
import { getUser } from '../utils/auth';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StudentUsage = () => {
    const user = getUser();
    const role = user?.role || 'STUDENT';
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    // Simulated Loading & Fetching Messages
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            // Fetch messages from "database" (localStorage for demo)
            const storedMessages = JSON.parse(localStorage.getItem('studentMessages') || '[]');
            setMessages(storedMessages);
        }, 800);
    }, []);

    // Mock Data for specific student room
    const myUsageData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'My Electricity (kWh)',
                data: [5, 4.2, 5.5, 6, 4.8, 7, 5.2],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4,
            },
        ],
    };

    const comparisonData = {
        labels: ['My Usage', 'Avg. Student Usage'],
        datasets: [
            {
                data: [37.7, 45], // Weekly total
                backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(209, 213, 219, 0.5)'],
                borderWidth: 0,
            },
        ],
    };

    if (loading) {
        return (
            <Layout role={role}>
                <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout role={role}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Usage Dashboard</h1>
                    <p className="text-gray-500 mt-2">Track your personal utility consumption and savings.</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Weekly Electricity</p>
                            <h3 className="text-2xl font-bold text-gray-800">37.7 kWh</h3>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">12% below average</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                            <Droplets size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Weekly Water</p>
                            <h3 className="text-2xl font-bold text-gray-800">850 L</h3>
                            <span className="text-xs text-gray-400">Average consumption</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Sustainability Score</p>
                            <h3 className="text-3xl font-bold mt-1">A+</h3>
                            <p className="text-xs text-indigo-200 mt-2">You are a top saver!</p>
                        </div>
                        <Award size={48} className="text-yellow-300 opacity-80" />
                    </div>
                </div>

                {/* AI Smart Savings Report */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={24} className="text-yellow-300" />
                        <h2 className="text-xl font-bold">AI Smart Savings Report</h2>
                        <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">Monthly Analysis</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Energy Saved</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">128 kWh</span>
                                <span className="text-xs text-green-300">▲ 15%</span>
                            </div>
                            <p className="text-[10px] text-blue-200 mt-2 italic">vs. 150 kWh last month</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Cost Reduction</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">₹1,142</span>
                                <span className="text-xs text-green-300">▼ Savings</span>
                            </div>
                            <p className="text-[10px] text-blue-200 mt-2 italic">Based on tier 2 tariff</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">CO2 Mitigated</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">92 kg</span>
                                <Sparkles size={14} className="text-yellow-300 ml-1" />
                            </div>
                            <p className="text-[10px] text-blue-200 mt-2 italic">Equal to 4 trees planted</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-green-300" />
                                <span className="text-xs font-semibold">AI Prediction</span>
                            </div>
                            <p className="text-sm leading-snug">"Keep using ECO mode at night to save another <span className="font-bold text-yellow-300">₹200</span> by month end."</p>
                        </div>
                    </div>
                </div>

                {/* Notifications Section - Added for Admin Messages */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <userIcon size={20} className="text-blue-500" />
                            Management Notifications
                        </h3>
                        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {messages.length} New
                        </span>
                    </div>
                    {messages.length > 0 ? (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className="p-4 bg-blue-50 border border-blue-100 rounded-xl relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-blue-900">{msg.subject}</h4>
                                        <span className="text-xs text-blue-400">{msg.date}</span>
                                    </div>
                                    <p className="text-sm text-blue-800 whitespace-pre-line">{msg.content}</p>
                                    <div className="mt-2 text-xs font-medium text-blue-500 uppercase tracking-wide">
                                        From: {msg.fromRole}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No new messages.
                        </div>
                    )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Daily Usage Pattern</h3>
                        <div className="h-64">
                            <Bar
                                data={myUsageData}
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
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Peer Comparison</h3>
                        <div className="h-48 flex items-center justify-center relative">
                            <Doughnut
                                data={comparisonData}
                                options={{
                                    cutout: '75%',
                                    plugins: { legend: { position: 'bottom' } }
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-xs text-gray-400 block">Total</span>
                                    <span className="text-xl font-bold text-gray-800">82.7</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            You used <span className="font-bold text-blue-600">less energy</span> than the hostel average this week.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentUsage;
