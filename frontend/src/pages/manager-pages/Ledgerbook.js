import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../../components/Navbar";
import "./Ledgerbook.css";

const LedgerBook = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const hotelID = localStorage.getItem('hotelID'); // ✅ Get hotel ID from localStorage

    useEffect(() => {
        if (hotelID) {
            fetchTransactions();
            fetchSummary(); // 🚀 Fetch monthly summary too
        } else {
            setLoading(false);
            setError("No hotel ID found. Please log in again.");
        }
    }, [hotelID]);
    /* Fetch Transactions */
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await Axios.get(`http://localhost:3001/transactions/${hotelID}`);
            setTransactions(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* Fetch Transaction Summary (ROLLUP) */
    const fetchSummary = async () => {
        try {
            const response = await Axios.get(`http://localhost:3001/transaction-summary/${hotelID}`);
            setSummary(response.data);
        } catch (error) {
            console.error("Error fetching transaction summary:", error);
        }
    };

    /* Mark a transaction as received */
    const markAsReceived = async (transactionID) => {
        try {
            await Axios.post("http://localhost:3001/receive-order", {
                transactionID,
            });
            fetchTransactions();
            fetchSummary();
            alert("Transaction marked as received successfully!");
        } catch (error) {
            console.error("Error receiving order:", error);
            alert("Failed to mark transaction as received. Please try again.");
        }
    };

    /* Format currency nicely */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="loading">Loading transactions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="ledger-container">
                <div className="controls">
                    <button onClick={() => {fetchTransactions(); fetchSummary();}} className="refresh-button">
                        Refresh Transactions
                    </button>
                </div>

                <div className="transactions-section">
                    <h2>Transaction History</h2>
                    <div className="table-responsive">
                        <table className="ledger-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Inventory ID</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                                <th>Status</th>
                                <th>Order Date</th>
                                <th>Receive Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction.TransactionID}
                                        className={`status-${transaction.Status.toLowerCase()}`}
                                    >
                                        <td>{transaction.TransactionID}</td>
                                        <td>{transaction.InventoryID}</td>
                                        <td>{transaction.TransactionType}</td>
                                        <td>{transaction.Quantity}</td>
                                        <td>{formatCurrency(transaction.UnitPrice)}</td>
                                        <td>{formatCurrency(transaction.Quantity * transaction.UnitPrice)}</td>
                                        <td>
                                                <span className={`status-badge ${transaction.Status.toLowerCase()}`}>
                                                    {transaction.Status}
                                                </span>
                                        </td>
                                        <td>{new Date(transaction.TransactionDate).toLocaleString()}</td>
                                        <td>
                                            {transaction.ReceiveDate
                                                ? new Date(transaction.ReceiveDate).toLocaleString()
                                                : "Pending"}
                                        </td>
                                        <td>
                                            {transaction.Status === "Pending" && (
                                                <button
                                                    className="receive-button"
                                                    onClick={() => markAsReceived(transaction.TransactionID)}
                                                >
                                                    Mark Received
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="no-transactions">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ✅ Transaction Summary */}
                <div className="transactions-section">
                    <h2 className="transaction-summary-title">Transaction Summary (This Month)</h2>
                    <div className="table-responsive">
                        <table className="summary-table">
                            <thead>
                            <tr>
                                <th>Status</th>
                                <th>Total Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Status || 'Grand Total'}</td>
                                    <td>{formatCurrency(row.TotalValue)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LedgerBook;
