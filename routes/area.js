const mongoose = require("mongoose");
var express = require('express');
var router = express.Router();

var fs = require('fs');
var Cart = require('../models/cart');

var menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));

const Order = mongoose.model("Order");

const billSchema = new mongoose.Schema({
    table: String,
    orders: Array,
    amount: Number,
    date: Date,
    billno: Number
});

const Bill = mongoose.model("Bill", billSchema);

router.get('/manager', function(req, res, next) {
    Order.find({}, '-_id', function(err, orders) {
        // console.log(orders);
        res.render('manager', {
            title: 'Manager',
            orders
        });
    });
});

router.get('/manager/bill', function(req, res, next) {
    var billno = req.query.billno ? req.query.billno : null;
    console.log(typeof(billno));
    var find = billno ? { billno } : {};
    Bill.find(find, function(err, bills) {
        if (err) {
            res.send(err)
        }
        if (bills) {
            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: "Asia/Kolkata"
            };
            res.render('view-bill', {
                title: 'Manager',
                bills,
                options
            })
        } else {
            res.redirect('/area/manager')
        }
    });
});

router.get("/post-received/:table", function(req, res) {
    var table = req.params.table;
    Order.findOne({
        name: table
    }, function(err, order) {
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

router.get("/post-delivered/:table", function(req, res) {
    var table = req.params.table;
    Order.findOne({
        name: table
    }, function(err, order) {
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

router.get("/bill", function(req, res) {
    var cart = req.session.cart ? new Cart(req.session.cart) : null;
    if (cart && cart.getOrder()) {
        if (!req.session.billno) {
            req.session.billno = ++menu.billno;
            fs.writeFileSync('./data/menu.json', JSON.stringify(menu))
        }
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: "Asia/Kolkata"
        };
        var today = new Date();
        req.session.checkout = true;
        req.session.save();
        var checkoutObj = {
            title: 'Bill',
            table: req.session.table,
            orders: cart.getOrder(),
            amount: cart.orderedTotalPrice,
            date: today.toLocaleDateString("en-US", options),
            billno: req.session.billno
        }
        Order.findOne({ name: cart.table }, function(err, order) {
            if (order) {
                order.checkout = JSON.stringify({...checkoutObj, jsDate: today });
                order.save();
            }
        });
        res.io.emit("bill", {...checkoutObj });
        res.render('bill', {...checkoutObj });
    } else {
        res.redirect(`/${req.session.table}`);
    }
});

router.get("/paid/:table", function(req, res) {
    var table = req.params.table;
    Order.findOneAndDelete({ name: table }, function(err, order) {
        if (err) {
            console.log(err);
        } else {
            const bill = new Bill({
                table: table,
                orders: JSON.parse(order.checkout).orders,
                amount: JSON.parse(order.checkout).amount,
                date: JSON.parse(order.checkout).jsDate,
                billno: JSON.parse(order.checkout).billno
            });
            bill.save();
            // console.log(order);
        }
    });
    res.io.emit(`distroy-${table}`, {});
    res.redirect(`/area/manager`)
});

module.exports = router;