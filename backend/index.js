const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Pi@31416",
    database: "hotelmanagementsystem",
});





app.get("/employees", (req, res) => {
  db.query("SELECT * FROM hotelmanagementsystem.employee;", (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send("Error fetching employees.");
      } else {
          res.send(result);
      }
  });
});

app.post("/add-guest", (req, res) => {
  const FirstName = req.body.firstName;
  const LastName = req.body.lastName;
  const PhoneNumber = req.body.phoneNumber;
  const EmailAddress = req.body.email;
  const DateOfBirth = req.body.dob;
  const NID = req.body.nid;
  const HotelID = req.body.HotelID;




  console.log("Request Body:", req.body);
  console.log(FirstName,LastName,EmailAddress);

  const sqlInsert = `INSERT INTO Guest (FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID) VALUES (?,?,?,?,?,?,?)`;

  db.query(sqlInsert, [FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID], (err, result) => {
      if (err) {
          console.error("Error inserting guest:", err);
          res.status(500).send({ message: "Error adding guest", error: err });
      } else {
          res.send({ message: "Guest added successfully!", data: result });
      }
  });
});

app.get("/available-rooms", (req, res) => {
  db.query("SELECT * FROM hotelmanagementsystem.room where status = 'Available';", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
  
    }
  });
});
  


app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});