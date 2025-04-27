const express = require("express");
const router = express.Router();
const db = require("../../dbconn");
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// ✅ Get Available Rooms
router.get("/get-available-rooms/:hotelID", async (req, res) => {
    const hotelID = req.params.hotelID;

    const sql = `
        SELECT Room.RoomID, Room.RoomNumber, Room.BasePrice, Room.MaxOccupancy, 
               Room_Class.ClassType, Room.RoomImage
        FROM Room 
        JOIN Room_Class ON Room.RoomClassID = Room_Class.RoomClassID
        WHERE Room.HotelID = ?
    `;

    try {
        const [rows] = await db.promise().query(sql, [hotelID]);

        // Convert RoomImage blob to Base64
        const rooms = rows.map(room => ({
            ...room,
            RoomImage: room.RoomImage ? room.RoomImage.toString('base64') : null
        }));

        res.status(200).json(rooms);
    } catch (err) {
        console.error("Error fetching available rooms:", err);
        res.status(500).send("Error fetching available rooms");
    }
});

// ✅ Get Room Classes
router.get("/get-room-classes", (req, res) => {
    const sql = "SELECT * FROM Room_Class";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching room classes:", err);
            res.status(500).send("Error fetching room classes");
        } else {
            res.status(200).json(result);
        }
    });
});

// ✅ Update Room
router.put("/update-room/:roomID", (req, res) => {
    const { classTypeID, basePrice, maxOccupancy } = req.body;
    const roomID = req.params.roomID;

    const sql = `
        UPDATE Room 
        SET RoomClassID = ?, BasePrice = ?, MaxOccupancy = ? 
        WHERE RoomID = ?
    `;

    db.query(sql, [classTypeID, basePrice, maxOccupancy, roomID], (err, result) => {
        if (err) {
            console.error("Error updating room:", err);
            res.status(500).send("Error updating room details");
        } else {
            res.status(200).send("Room updated successfully");
        }
    });
});

// ✅ Add New Room
router.post('/add-room', upload.single('roomImage'), async (req, res) => {
    const { hotelID, roomNumber, roomClassID, maxOccupancy, basePrice } = req.body;
    const roomImage = req.file ? req.file.buffer : null;

    try {
        if (!hotelID || !roomNumber || !roomClassID || !maxOccupancy || !basePrice || !roomImage) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const bookingID = 1; // Temporary bookingID

        await db.promise().query(
            `INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, MaxOccupancy, BasePrice, RoomImage)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [roomNumber, roomClassID, hotelID, bookingID, maxOccupancy, basePrice, roomImage]
        );

        res.status(201).json({ message: 'Room added successfully' });
    } catch (err) {
        console.error('Add Room Error:', err);
        res.status(500).json({ error: 'Failed to add room', details: err.message });
    }
});

module.exports = router;
