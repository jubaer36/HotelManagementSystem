import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; 
import "./Manexpenses.css";

const Manexpenses = () => {
    const hotelID = localStorage.getItem("hotelID"); // Static Hotel ID
    const [selectedGraph, setSelectedGraph] = useState("yearly");
    const [yearlyData, setYearlyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [lastData, setlastData] = useState([]);
    
    useEffect(() => {
        fetchLastYears();
        fetchYearlyTransactions();
        fetchMonthlyTransactions();
    }, []);


    const fetchLastYears=()=>{
        Axios.post("http://localhost:3001/transaction-earnings", { hotelID })
        .then((response) => {
            setlastData(response.data);
        })
        .catch((error) => {
            console.error("Error fetching yearly data:", error);
        });
    }

    // Fetch Yearly Transactions
    const fetchYearlyTransactions = () => {
        Axios.post("http://localhost:3001/hotel-expenses", { hotelID })
            .then((response) => {
                setYearlyData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching yearly data:", error);
            });
    };

    // Fetch Monthly Transactions
    const fetchMonthlyTransactions = () => {
        Axios.post("http://localhost:3001/monthly-transactions", { hotelID })
            .then((response) => {
                setMonthlyData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching monthly data:", error);
            });
    };

    // Format Data for Graphs
    const yearlyGraphData = {
        labels: ["Total Salary Cost", "Total Earnings"],
        datasets: [
            {
                label: "Amount ($)",
                data: [yearlyData.TotalSalary, yearlyData.TotalEarnings],
                backgroundColor: ["#FF5733", "#28A745"],
                borderColor: ["#C70039", "#1D8348"],
                borderWidth: 1,
            },
        ],
    };

    const monthlyGraphData = {
        labels: monthlyData.map((entry) => `Month ${entry.Month}`),
        datasets: [
            {
                label: "Monthly Earnings ($)",
                data: monthlyData.map((entry) => entry.TotalEarnings),
                backgroundColor: "#3498db",
                borderColor: "#2c3e50",
                borderWidth: 1,
            },
        ],
    };

    const transactionYearlyData = {
        labels: lastData.map((data) => data.Year),
        datasets: [
            {
                label: "Total Earnings ($)",
                data: lastData.map((data) => data.TotalAmount),
                backgroundColor: "#3498DB",
                borderColor: "#21618C",
                borderWidth: 1,
            },
        ],
    };


    return (
        <div className="expenses-container">
            <h2>Hotel Financial Overview</h2>
            <div className="button-container">
                <button onClick={() => setSelectedGraph("yearly")}>Hotel Financial Overview</button>
                <button onClick={() => setSelectedGraph("yearly-transactions")}>Yearly Transaction Earnings</button>
                <button onClick={() => setSelectedGraph("monthly-transactions")}>Monthly Transaction Earnings</button>
            </div>

            <div className="chart-container">
                {selectedGraph === "yearly" && <Bar data={yearlyGraphData} options={{ responsive: true, maintainAspectRatio: false }} />}
                {selectedGraph === "yearly-transactions" && <Bar data={transactionYearlyData} options={{ responsive: true, maintainAspectRatio: false }} />}
                {selectedGraph === "monthly-transactions" && <Bar data={monthlyGraphData} options={{ responsive: true, maintainAspectRatio: false }} />}
            </div>
        </div>
    );
};

export default Manexpenses;
