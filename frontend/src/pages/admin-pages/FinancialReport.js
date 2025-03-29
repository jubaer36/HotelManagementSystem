import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import Navbar from '../../components/Navbar';
import './FinancialReport.css';
import './FincacialCard.css'

const FinancialReport = () => {
    const { hotelId } = useParams();
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [inventoryChart, setInventoryChart] = useState([]);
    const [maintenanceChart, setMaintenanceChart] = useState([]);
    const [salaryChart, setSalaryChart] = useState([]);
    const [transactionChart, setTransactionChart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({ inventory: 0, maintenance: 0, salaries: 0, revenue: 0 });


    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };
    const fetchTotalSummary = async () => {
        if (!startMonth || !endMonth) return;
        const start = `${startMonth}-01`;
        const end = `${endMonth}-31`;

        try {
            const res = await fetch(`http://localhost:3001/financial-summary/${hotelId}?start=${start}&end=${end}`);
            if (!res.ok) throw new Error('Failed to fetch summary totals');
            const data = await res.json();
            setSummary(data);
        } catch (err) {
            console.error('Total Summary Error:', err);
        }
    };

    const formatRange = () => {
        if (!startMonth || !endMonth) return '';
        const options = { year: 'numeric', month: 'short' };
        const start = new Date(`${startMonth}-01`).toLocaleDateString('en-US', options);
        const end = new Date(`${endMonth}-01`).toLocaleDateString('en-US', options);
        return `${start} to ${end}`;
    };

    const fetchInventorySummary = async () => {
        if (!startMonth || !endMonth) return;
        const start = `${startMonth}-01`;
        const end = `${endMonth}-31`;

        try {
            const response = await fetch(`http://localhost:3001/inventory-summary/${hotelId}?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Failed to fetch inventory summary');
            const data = await response.json();

            const formatted = data.map(row => ({
                InventoryMonth: row.InventoryMonth ?? 'TOTAL',
                TotalInventoryCost: row.TotalInventoryCost
            }));
            setInventoryChart(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceSummary = async () => {
        if (!startMonth || !endMonth) return;
        const start = `${startMonth}-01`;
        const end = `${endMonth}-31`;

        try {
            const response = await fetch(`http://localhost:3001/maintenance-summary/${hotelId}?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Failed to fetch maintenance summary');
            const data = await response.json();

            const formatted = data.map(row => ({
                MaintenanceMonth: row.MaintenanceMonth ?? 'TOTAL',
                TotalMaintenanceCost: row.TotalMaintenanceCost
            }));
            setMaintenanceChart(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSalarySummary = async () => {
        try {
            const response = await fetch(`http://localhost:3001/salary-summary/${hotelId}`);
            if (!response.ok) throw new Error('Failed to fetch salary summary');
            const data = await response.json();

            const formatted = data.map(row => ({
                DeptName: row.DeptName ?? 'TOTAL',
                TotalDeptSalary: row.TotalDeptSalary
            }));
            setSalaryChart(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTransactionSummary = async () => {
        if (!startMonth || !endMonth) return;
        const start = `${startMonth}-01`;
        const end = `${endMonth}-31`;

        try {
            const response = await fetch(`http://localhost:3001/transaction-summary/${hotelId}?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Failed to fetch transaction revenue');
            const data = await response.json();

            const formatted = data.map(row => ({
                RevenueMonth: row.RevenueMonth ?? 'TOTAL',
                TotalRevenue: row.TotalRevenue
            }));
            setTransactionChart(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (startMonth && endMonth) {
            fetchTotalSummary();
            fetchInventorySummary();
            fetchMaintenanceSummary();
            fetchSalarySummary();
            fetchTransactionSummary();
        }
    }, [startMonth, endMonth]);

    if (loading) return <div className="financial-loading"><Navbar /><div className="loading-content">Loading...</div></div>;
    if (error) return <div className="financial-error"><Navbar /><div className="error-content">{error}</div></div>;

    const totalRevenue = transactionChart.find(row => row.RevenueMonth === 'TOTAL')?.TotalRevenue || 0;
    const inventoryCost = inventoryChart.find(row => row.InventoryMonth === 'TOTAL')?.TotalInventoryCost || 0;
    const maintenanceCost = maintenanceChart.find(row => row.MaintenanceMonth === 'TOTAL')?.TotalMaintenanceCost || 0;
    const salaryCost = salaryChart.find(row => row.DeptName === 'TOTAL')?.TotalDeptSalary || 0;

    const totalExpenses = inventoryCost + maintenanceCost + salaryCost;
    const netProfit = totalRevenue - totalExpenses;
    const profitStatus = netProfit > 0 ? 'Profit' : netProfit < 0 ? 'Loss' : 'Break-even';

    return (
        <div className="financial-container">
            <Navbar />
            <div className="financial-content">
                <div className="date-filter-bar">
                    <label>Select Start Month:
                        <input type="month" value={startMonth} onChange={e => setStartMonth(e.target.value)}/>
                    </label>
                    <label>Select End Month:
                        <input type="month" value={endMonth} onChange={e => setEndMonth(e.target.value)}/>
                    </label>
                </div>

                <div className="summary-cards">
                    <div className="summary-card revenue-card">
                        <h4>Total Revenue</h4>
                        <p>{summary.revenue}</p> {/* raw number */}
                    </div>
                    <div className="summary-card expense-card">
                        <h4>Total Expenses</h4>
                        <p>{Number(summary.inventory) + Number(summary.maintenance) + Number(summary.salaries)}</p>

                    </div>
                    <div
                        className={`summary-card ${netProfit > 0 ? 'profit-card' : netProfit < 0 ? 'loss-card' : 'breakeven-card'}`}>
                        <h4>Net {profitStatus}</h4>
                        <p>{Number(summary.revenue) - (Number(summary.inventory) + Number(summary.maintenance) + Number(summary.salaries))}</p>

                    </div>
                </div>

                <div className="chart-grid-2">
                    <div className="dashboard-section">
                        <h3 className="section-title">Inventory Cost by Month ({formatRange()})</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={inventoryChart}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="InventoryMonth"/>
                                    <YAxis/>
                                    <Tooltip formatter={formatCurrency}/>
                                    <Legend/>
                                    <Bar dataKey="TotalInventoryCost" fill="#10b981" name="Inventory Cost"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3 className="section-title">Maintenance Cost by Month ({formatRange()})</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={maintenanceChart}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="MaintenanceMonth"/>
                                    <YAxis/>
                                    <Tooltip formatter={formatCurrency}/>
                                    <Legend/>
                                    <Bar dataKey="TotalMaintenanceCost" fill="#f97316" name="Maintenance Cost"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3 className="section-title">Salary Cost by Department</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salaryChart}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="DeptName"/>
                                    <YAxis/>
                                    <Tooltip formatter={formatCurrency}/>
                                    <Legend/>
                                    <Bar dataKey="TotalDeptSalary" fill="#6366f1" name="Salaries"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3 className="section-title">Monthly Revenue from Transactions ({formatRange()})</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={transactionChart}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="RevenueMonth"
                                           tickFormatter={(month) => month === 'TOTAL' ? 'TOTAL' : month}/>
                                    <YAxis/>
                                    <Tooltip formatter={formatCurrency}/>
                                    <Legend/>
                                    <Bar dataKey="TotalRevenue" fill="#a855f7" name="Transaction Revenue"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;