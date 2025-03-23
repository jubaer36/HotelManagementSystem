const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./dbconn.js");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM Users WHERE Username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error("Error fetching user: ", err);
    }

    if (result.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    const token = jwt.sign(
      {
        userID: user.UserID,
        role: user.Role,
        username: user.Username,
        hotelID: user.HotelID,
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.json({ token, role: user.Role, hotelID: user.HotelID, userID: user.UserID });
  });
});

const verifyToken = (role) => (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Access denied");
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);

    if (decoded.role != role) {
      return res.status(403).send("Unauthorized Access");
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

router.get("/rp-dashboard", verifyToken("receptionist"), (req, res) => {
  res.send("Welcome to the Receptionist Dashboard");
});

router.get("/manager-dashboard", verifyToken("manager"), (req, res) => {
  res.send("Welcome to the Manager Dashboard");
});

router.get("/admin-dashboard", verifyToken("admin"), (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

module.exports = router;