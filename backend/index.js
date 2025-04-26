const express = require("express");
const cors = require("cors");
const db = require("./dbconn"); 
const checkoutRoutes = require("./routes/receptionistRoutes/checkout");
const receptionist_dashboard_routes = require("./routes/receptionistRoutes/receptionist_dashboard");
const featuresRoutes = require("./routes/receptionistRoutes/featuresRoute");
const realCheckout = require("./routes/receptionistRoutes/realCheckoutRoute");
const employeeRoute = require("./routes/managerRoutes/employeeRoute");
const ManexpensesRoute = require("./routes/managerRoutes/ManExpensesRoute");
const AdminDashBoard = require("./routes/adminRoutes/updateManagerRoute");
const AdminHotel = require("./routes/adminRoutes/adminHotelRoutes.js");
const manRoomRoute = require("./routes/managerRoutes/roomsRoute");
const inventoryRoutes = require("./routes/managerRoutes/inventoryRoutes.js");
const expenseRoutes = require("./routes/adminRoutes/expenseRoutes.js")
const resetPasswordRoute = require("./routes/Public/resetPasswordRoute.js");
const authRoutes = require("./auth.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(AdminDashBoard);
app.use(receptionist_dashboard_routes);
app.use(checkoutRoutes);
app.use(featuresRoutes);

app.use(inventoryRoutes);

app.use(realCheckout);
app.use(employeeRoute);
app.use(ManexpensesRoute);
app.use(AdminHotel);
app.use(manRoomRoute);
app.use(expenseRoutes);

app.use(resetPasswordRoute);


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
