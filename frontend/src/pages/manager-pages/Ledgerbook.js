import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Ledgerbook.css";
import Navbar from "../../components/Navbar";

const LedgerBook = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch transactions on component mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    /* --------------------------------------------
       Fetch Transactions List
    -------------------------------------------- */
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await Axios.get("http://localhost:3001/transactions");
            setTransactions(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* --------------------------------------------
       Mark Order as Received
    -------------------------------------------- */
    const markAsReceived = async (transactionID) => {
        try {
            await Axios.post("http://localhost:3001/receive-order", {
                transactionID,
            });
            // Refresh the transactions list after successful update
            fetchTransactions();
            alert("Transaction marked as received successfully!");
        } catch (error) {
            console.error("Error receiving order:", error);
            alert("Failed to mark transaction as received. Please try again.");
        }
    };

    /* --------------------------------------------
       Format Currency
    -------------------------------------------- */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return <div className="loading">Loading transactions...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <Navbar/>
        <div className="ledger-container">
            <div className="controls">
                <button onClick={fetchTransactions} className="refresh-button">
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
        </div>
        </div>
    );
};

export default LedgerBook;