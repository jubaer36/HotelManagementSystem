import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import Navbar from '../../components/Navbar';
import './FinancialReport.css';
import './FincacialCard.css';

const FinancialReport = () => {
    const { hotelId } = useParams();
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [inventoryChart, setInventoryChart] = useState([]);
    const [maintenanceChart, setMaintenanceChart] = useState([]);
    const [salaryChart, setSalaryChart] = useState([]);
    const [transactionChart, setTransactionChart] = useState([]);
    const [summary, setSummary] = useState({ inventory: 0, maintenance: 0, salaries: 0, revenue: 0 });

    const getLastDayOfMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        return new Date(year, month, 0).toISOString().split('T')[0];
    };

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    const fetchData = async () => {
        if (!startMonth || !endMonth) return;

        const start = `${startMonth}-01`;
        const end = getLastDayOfMonth(endMonth);

        try {
            const [
                inventoryRes,
                maintenanceRes,
                salaryRes,
                transactionRes,
                summaryRes
            ] = await Promise.all([
                fetch(`http://localhost:3001/inventory-summary/${hotelId}?start=${start}&end=${end}`),
                fetch(`http://localhost:3001/maintenance-summary/${hotelId}?start=${start}&end=${end}`),
                fetch(`http://localhost:3001/salary-summary/${hotelId}`),
                fetch(`http://localhost:3001/transaction-summary-admin/${hotelId}?start=${start}&end=${end}`),
                fetch(`http://localhost:3001/financial-summary/${hotelId}?start=${start}&end=${end}`)
            ]);

            const [
                inventoryData,
                maintenanceData,
                salaryData,
                transactionData,
                summaryData
            ] = await Promise.all([
                inventoryRes.json(),
                maintenanceRes.json(),
                salaryRes.json(),
                transactionRes.json(),
                summaryRes.json()
            ]);

            setInventoryChart(inventoryData);
            setMaintenanceChart(maintenanceData);
            setSalaryChart(salaryData);
            setTransactionChart(transactionData);
            setSummary(summaryData);
            console.log("Fetched transactionChart:", transactionData);
        } catch (err) {
            console.error('Data Fetch Error:', err);

        }
    };

    useEffect(() => {
        fetchData();
    }, [startMonth, endMonth]);

    const totalExpenses = (Number(summary.inventory) + Number(summary.maintenance) + Number(summary.salaries));
    const netProfit = Number(summary.revenue) - totalExpenses;
    const profitStatus = netProfit > 0 ? 'Profit' : netProfit < 0 ? 'Loss' : 'Break-even';

    return (
        <div className="financial-container">
            <Navbar />
            <div className="financial-content">
                <div className="date-filter-bar">
                    <label>Start Month:
                        <input
                            type="month"
                            value={startMonth}
                            onChange={e => {
                                const newStart = e.target.value;
                                setStartMonth(newStart);
                                // If endMonth exists and becomes invalid, reset it
                                if (endMonth && endMonth < newStart) {
                                    setEndMonth(newStart);
                                }
                            }}
                        />
                    </label>

                    <label>End Month:
                        <input
                            type="month"
                            value={endMonth}
                            onChange={e => {
                                const newEnd = e.target.value;
                                if (startMonth && newEnd < startMonth) {
                                    alert("❌ End Month cannot be earlier than Start Month!");
                                    return;
                                }
                                setEndMonth(newEnd);
                            }}
                            min={startMonth || ""}
                        />
                    </label>
                </div>


                <div className="summary-cards">
                    <div className="summary-card revenue-card">
                        <h4>Total Revenue</h4>
                        <p>{formatCurrency(summary.revenue)}</p>
                    </div>
                    <div className="summary-card expense-card">
                        <h4>Total Expenses</h4>
                        <p>{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className={`summary-card ${netProfit >= 0 ? 'profit-card' : 'loss-card'}`}>
                        <h4>Net {profitStatus}</h4>
                        <p>{formatCurrency(netProfit)}</p>
                    </div>
                </div>

                <div className="chart-grid-2">
                    <Chart title="Inventory Cost by Month" data={inventoryChart} xKey="InventoryMonth"
                           yKey="TotalInventoryCost" barColor="#10b981"/>
                    <Chart title="Maintenance Cost by Month" data={maintenanceChart} xKey="MaintenanceMonth"
                           yKey="TotalMaintenanceCost" barColor="#f97316"/>
                    <Chart title="Salary Cost by Department" data={salaryChart} xKey="DeptName" yKey="TotalDeptSalary"
                           barColor="#6366f1"/>
                    <Chart title="Monthly Revenue" data={transactionChart} xKey="RevenueMonth" yKey="TotalRevenue"
                           barColor="#a855f7"/>
                </div>
            </div>
        </div>
    );
};

const Chart = ({title, data, xKey, yKey, barColor}) => (
    <div className="dashboard-section">
        <h3 className="section-title">{title}</h3>
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey={xKey}/>
                    <YAxis/>
                    <Tooltip formatter={(value) => `$${parseFloat(value || 0).toFixed(2)}`}/>
                    <Legend/>
                    <Bar dataKey={yKey} fill={barColor}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default FinancialReport;
