const mongoose = require("mongoose");
var express = require('express');
var router = express.Router();

// const orderSchema = new mongoose.Schema({
//   name: String,
//   received: String,
//   accepted: String,
//   delivered: String
// });

const Order = mongoose.model("Order");

/* GET users listing. */
router.get('/kitchen', function (req, res, next) {
  // res.io.on("socketToMe", data => {
  //   console.log(data);
  //   req.session.data = data;
  //   // res.send('respond with a resource ' + data);
  // });
  // res.send('respond');
  // if (!req.session.activeCategory) {
  //   req.session.activeCategory = "";activeCategory: req.session.activeCategory,
  // }

  Order.find({}, '-_id' , function (err, orders) {
    // console.log(orders);
    res.render('kitchen', {
      title: 'Kitchen',
      orders
    });
  });

  // res.render('kitchen',{title: 'Kitchen',
  // activeCategory: req.session.activeCategory});
  // console.log(req.session.data);
  // res.render('j')
});

module.exports = router;