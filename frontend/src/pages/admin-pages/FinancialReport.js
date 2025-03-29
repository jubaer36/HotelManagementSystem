// ✅ FinancialReport.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import Navbar from '../../components/Navbar';
import './FinancialReport.css';

const FinancialReport = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`http://localhost:3001/financial-report/${hotelId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch financial report');
                const data = await response.json();
                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [hotelId]);

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    if (loading) return <div className="financial-loading"><Navbar /><div className="loading-content">Loading...</div></div>;
    if (error) return <div className="financial-error"><Navbar /><div className="error-content">{error}</div></div>;

    return (
        <div className="financial-container">
            <Navbar />
            <div className="financial-content">
                <div className="card-grid-3">
                    <div className="summary-card revenue-card">
                        <h3>Total Revenue</h3>
                        <p>{formatCurrency(report?.summary?.TotalRevenue)}</p>
                    </div>
                    <div className="summary-card expense-card">
                        <h3>Total Expenses</h3>
                        <p>{formatCurrency(report?.summary?.TotalExpenses)}</p>
                    </div>
                    <div className={`summary-card ${report?.summary?.Status?.toLowerCase()}-card`}>
                        <h3>Net Profit/Loss</h3>
                        <p>{formatCurrency(report?.summary?.NetProfitLoss)}</p>
                        <span className={`status-badge ${report?.summary?.Status?.toLowerCase()}`}>
              {report?.summary?.Status}
            </span>
                    </div>
                </div>

                <div className="chart-grid-2">
                    <div className="dashboard-section">
                        <h3 className="section-title">Revenue Breakdown</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={report?.revenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="HotelName" />
                                    <YAxis />
                                    <Tooltip formatter={value => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="TotalRevenue" fill="#4f46e5" name="Revenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3 className="section-title">Expense Categories</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={report?.expenses || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Category" />
                                    <YAxis />
                                    <Tooltip formatter={value => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="TotalExpenses" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/*<div className="table-container">*/}
                        {/*    <table className="financial-table">*/}
                        {/*        <thead>*/}
                        {/*        <tr>*/}
                        {/*            <th>Category</th>*/}
                        {/*            <th>Total Expenses</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*        {(report?.expenses || []).map((row, i) => (*/}
                        {/*            <tr key={i}>*/}
                        {/*                <td>{row.Category || 'TOTAL'}</td>*/}
                        {/*                <td>{formatCurrency(row.TotalExpenses)}</td>*/}
                        {/*            </tr>*/}
                        {/*        ))}*/}
                        {/*        </tbody>*/}
                        {/*    </table>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;