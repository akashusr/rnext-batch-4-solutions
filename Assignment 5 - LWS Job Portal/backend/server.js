require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes (to be imported)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/utils", require("./routes/utilRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {},
    });
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");

        // Sync models (force: false to avoid dropping tables)
        await sequelize.sync({ force: false });
        console.log("Database synced.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

startServer();
