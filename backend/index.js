const express = require("express");
const cors = require("cors");
const db = require("./dbconn"); 
const checkoutRoutes = require("./routes/checkout");
const receptionist_dashboard_routes = require("./routes/receptionist_dashboard");
const featuresRoutes = require("./routes/featuresRoute");
const inventoryRoutes = require("./routes/inventoryRoutes")

const realCheckout = require("./routes/realCheckoutRoute");
const employeeRoute = require("./routes/employeeRoute.js");
const ManexpensesRoute = require("./routes/ManExpensesRoute.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use(receptionist_dashboard_routes);

app.use(checkoutRoutes);

app.use(featuresRoutes);

app.use(inventoryRoutes);

app.use(realCheckout);

app.use(employeeRoute);
// Start the server

app.use(ManexpensesRoute);


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
