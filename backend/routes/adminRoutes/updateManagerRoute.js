const express = require("express");
const router = express.Router();
const db = require("../../dbconn");


router.post("/show-managers", (req, res) => {


    const query = `
        SELECT 
            e.EmpID, 
            CONCAT(e.FirstName, ' ', e.LastName) AS FullName, 
            e.hourly_pay, 
            d.DeptName,
            e.Email,
            e.Phone,
            e.HiredDate
        FROM Employee e
        INNER JOIN Department d ON e.DeptID = d.DeptID
        WHERE e.working_status = 'Working' AND e.Role = 'manager';
    `;
    console.log(query);

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching employees:", err);
            res.status(500).send("Error fetching employees.");
        } else {
            res.send(results);
        }
    });
});


router.post("/all-hotels", (req, res) => {

    const query = `
        SELECT HotelID, Name FROM Hotel;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching departments:", err);
            return res.status(500).send("Error fetching departments.");
        }
        res.send(results);
    });
});

router.post("/find-departments", (req, res) => {
    const { hotelID } = req.body;
    console.log("hotelid from BE: ", hotelID);

    const query = `
        SELECT DeptID FROM department WHERE HotelID = ? AND DeptName = 'Maintenance';
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching departments:", err);
            return res.status(500).send("Error fetching departments.");
        }
        // console.log("results from BE: ", results);
        res.send(results);
    });
}
);

router.post("/remove-employee", (req, res) => {
    const { empID } = req.body;

    const query = `
        UPDATE Employee
        SET working_status = 'Not Working'
        WHERE EmpID = ?;
    `;

    db.query(query, [empID], (err, result) => {
        if (err) {
            console.error("Error updating employee status:", err);
            return res.status(500).send("Error updating employee status.");
        }
        res.send("Employee status updated successfully.");
    });
});


router.post("/update-manager", (req, res) => {
    const {
        empID, firstName, lastName,
        phone, email, hourlyPay,
        hiredDate
    } = req.body;

    const updateQuery = `
        UPDATE Employee
        SET FirstName = ?, LastName = ?, Phone = ?, Email = ?,
            hourly_pay = ?, HiredDate = ?
        WHERE EmpID = ?
    `;

    db.query(updateQuery, [
        firstName, lastName, phone, email,
        hourlyPay, hiredDate, empID
    ], (err, result) => {
        if (err) {
            console.error("Error updating manager:", err);
            return res.status(500).send("Error updating manager.");
        }
        res.send("Manager updated successfully.");
    });
});
router.post("/filter-managers", (req, res) => {
    const { FullName, Email, Phone } = req.body;

    let query = `
        SELECT E.EmpID, CONCAT(E.FirstName, ' ', E.LastName) AS FullName,
               D.DeptName, E.Email, E.Phone, E.hourly_pay, E.HiredDate
        FROM Employee E
        JOIN Department D ON E.DeptID = D.DeptID
        WHERE E.Role = 'Manager' AND E.FirstName <> 'System'
    `;
    const params = [];

    if (FullName) {
        query += " AND CONCAT(E.FirstName, ' ', E.LastName) LIKE ?";
        params.push(`%${FullName}%`);
    }
    if (Email) {
        query += " AND E.Email LIKE ?";
        params.push(`%${Email}%`);
    }
    if (Phone) {
        query += " AND E.Phone LIKE ?";
        params.push(`%${Phone}%`);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error filtering managers:", err);
            return res.status(500).send("Error filtering managers");
        }
        res.send(results);
    });
});


module.exports = router;