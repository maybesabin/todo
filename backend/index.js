require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors")
const connectToDb = require("./config/db.config");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes")
const adminRoutes = require("./routes/adminRoutes")

connectToDb();

const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/user", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/admin", adminRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})