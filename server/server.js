const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorMiddleware");
require("dotenv").config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API Running",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});