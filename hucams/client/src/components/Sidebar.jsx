import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart3, AlertTriangle, User, LogOut, X } from 'lucide-react';
import { logout, getUser } from '../utils/auth';

const Sidebar = ({ role = 'ADMIN' }) => { // Fallback, but ideally passed from parent or fetched
    const navigate = useNavigate();
    const user = getUser();
    const userRole = user?.role || role;
    const userName = user?.name || 'User';

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
        { name: 'Upload Readings', path: '/upload', icon: Upload, roles: ['ADMIN'] },
        { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['ADMIN', 'WARDEN'] },
        { name: 'Energy Consumption', path: '/energy', icon: BarChart3, roles: ['ADMIN', 'WARDEN', 'STUDENT'] },
        { name: 'My Usage', path: '/student/usage', icon: BarChart3, roles: ['STUDENT'] },
        { name: 'Alerts', path: '/alerts', icon: AlertTriangle, roles: ['ADMIN', 'STUDENT'] },
        { name: 'Complaints', path: '/complaints', icon: User, roles: ['ADMIN', 'STUDENT', 'TECHNICIAN'] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(userRole));

    const handleLogout = () => {
        logout();
        navigate('/');
        // In a real app, you might use a toast library here e.g. toast.success("Logged out successfully");
        alert("Logged out successfully");
    };

    return (
        <>
            <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-xl z-10 relative">
                <div className="p-6 text-2xl font-bold border-b border-gray-800 flex items-center gap-2 tracking-wide text-blue-400">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">H</div>
                    HUCAMS
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 shadow-lg text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4 px-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-blue-400 font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userRole}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
                            <button onClick={() => setIsLogoutModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-8">
                            Are you sure you want to end your session?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md shadow-red-200 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;

