const express = require("express");
const cors = require("cors");
const db = require("./dbconn"); 
const checkoutRoutes = require("./routes/checkout");
const receptionist_dashboard_routes = require("./routes/receptionist_dashboard");
const featuresRoutes = require("./routes/featuresRoute");
const realCheckout = require("./routes/realCheckoutRoute");
const employeeRoute = require("./routes/employeeRoute.js");
const ManexpensesRoute = require("./routes/ManExpensesRoute.js");
const AdminDashBoard = require("./routes/adminDashBoardRoute.js");
const authRoutes = require("./auth.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(AdminDashBoard);
app.use(receptionist_dashboard_routes);
app.use(checkoutRoutes);
app.use(featuresRoutes);
app.use(realCheckout);
app.use(employeeRoute);
app.use(ManexpensesRoute);


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
