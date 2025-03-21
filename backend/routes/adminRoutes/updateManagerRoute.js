const express = require("express");
const router = express.Router();
const db = require("../../dbconn");


router.post("/show-managers", (req, res) => {


    const query = `
        SELECT 
            e.EmpID, 
            CONCAT(e.FirstName, ' ', e.LastName) AS FullName, 
            e.hourly_pay, 
            d.DeptName
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


module.exports = router;