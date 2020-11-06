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
});

router.get("/post-received/:table", function (req, res){
  var table = req.params.table;
  Order.findOne({name: table}, function(err, order){
    if(order){
      if(order.accepted){
        var received = JSON.parse(order.received);
        var accepted = JSON.parse(order.accepted);
        for(id in received){
          if(accepted[id]){
            accepted[id].quantity += received[id].quantity;
            accepted[id].price += received[id].price;
          }else{
            accepted[id] = JSON.parse(JSON.stringify(received[id]));
          }
        }
        order.accepted = JSON.stringify(accepted);
        order.received = "";
      }else{
        order.accepted = order.received;
        order.received = "";
      }
      order.save();
      res.redirect(`/area/kitchen?table=${order.name}&accepted=true`)
    }
  });
});

module.exports = router;