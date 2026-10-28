import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { getUser } from '../utils/auth';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Complaints = () => {
    const user = getUser();
    const role = user?.role || 'STUDENT';
    const isAdmin = role === 'ADMIN';

    // Initialize from localStorage or Mock Data
    const [complaints, setComplaints] = useState(() => {
        const saved = localStorage.getItem('hucams_complaints');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Fan not working', status: 'Pending', description: 'Room 101 fan is making noise', date: '2024-01-28', student: 'Student User' }
        ];
    });

    const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('hucams_complaints', JSON.stringify(complaints));
    }, [complaints]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            ...newComplaint,
            id: Date.now(),
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            student: user?.name || 'Unknown Student'
        };
        setComplaints([newEntry, ...complaints]);
        setNewComplaint({ title: '', description: '' });
        alert('Complaint registered successfully');
    };

    const handleResolve = (id) => {
        if (window.confirm('Mark this complaint as Resolved?')) {
            setComplaints(complaints.map(c =>
                c.id === id ? { ...c, status: 'Resolved' } : c
            ));
        }
    };

    // List Logic:
    // Admin: Show only Pending (to focus on actionable work)
    // Student: Show All (to track their status history)
    const displayComplaints = isAdmin
        ? complaints.filter(c => c.status === 'Pending')
        : complaints;

    return (
        <Layout role={role}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Complaints & Maintenance</h1>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {complaints.filter(c => c.status === 'Pending').length} Pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {complaints.filter(c => c.status === 'Resolved').length} Solved
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {displayComplaints.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                            <CheckCircle size={48} className="mx-auto text-green-400 mb-3" />
                            <p className="text-gray-500">
                                {isAdmin ? "All work complete! No pending complaints." : "No registered complaints."}
                            </p>
                        </div>
                    ) : (
                        displayComplaints.map(c => (
                            <Card key={c.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 transition-all duration-300 ${c.status === 'Resolved'
                                    ? 'border-green-500 bg-gray-50 opacity-75'
                                    : 'border-yellow-500 hover:shadow-md'
                                }`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-semibold text-lg ${c.status === 'Resolved' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{c.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${c.status === 'Pending'
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                : 'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                                    <div className="flex items-center text-xs text-gray-400 gap-3">
                                        <span className="flex items-center"><Clock size={12} className="mr-1" /> {c.date}</span>
                                        <span className="flex items-center"><AlertCircle size={12} className="mr-1" /> Raised by: {c.student}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    {isAdmin && c.status === 'Pending' && (
                                        <button
                                            onClick={() => handleResolve(c.id)}
                                            className="px-4 py-2 bg-white border border-green-500 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm flex items-center shadow-sm transition-colors"
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            Mark Solved
                                        </button>
                                    )}
                                    {c.status === 'Resolved' && (
                                        <span className="flex items-center text-green-600 text-sm font-medium">
                                            <CheckCircle size={16} className="mr-1" /> Solved
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Form - Only for Students or maybe Admins too? Usually Students raise complaints. Keeping common for now but labeled. */}
                <div>
                    <Card>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-blue-500" />
                            Raise New Complaint
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Issue Title"
                                value={newComplaint.title}
                                onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                placeholder="e.g. Leaking Tap"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-gray-50"
                                    rows="4"
                                    value={newComplaint.description}
                                    onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                    placeholder="Describe the issue in detail..."
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200">
                                Submit Complaint
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Complaints;
