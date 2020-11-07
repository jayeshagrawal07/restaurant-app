const mongoose = require("mongoose");
var express = require('express');
var router = express.Router();

var fs = require('fs');
var Cart = require('../models/cart');

var menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));

// const orderSchema = new mongoose.Schema({
//   name: String,
//   received: String,
//   accepted: String,
//   delivered: String
// });

const Order = mongoose.model("Order");

/* GET users listing. */
router.get('/manager', function (req, res, next) {
  // res.io.on("socketToMe", data => {
  //   console.log(data);
  //   req.session.data = data;
  //   // res.send('respond with a resource ' + data);
  // });
  // res.send('respond');
  // if (!req.session.activeCategory) {
  //   req.session.activeCategory = "";activeCategory: req.session.activeCategory,
  // }

  Order.find({}, '-_id', function (err, orders) {
    // console.log(orders);
    res.render('manager', {
      title: 'Manager',
      orders
    });
  });
});

router.get("/post-received/:table", function (req, res) {
  var table = req.params.table;
  Order.findOne({
    name: table
  }, function (err, order) {
    if (order) {
      if (order.accepted) {
        var received = JSON.parse(order.received);
        var accepted = JSON.parse(order.accepted);
        for (id in received) {
          if (accepted[id]) {
            accepted[id].quantity += received[id].quantity;
            accepted[id].price += received[id].price;
          } else {
            accepted[id] = JSON.parse(JSON.stringify(received[id]));
          }
        }
        order.accepted = JSON.stringify(accepted);
        order.received = "";
      } else {
        order.accepted = order.received;
        order.received = "";
      }
      order.save();
      res.redirect(`/area/manager?table=${order.name}&accepted=true`)
    }
  });
});

router.get("/post-delivered/:table", function (req, res) {
  var table = req.params.table;
  Order.findOne({
    name: table
  }, function (err, order) {
    if (order) {
      if (order.delivered) {
        var accepted = JSON.parse(order.accepted);
        var delivered = JSON.parse(order.delivered);
        for (id in delivered) {
          if (delivered[id]) {
            delivered[id].quantity += accepted[id].quantity;
            delivered[id].price += accepted[id].price;
          } else {
            accepted[id] = JSON.parse(JSON.stringify(accepted[id]));
          }
        }
        order.delivered = JSON.stringify(delivered);
        order.accepted = "";
      } else {
        order.delivered = order.accepted;
        order.accepted = "";
      }
      order.save();
      res.redirect(`/area/manager?table=${order.name}&delivered=true`)
    }
  });
});

router.get("/bill", function (req, res) {
  var table = req.session.table;
  var cart = req.session.cart ? new Cart(req.session.cart):null;
  if (cart && cart.getOrder()) {
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    var today = new Date();
    res.render('bill', {
      title: 'Bill',
      table,
      orders: cart.getOrder(),
      amount: cart.orderedTotalPrice,
      date: today.toLocaleDateString("en-US", options),
      billno: ++menu.billno
    });
      req.session.activeCategory = null;
      req.session.cart = null;
  }else{
    res.redirect(`/${table}`);
  }
});

module.exports = router;