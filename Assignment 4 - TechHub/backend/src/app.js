const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
