import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Line, Doughnut } from 'react-chartjs-2';
import { Lightbulb, Droplets, TrendingUp, AlertCircle, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { getUser } from '../utils/auth';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const user = getUser();
    const role = user?.role || 'ADMIN';
    const [loading, setLoading] = useState(true);

    // Simulated Data Loading
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    // Mock Data for Charts
    const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Electricity (kWh)',
                data: [450, 480, 460, 520, 490, 430, 410],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Water (L)',
                data: [1200, 1150, 1300, 1250, 1100, 1050, 1000],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
            },
        ],
    };

    const distributionData = {
        labels: ['HVAC (AC/Fans)', 'Lighting', 'Water Hosting', 'Other Electronics'],
        datasets: [
            {
                data: [45, 20, 25, 10],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)', // Red - HVAC
                    'rgba(245, 158, 11, 0.8)', // Yellow - Lighting
                    'rgba(59, 130, 246, 0.8)', // Blue - Water
                    'rgba(107, 114, 128, 0.8)', // Gray - Other
                ],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Electricity (kWh)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Water (Liters)' }
            },
        },
    };

    // AI Solutions / Recommendations Data
    const suggestions = [
        {
            type: 'Critical',
            icon: AlertCircle,
            color: 'text-red-600 bg-red-100',
            title: 'High HVAC Usage Detected',
            desc: 'AC consumption in Block A is 30% higher than average during afternoon hours.',
            solution: 'Install automated timers or IoT-enabled smart plugs to regulate AC usage during peak hours (2 PM - 5 PM).'
        },
        {
            type: 'Warning',
            icon: Droplets,
            color: 'text-blue-600 bg-blue-100',
            title: 'Water Leakage Suspected',
            desc: 'Constant water flow detected in the 2nd Floor common amenities washroom between 2 AM - 5 AM.',
            solution: 'Dispatch maintenance team to check for leaking flush valves or taps in the 2nd flr washroom.'
        },
        {
            type: 'Optimization',
            icon: Lightbulb,
            color: 'text-yellow-600 bg-yellow-100',
            title: 'Lighting Efficiency',
            desc: 'Corridor lights are remaining on during daylight hours (6 AM - 6 PM).',
            solution: 'Install motion sensors or automate central switching based on sunrise/sunset data.'
        }
    ];

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
                    <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
                    <p className="text-gray-500 mt-2">Deep dive into utility patterns and AI-driven optimization solutions.</p>
                </div>

                {/* AI Hostel Savings Report - Aggregate View */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl shadow-xl text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Sparkles size={28} className="text-yellow-300" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Hostel AI Savings Report</h2>
                                <p className="text-emerald-100 text-sm">Aggregated efficiency metrics across all blocks</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className="bg-white/20 text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-bold uppercase tracking-widest border border-white/20">Monthly Recap</span>
                                <span className="text-xs mt-1 text-emerald-200">Jan 1 - Jan 31</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-500/30 rounded-lg text-emerald-100"><Zap size={18} /></div>
                                    <span className="text-[10px] font-bold text-emerald-300 p-1 bg-emerald-900/40 rounded">+18.2%</span>
                                </div>
                                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Total Grid Saving</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold">4,820 <span className="text-sm font-normal text-emerald-200">kWh</span></span>
                                </div>
                                <p className="text-[10px] text-emerald-200 mt-2">vs. 4,078 kWh target</p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-yellow-500/30 rounded-lg text-yellow-100"><TrendingUp size={18} /></div>
                                    <span className="text-[10px] font-bold text-green-300 p-1 bg-emerald-900/40 rounded">₹42K Save</span>
                                </div>
                                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Financial Reduction</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold">₹75,240</span>
                                </div>
                                <p className="text-[10px] text-emerald-200 mt-2">Operational cost minimized</p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-500/30 rounded-lg text-blue-100"><Lightbulb size={18} /></div>
                                    <span className="text-[10px] font-bold text-blue-200 p-1 bg-blue-900/40 rounded">Efficient</span>
                                </div>
                                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Optimization Index</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold">94.2 <span className="text-sm font-normal text-emerald-200">%</span></span>
                                </div>
                                <p className="text-[10px] text-emerald-200 mt-2">Smart IoT utilization rate</p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={16} className="text-yellow-300" />
                                        <span className="text-xs font-bold text-emerald-100 uppercase tracking-tight">AI Strategy</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-emerald-50">"By automating common area lights, you can reach <span className="font-bold text-yellow-300">₹1 Lakh</span> savings milestone by Next Month."</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-emerald-700 bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-800 font-bold">{i}</div>)}
                                    </div>
                                    <span className="text-[10px] text-emerald-200 font-medium">Top Blocks contributing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Trend Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Weekly Consumption Trends
                        </h3>
                        <div className="h-80">
                            <Line data={trendData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Distribution Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Load Distribution</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut
                                data={distributionData}
                                options={{
                                    cutout: '70%',
                                    plugins: { legend: { position: 'bottom' } }
                                }}
                            />
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-500">
                            HVAC systems consume the most power (45%).
                        </div>
                    </div>
                </div>

                {/* Solutions / Recommendations Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Lightbulb className="text-yellow-500" fill="currentColor" />
                        AI Recommended Solutions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {suggestions.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${item.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="mt-4">
                                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${item.type === 'Critical' ? 'bg-red-100 text-red-700' : item.type === 'Warning' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.type}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{item.desc}</p>

                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Proposed Solution</p>
                                            <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                                {item.solution}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;
