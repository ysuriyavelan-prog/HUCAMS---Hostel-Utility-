import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { getUser } from '../utils/auth';
import { Download, FileText } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EnergyConsumption() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const role = user?.role || 'STUDENT';

    // Mock Data for "Example" purposes if backend is empty
    const mockData = [
        { room: '101', electricity: 12, water: 450 },
        { room: '102', electricity: 8, water: 300 },
        { room: '103', electricity: 15, water: 600 },
        { room: '104', electricity: 5, water: 150 },
        { room: '105', electricity: 10, water: 480 },
        { room: '106', electricity: 14, water: 550 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use relative path to leverage proxy
                const res = await axios.get('/api/readings');
                if (res.data && res.data.length > 0) {
                    setData(res.data);
                } else {
                    setData(mockData); // Fallback to mock data for demo
                }
            } catch (err) {
                console.error('Error fetching data, using mock data', err);
                setData(mockData);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExport = () => {
        const headers = ["Room", "Electricity (kWh)", "Water (L)", "Status"];
        const rows = data.map(item => [
            `Room ${item.room}`,
            item.electricity,
            item.water,
            item.electricity > 14 || item.water > 500 ? "High Usage" : "Normal"
        ]);

        // Excel XML Template (SpreadsheetML)
        let excelTemplate = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Utility Report">
  <Table>
   <Row ss:StyleID="Header">
    ${headers.map(header => `<Cell><Data ss:Type="String">${header}</Data></Cell>`).join('')}
   </Row>
   ${rows.map(row => `
   <Row>
    ${row.map(cell => `<Cell><Data ss:Type="${typeof cell === 'number' ? 'Number' : 'String'}">${cell}</Data></Cell>`).join('')}
   </Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

        const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `hucams_utility_report_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const electricityChartData = {
        labels: data.map(item => `Room ${item.room}`),
        datasets: [
            {
                label: 'Electricity (kWh)',
                data: data.map(item => item.electricity),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    const waterChartData = {
        labels: data.map(item => `Room ${item.room}`),
        datasets: [
            {
                label: 'Water Usage (Liters)',
                data: data.map(item => item.water),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(16, 185, 129, 0.8)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { family: 'Inter, sans-serif' } }
            },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                grid: { display: false }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <Layout role={role}>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Utility Consumption</h1>
                        <p className="text-gray-500 mt-2">Monitor real-time energy and water usage across the hostel.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all font-medium"
                    >
                        <Download size={20} />
                        Export Report (Excel)
                    </button>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Electricity Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Energy Consumption</h2>
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">Live</span>
                                </div>
                                <div className="h-80 w-full">
                                    <Bar data={electricityChartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Water Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.74 5.88a6 6 0 0 1-8.48 8.48A6 6 0 0 1 3.52 8.57L12 2.69Z"></path></svg>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Water Usage</h2>
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">Live</span>
                                </div>
                                <div className="h-80 w-full">
                                    <Bar data={waterChartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats / Alerts Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">Room-wise Breakdown</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Electricity (kWh)</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Water (L)</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map((item, index) => {
                                            const isHigh = item.electricity > 14 || item.water > 500;
                                            return (
                                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Room {item.room}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.electricity}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.water}</td>
                                                    <td className="px-6 py-4">
                                                        {isHigh ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                High Usage
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Normal
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
