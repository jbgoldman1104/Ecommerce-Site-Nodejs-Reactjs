const express = require("express");
const moment = require("moment"); // require
const { User, Product, Order } = require("../db/");
const { getErrors } = require("../helpers");
const auth = require("./middlewares/auth");
const orderRouter = express.Router();
const { sendMail, generatePDF } = require("../mail");
const { orderPDF } = require("../mail");
// Returns all orders with its details
orderRouter.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send({ status: true, orders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Generates pdf for order with id: oid
orderRouter.get("/api/pdf/:oid", async (req, res) => {
  try {
    const { oid } = req.params;
    const order = await Order.findById(oid);

    if (!order) {
      throw new Error(`no order ${oid}`);
    }
    const customer = order.customer;
    if (customer && Array.isArray(customer) && customer[0]) {
      const c = await User.findById(customer[0]);
      if (c) {
        orderPDF(`${order._id}.pdf`, c.username, "Your order", order);
      }
      return res.send({ status: true, url: `/${order._id}.pdf` });
    }
    orderPDF(`${order._id}.pdf`, undefined, "Your order", order);

    res.send({ status: true, url: `/${order._id}.pdf` });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Takes start and end date, returns orders in this date range.
orderRouter.post("/api/range", async (req, res) => {
  try {
    const { start, end } = req.body;
    if (!start || !end) {
      throw new Error(`invalid start: ${start} or end: ${end}`);
    }

    let startDate = new Date(start);
    let endDate = new Date(end);
    console.log(`start: ${startDate}\nend: ${endDate}`);

    const orders = await Order.find({});
    const validOrders = [];
    for (order of orders) {
      if (order && order.date) {
        if (
          moment(startDate).isBefore(order.date) &&
          moment(endDate).isAfter(order.date)
        ) {
          validOrders.push(order);
        } else {
          console.log("date zort: ", order.date);
        }
      }
    }
    res.send({ status: true, orders: validOrders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Get orders of the user specified by 'id' param.
orderRouter.get("/api/orders/:id", async (req, res) => {
  try {
    // get user id
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      throw new Error(`no such a user ${id}`);
    }
    user = user.toObject();
    const orders = user.orders;

    // Obtain details of order (status and produc fields)
    const details = [];
    for (order of orders) {
      if (order) {
        const detail = await Order.findById(order);
        details.push(detail);
      }
    }

    res.send({ status: true, orders: details });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Add product to order of the user specified by req.body.token
orderRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;
    const orders = req.user.cart;

    // const orders = req.user.orders;
    if (!Array.isArray(orders)) {
      throw new Error("invalid user orders.");
    }

    // Initialize text to send via mail
    let mailText =
      (toPDF = `Hey ${req.user.username}! Thank you for your purchase :)\n
    You can find your order details below. \n\n
${req.user.userEmail}
${address}\n\n`);

    let products = [];
    let PDFOrders = [];
    let PDFOrder = {};
    let totalPrice = 0;
    let count = 0;
    const productURL = "http://localhost:3000/product/";
    for (let pid of orders) {
      const prod = await Product.findById(pid);
      if (prod) {
        count++;
        prod.stock -= 1;

        PDFOrder = {
          unitPrice: prod.unitPrice,
          URL: `${productURL}${prod._id}`,
          productName: prod.productName,
          count,
        };
        PDFOrders.push(PDFOrder);

        products.push(prod);
        prod.save();
        totalPrice += prod.unitPrice;
        mailText += `${count}- ${prod.productName} - ${PDFOrder.URL}\n${prod.unitPrice}$\n\n`;
      }
    }

    PDFOrders.push(totalPrice);
    mailText += `\nTotal ${totalPrice}$\n\n`;

    var datetime = new Date();
    datetime = datetime.toISOString().slice(0, 10);
    console.log(datetime);

    // Create new order
    const newOrder = new Order({
      products,
      status: 0,
      address,
      customer: userId,
      date: datetime,
    });

    // Push new order to the user's 'orders'
    // User is obtained through JWT token.
    let user = req.user;
    user.orders.push(newOrder);
    user.cart = [];

    // Save updated user and new order.
    user = await User.findByIdAndUpdate(userId, user, { new: true });
    await newOrder.save();

    // Generate file name for the PDF file that will store the information about given order as;
    // <user_email>'<order_unique_id>.pdf
    const PDFFileName = `${req.user.userEmail}'${newOrder._id}.pdf`;
    const PDFFilePath = generatePDF(
      PDFFileName,
      toPDF,
      `Order Summary`,
      mailText,
      PDFOrders
    );
    sendMail(
      user.userEmail,
      `Your Order from BasketStore`,
      mailText,
      PDFFilePath
    );

    res.send({ status: true, orders: user.toObject().orders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Update the order
orderRouter.put("/api/order/:oid", async (req, res) => {
  try {
    const oid = req.params.oid;
    const status = req.body.status;

    // Update order based on its ID.
    const newOrder = await Order.findByIdAndUpdate(
      oid,
      { status },
      { new: true }
    );
    if (!newOrder) {
      throw new Error(`cannot find order ${oid}`);
    }

    res.send({ status: true, order: newOrder });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// refund the order
orderRouter.put("/api/refund/:oid", async (req, res) => {
  try {
    const oid = req.params.oid;
    const refund = req.body.refund;

    const order = await Order.findById(oid);
    if (!order) {
      throw new Error(`cannot find order ${oid}`);
    }
    if (order.refund === 2) {
      throw new Error(`order ${oid} is already refunded`);
    }
    let customer = order.customer;
    if (customer) {
      customer = order.customer[0];
    }
    const c = await User.findById(customer);
    // Update order based on its ID.
    const newOrder = await Order.findByIdAndUpdate(
      oid,
      { refund },
      { new: true }
    );
    if (!newOrder) {
      throw new Error(`cannot find order ${oid}`);
    }
    newOrder.customer = c;
    res.send({ status: true, order: newOrder });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// get all refunded order
orderRouter.get("/api/refunds", async (req, res) => {
  try {
    // Update order based on its ID.

    const orders = await Order.find({});
    const refunds = [];
    for (let order of orders) {
      if (order && order.refund !== 0) {
        let customer = order.customer;
        if (customer) {
          customer = order.customer[0];
        }
        const c = await User.findById(customer);
        order = order.toObject();
        order["customer"] = c;
        refunds.push(order);
      }
    }

    res.send({ status: true, refunds });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Delete the order
orderRouter.post("/api/order/:oid", auth, async (req, res) => {
  try {
    const oid = req.params.oid;

    // Check if order is deleted successfully.
    const deleted = await Order.findByIdAndDelete(oid);
    if (!deleted) {
      throw new Error(`cannot delete order ${oid}`);
    }

    // Get user
    let user = await User.findById(req.user._id);
    // Delete order from its orders.
    const orders = user.orders;
    const updatedOrders = orders.filter((order) => {
      return order._id != oid;
    });
    // update user.orders and save it
    user.orders = updatedOrders;
    await User.findByIdAndUpdate(user._id, user, { new: true });
    res.send({ status: true, orders: updatedOrders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { orderRouter };
