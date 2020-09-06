var express = require('express');
var router = express.Router();

var fs = require('fs');
var Cart = require('../models/cart');

var menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));

router.get('/favicon.ico', (req,res)=>{
  return 'your faveicon'
 })

router.get('/:table', function (req, res, next) {
  console.log(req.params.table);
  req.session.table = req.params.table;
  console.log(req.session.table);
  console.log(req.sessionID);
  if (!req.session.cart) {
    return res.render('menu', {
      title: 'Menu',
      menu,
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
  var order = (cart.orderedDishes) ? cart.orderedDishes : null;
  res.render('menu', {
    title: 'Menu',
    menu,
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
  console.log(`add ${req.session.table}`);
  var categoryId = req.body.category;
  var dishId = req.body.id;
  var qty = parseInt(req.body.qty);
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var dish = menu[categoryId].filter(function (dishItem) {
    return dishItem.id === dishId;
  });
  cart.add(dish[0], qty, dishId);
  req.session.cart = cart;
  res.redirect(`/${req.session.table}#${categoryId}`);
});

router.get('/remove/:id', function (req, res, next) {
  var dishId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeAll(dishId);
  req.session.cart = cart;
  res.redirect('/');
});

router.post('/remove', function (req, res, next) {
  var dishId = req.body.id;
  var qty = req.body.qty;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(dishId, qty);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/order', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if (cart.getDishes()) {
    cart.order();
  }
  req.session.cart = cart;
  res.redirect('/');
});

module.exports = router;