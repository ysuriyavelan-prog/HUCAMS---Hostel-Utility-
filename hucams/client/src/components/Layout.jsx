import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, role }) => {
    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {role}</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {role[0]}
                        </div>
                    </div>
                </header>
                <main className="p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
