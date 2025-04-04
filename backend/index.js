const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors")
const connectToDb = require("./config/db.config");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes")

dotenv.config()
connectToDb();

const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/user", authRoutes);
app.use("/api/task", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})