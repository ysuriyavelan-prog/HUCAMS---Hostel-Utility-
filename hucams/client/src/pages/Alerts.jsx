import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { getUser } from '../utils/auth';

const Alerts = () => {
    const user = getUser();
    const role = user?.role || 'ADMIN';
    const isAdmin = role === 'ADMIN';

    // Mock Sensor Data (Simulating shared data from Backend/Energy Page)
    const sensorData = [
        { room: '101', electricity: 12, water: 450, limitE: 10, limitW: 500 },
        { room: '102', electricity: 8, water: 600, limitE: 10, limitW: 500 }, // High Water
        { room: '103', electricity: 15, water: 480, limitE: 10, limitW: 500 }, // High Elec
        { room: '104', electricity: 5, water: 150, limitE: 10, limitW: 500 },
        { room: '105', electricity: 10, water: 480, limitE: 10, limitW: 500 },
        { room: '106', electricity: 14, water: 550, limitE: 10, limitW: 500 }, // High Both
    ];

    // Generate Alerts based on Sensor Data
    const generateAlerts = () => {
        const generated = [];
        let idCounter = 1;

        sensorData.forEach(readings => {
            // Check Electricity
            if (readings.electricity > readings.limitE) {
                generated.push({
                    id: idCounter++,
                    type: 'Electricity Spike',
                    message: `Room ${readings.room} usage (${readings.electricity} kWh) exceeds limit (${readings.limitE} kWh)`,
                    severity: 'High',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Active',
                    details: readings // Store full details for messaging
                });
            }
            // Check Water
            if (readings.water > readings.limitW) {
                generated.push({
                    id: idCounter++,
                    type: 'Water Leakage',
                    message: `Room ${readings.room} water usage (${readings.water} L) is abnormally high`,
                    severity: 'Medium',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Active',
                    details: readings
                });
            }
        });
        return generated;
    };

    const [alerts, setAlerts] = useState(generateAlerts());

    // Messaging Modal State
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [messageText, setMessageText] = useState('');

    const handleResolve = (id) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: 'Resolved' } : alert
        ));
    };

    const handleNotify = (alert) => {
        setSelectedAlert(alert);
        // AI Suggestion Logic
        let suggestion = "";
        const readings = alert.details || {}; // Access the specific data

        if (alert.type === 'Electricity Spike') {
            const room = readings.room || "your room";
            const usage = readings.electricity;
            const limit = readings.limitE;
            const excess = ((usage - limit) / limit * 100).toFixed(0);

            suggestion = `Subject: High Energy Consumption Alert - Room ${room}\n\nDear Residents,\n\nOur system detected that your room's electricity consumption has reached ${usage} kWh today, which is ${excess}% above the standard threshold of ${limit} kWh.\n\nPlease check if air conditioners or heaters have been left running while the room is unoccupied. Adhering to energy limits helps us maintain a sustainable campus.\n\nThank you,\nHostel Administration`;
        } else if (alert.type === 'Water Leakage') {
            const room = readings.room || "your room";
            const usage = readings.water;
            const limit = readings.limitW;
            // Addressing the student directly now
            suggestion = `Subject: High Water Usage Alert - Room ${room}\n\nDear Residents,\n\nWe noticed an unusually high water flow (${usage} L) in your room today, exceeding the daily limit of ${limit} L.\n\nPlease check if any taps or flush valves have been left open or are leaking. If you find a leak you cannot stop, please report it to maintenance immediately.\n\nThank you,\nHostel Administration`;
        }
        setMessageText(suggestion);
        setIsMessageModalOpen(true);
    };

    const sendMessage = () => {
        // Mock sending - Persist to localStorage for Student Dashboard to pick up
        const newMessage = {
            id: Date.now(),
            subject: 'Alert Notification',
            content: messageText,
            date: new Date().toLocaleDateString(),
            from: 'dmin',
            fromRole: 'Administration',
            read: false
        };

        const existingMessages = JSON.parse(localStorage.getItem('studentMessages') || '[]');
        localStorage.setItem('studentMessages', JSON.stringify([newMessage, ...existingMessages]));

        alert(`Message sent to Room ${selectedAlert.details?.room || 'Student'}!`);
        setIsMessageModalOpen(false);
    };

    return (
        <Layout role={role}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">System Alerts</h1>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {alerts.filter(a => a.status === 'Active').length} Active
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {alerts.filter(a => a.status === 'Resolved').length} Resolved
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {/* ADMIN View: Show only Active items to be resolved */}
                {isAdmin && alerts.filter(a => a.status !== 'Resolved').map(alert => (
                    <Card
                        key={alert.id}
                        className={`flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 transition-all duration-300 border-red-500 hover:shadow-md`}
                    >
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {alert.type}
                                    </h3>
                                </div>
                                <p className="text-gray-600">{alert.message}</p>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <Clock size={12} className="mr-1" /> {alert.date} • Severity: {alert.severity}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {(alert.type === 'Electricity Spike' || alert.type === 'Water Leakage') && (
                                <button
                                    onClick={() => handleNotify(alert)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                                >
                                    <MessageSquare size={16} className="mr-2" />
                                    Notify Room
                                </button>
                            )}
                            <button
                                onClick={() => handleResolve(alert.id)}
                                className="flex-1 md:flex-none px-4 py-2 bg-white border border-green-500 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm flex items-center justify-center transition-colors shadow-sm"
                            >
                                <CheckCircle size={16} className="mr-2" />
                                Mark Resolved
                            </button>
                        </div>
                    </Card>
                ))}

                {/* STUDENT View: Show historical changes (Resolved items) */}
                {!isAdmin && alerts.filter(a => a.status === 'Resolved').map(alert => (
                    <Card
                        key={alert.id}
                        className={`flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 transition-all duration-300 border-green-500 bg-emerald-50/30`}
                    >
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        Action Taken: {alert.type}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded border border-green-200">
                                        Resolved by Admin
                                    </span>
                                </div>
                                <p className="text-gray-600 italic">"{alert.message}"</p>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <Clock size={12} className="mr-1" /> {alert.date}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 border border-emerald-100">
                            Problem Solved
                        </div>
                    </Card>
                ))}

                {isAdmin && alerts.filter(a => a.status !== 'Resolved').length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
                        <p>No active alerts found. All issues are currently resolved.</p>
                    </div>
                )}

                {!isAdmin && alerts.filter(a => a.status === 'Resolved').length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
                        <p>No historical alert resolutions to display.</p>
                    </div>
                )}
            </div>

            {/* AI Message Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Sparkles size={20} /></span>
                                <h3 className="text-xl font-bold text-gray-900">AI Suggested Message</h3>
                            </div>
                            <button onClick={() => setIsMessageModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 bg-gray-50 font-sans leading-relaxed"
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2 flex items-center">
                                <Sparkles size={12} className="mr-1" /> Generated based on alert context
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                            <button
                                onClick={() => setIsMessageModalOpen(false)}
                                className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendMessage}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all flex items-center"
                            >
                                <Send size={18} className="mr-2" />
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Alerts;
