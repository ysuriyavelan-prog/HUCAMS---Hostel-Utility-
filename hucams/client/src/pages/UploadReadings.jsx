import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Upload } from 'lucide-react';

const UploadReadings = () => {
    const [file, setFile] = useState(null);
    const [manual, setManual] = useState({ date: '', roomId: '', electricity: '', water: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        // TODO: proper API call
        console.log('Uploading...', file);
        alert('Mock Upload Successful');
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        console.log('Manual Entry:', manual);
        alert('Reading Added Successfully');
    };

    return (
        <Layout role="ADMIN">
            <h1 className="text-2xl font-bold mb-6">Upload Utility Readings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CSV Upload */}
                <Card>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Upload className="mr-2" size={24} /> Bulk Upload (CSV)
                    </h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <Button onClick={handleUpload} disabled={!file}>
                            Upload CSV
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Expected Format: date, block, floor, room_number, electricity_kwh, water_liters
                    </p>
                </Card>

                {/* Manual Entry */}
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
                    <form onSubmit={handleManualSubmit}>
                        <Input
                            label="Date"
                            type="date"
                            value={manual.date}
                            onChange={e => setManual({ ...manual, date: e.target.value })}
                            required
                        />
                        <Input
                            label="Room ID"
                            type="text"
                            value={manual.roomId}
                            onChange={e => setManual({ ...manual, roomId: e.target.value })}
                            placeholder="e.g. 101"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Electricity (kWh)"
                                type="number"
                                step="0.1"
                                value={manual.electricity}
                                onChange={e => setManual({ ...manual, electricity: e.target.value })}
                                required
                            />
                            <Input
                                label="Water (Liters)"
                                type="number"
                                step="1"
                                value={manual.water}
                                onChange={e => setManual({ ...manual, water: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Add Reading</Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default UploadReadings;
