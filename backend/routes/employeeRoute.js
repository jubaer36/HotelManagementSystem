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


module.exports = router;