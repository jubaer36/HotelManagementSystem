const express = require("express");
const router = express.Router();
const db = require("../dbconn");

router.post("/employees", (req, res) => {
    const { hotelID } = req.body;

    const query = `
        SELECT 
            e.EmpID, 
            CONCAT(e.FirstName, ' ', e.LastName) AS FullName, 
            e.hourly_pay, 
            d.DeptName
        FROM Employee e
        INNER JOIN Department d ON e.DeptID = d.DeptID
        WHERE d.HotelID = ? AND e.working_status = 'Working' ;
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching employees:", err);
            res.status(500).send("Error fetching employees.");
        } else {
            res.send(results);
        }
    });
});



router.post("/employee-details", (req, res) => {
    const { empID } = req.body;

    const query = `
        SELECT 
            e.EmpID, e.DeptID, e.FirstName, e.LastName, e.Phone, e.Email,
            e.hourly_pay, e.Salary, e.Role, e.HiredDate, e.Address, d.DeptName
        FROM Employee e
        INNER JOIN Department d ON e.DeptID = d.DeptID
        WHERE e.EmpID = ?;
    `;

    db.query(query, [empID], (err, results) => {
        if (err) {
            console.error("Error fetching employee details:", err);
            res.status(500).send("Error fetching employee details.");
        } else if (results.length === 0) {
            res.status(404).send("No employee found.");
        } else {
            res.send(results[0]); // Send first result
        }
    });
});

// Update hourly pay
router.post("/update-hourly-pay", (req, res) => {
    const { empID, newHourlyPay } = req.body;

    if (!empID || !newHourlyPay || newHourlyPay <= 0) {
        return res.status(400).send("Invalid request data.");
    }

    const query = `UPDATE Employee SET hourly_pay = ? WHERE EmpID = ?`;

    db.query(query, [newHourlyPay, empID], (err, result) => {
        if (err) {
            console.error("Error updating hourly pay:", err);
            res.status(500).send("Error updating hourly pay.");
        } else {
            res.send("Hourly pay updated successfully.");
        }
    });
});


// 🔹 Fetch Available Departments for the Hotel
router.post("/departments", (req, res) => {
    const { hotelID } = req.body;

    const query = `
        SELECT DeptID, DeptName FROM Department WHERE HotelID = ?;
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching departments:", err);
            return res.status(500).send("Error fetching departments.");
        }
        res.send(results);
    });
});

// 🔹 Insert New Employee
router.post("/add-employee", (req, res) => {
    const { deptID, firstName, lastName, phone, email, hourlyPay, salary, workingStatus, role, hiredDate, address } = req.body;

    const query = `
        INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, hourly_pay, working_status, Role, HiredDate, Address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(query, [deptID, firstName, lastName, phone, email, hourlyPay, workingStatus, role, hiredDate, JSON.stringify(address)], (err, result) => {
        if (err) {
            console.error("Error adding employee:", err);
            return res.status(500).send("Error adding employee.");
        }
        res.send("Employee added successfully.");
    });
});



module.exports = router;