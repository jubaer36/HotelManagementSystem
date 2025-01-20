import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js
import "./Manexpenses.css";

const Manexpenses = () => {
    const hotelID = 1; // Change as needed
    const [expensesData, setExpensesData] = useState({
        TotalSalary: 0,
        TotalEarnings: 0,
    });

    const [yearlyTransactions, setYearlyTransactions] = useState([]);

    useEffect(() => {
        fetchHotelExpenses();
        fetchYearlyTransactions();
    }, []);

    // Fetching total salary cost and earnings
    const fetchHotelExpenses = () => {
        Axios.post("http://localhost:3001/hotel-expenses", { hotelID })
            .then((response) => {
                setExpensesData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching expenses data:", error);
            });
    };

    // Fetching yearly transaction earnings for last 5 years
    const fetchYearlyTransactions = () => {
        Axios.post("http://localhost:3001/transaction-earnings", { hotelID })
            .then((response) => {
                setYearlyTransactions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching yearly transactions:", error);
            });
    };

    // Data for salary vs. earnings
    const salaryEarningsData = {
        labels: ["Total Salary Cost", "Total Earnings"],
        datasets: [
            {
                label: "Amount ($)",
                data: [expensesData.TotalSalary, expensesData.TotalEarnings],
                backgroundColor: ["#FF5733", "#28A745"],
                borderColor: ["#C70039", "#1D8348"],
                borderWidth: 1,
            },
        ],
    };

    // Data for yearly transaction earnings
    const transactionData = {
        labels: yearlyTransactions.map((data) => data.Year),
        datasets: [
            {
                label: "Total Earnings ($)",
                data: yearlyTransactions.map((data) => data.TotalAmount),
                backgroundColor: "#3498DB",
                borderColor: "#21618C",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="expenses-container">
            <h2>Hotel Financial Overview</h2>
            <div className="chart-container">
                <Bar data={salaryEarningsData} options={options} />
            </div>

            <h2>Yearly Transaction Earnings (Last 5 Years)</h2>
            <div className="chart-container">
                <Bar data={transactionData} options={options} />
            </div>
        </div>
    );
};

export default Manexpenses;
