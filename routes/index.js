const mongoose = require("mongoose");
var express = require('express');
var router = express.Router();

var fs = require('fs');
var Cart = require('../models/cart');
const { json } = require("body-parser");

var menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));

const orderSchema = new mongoose.Schema({
  name: String,
  received: String,
  accepted: String,
  checkout: String,
  delivered: String
});

const Order = mongoose.model("Order", orderSchema);

router.get('/favicon.ico', (req, res) => {
  return 'your faveicon'
})

router.get('/:table', function (req, res, next) {
  if(req.session.checkout){return res.redirect('/area/bill')}
  if(!req.session.table){req.session.table = req.params.table;}
  if(!req.session.activeCategory){req.session.activeCategory = "";}
  if(!req.session.clickCategory){req.session.clickCategory = "";}
  if (!req.session.cart) {
    return res.render('menu', {
      title: 'Menu',
      menu,
      activeCategory: req.session.activeCategory,
      clickCategory: req.session.clickCategory,
      cartDishes: null,
      cartTotalprice: 0,
      cartTotalqty: 0,
      orderedDishes: null,
      orderedTotalprice: 0,
      orderedTotalqty: 0,
      totalprice: 0,
      totalqty: 0
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('menu', {
    title: 'Menu',
    menu,
    activeCategory: req.session.activeCategory,
    clickCategory: req.session.clickCategory,
    cartDishes: cart.getDishes(),
    cartTotalprice: cart.cartTotalPrice,
    cartTotalqty: cart.cartTotalDishes,
    orderedDishes: cart.getOrder(),
    orderedTotalprice: cart.orderedTotalPrice,
    orderedTotalqty: cart.orderedTotalDishes,
    totalprice: cart.totalPrice,
    totalqty: cart.totalDishes
  });
});

router.post('/add', function (req, res, next) {
  var categoryId = req.body.category;
  var dishId = req.body.id;
  var qty = parseInt(req.body.qty);
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if(!cart.table){cart.table = req.session.table;}
  var dish = menu[categoryId].filter(function (dishItem) {
    return dishItem.id === dishId;
  });
  cart.add(dish[0], qty, dishId);
  req.session.cart = cart;
  req.session.clickCategory = categoryId;
  req.session.activeCategory = dishId;
  res.redirect(`/${cart.table}`);
});

router.get('/remove/:id/:cid', function (req, res, next) {
  var categoryId = req.params.cid;
  var dishId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeAll(dishId);
  req.session.cart = cart;
  req.session.clickCategory = categoryId;
  req.session.activeCategory = dishId;
  res.redirect(`/${cart.table}`);
});

router.post('/remove', function (req, res, next) {
  var categoryId = req.body.cid;
  var dishId = req.body.id;
  var qty = req.body.qty;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(dishId, qty);
  req.session.cart = cart;
  req.session.clickCategory = categoryId;
  req.session.activeCategory = dishId;
  res.redirect(`/${cart.table}`);
});

router.get('/place/order', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var temp = JSON.stringify(cart.dishes);
  Order.findOne({name: cart.table}, function(err, order){
    if(order){
      if(order.received){
        var orderedDishesDb = JSON.parse(order.received);
        var tempobj = JSON.parse(temp);
        for(id in tempobj){
          if(orderedDishesDb[id]){
            orderedDishesDb[id].quantity += tempobj[id].quantity
            orderedDishesDb[id].price += tempobj[id].price
          }else{
            orderedDishesDb[id] = JSON.parse(JSON.stringify(tempobj[id]));
          }
        }
        order.received = JSON.stringify(orderedDishesDb);
        res.io.emit("order", {name: order.name,received: orderedDishesDb});
      }else{
        order.received = temp;
        res.io.emit("order", {name: order.name,received: JSON.parse(order.received)});
      }
      order.save();
    }else{
      const order = new Order({
        name: cart.table,
        received: temp,
        accepted: "",
        prepared: "",
        delivered: ""
      });
      order.save();
      res.io.emit("newOrder", {name: cart.table,received: JSON.parse(temp)});
    }
  });
  if (cart.getDishes()) {
    cart.order();
  }
  req.session.cart = cart;
  req.session.clickCategory = "";
  req.session.activeCategory = "";
  res.redirect(`/${cart.table}`);
});

router.get('/distroy/:table', function (req, res, next) {
  // cart checkout activewala
  req.session.cart = "";
  req.session.checkout = false;
  req.session.activeCategory = "";
  req.session.clickCategory = "";
  req.session.save();
  res.redirect(`/${req.session.table}`)
});

module.exports = router;