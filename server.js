const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const ordersFile = path.join(__dirname, "orders.json");

// Create database file automatically
if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]");
}

// Get all orders
app.get("/api/orders", (req, res) => {

    const orders = JSON.parse(
        fs.readFileSync(ordersFile, "utf8")
    );

    res.json(orders);
});

// Place new order
app.post("/api/orders", (req, res) => {

    const {
        customerName,
        phone,
        address,
        city,
        pincode,
        items,
        total
    } = req.body;

    if (
        !customerName ||
        !phone ||
        !address ||
        !city ||
        !pincode ||
        !items ||
        items.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all details"
        });
    }

    const orders = JSON.parse(
        fs.readFileSync(ordersFile, "utf8")
    );

    const newOrder = {

        id: "ORD-" + Date.now(),

        customerName,
        phone,
        address,
        city,
        pincode,

        items,

        total,

        status: "Pending",

        date: new Date().toLocaleString("en-IN")
    };

    orders.push(newOrder);

    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders, null, 2)
    );

    res.json({
        success: true,
        message: "Order placed successfully",
        orderId: newOrder.id
    });
});

// Update order status
app.put("/api/orders/:id", (req, res) => {

    const orders = JSON.parse(
        fs.readFileSync(ordersFile, "utf8")
    );

    const order = orders.find(
        o => o.id === req.params.id
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    order.status = req.body.status;

    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders, null, 2)
    );

    res.json({
        success: true
    });
});

app.listen(PORT, () => {

    console.log(`
=================================
      ShopEase Server
=================================

Website:
http://localhost:${PORT}

Admin Panel:
http://localhost:${PORT}/admin.html

=================================
    `);
});