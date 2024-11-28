const express = require("express");
const cors = require("cors");
const db = require("./dbconn"); 
const checkoutRoutes = require("./routes/checkout");
const receptionist_dashboard_routes = require("./routes/receptionist_dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use(receptionist_dashboard_routes);

app.use(checkoutRoutes);


// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
