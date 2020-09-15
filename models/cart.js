module.exports = function Cart(cart) {
    this.table = cart.table || null;
    this.dishes = cart.dishes || {};
    this.cartTotalDishes = cart.cartTotalDishes || 0;
    this.cartTotalPrice = cart.cartTotalPrice || 0;
    
    this.orderedDishes = cart.orderedDishes || {};
    this.orderedTotalDishes = cart.orderedTotalDishes || 0;
    this.orderedTotalPrice = cart.orderedTotalPrice || 0;
   
    this.totalDishes = cart.totalDishes || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function (dish, qty, id) {
        var cartDish = this.dishes[id];
        if (!cartDish) {
            cartDish = this.dishes[id] = {
                dish: dish,
                quantity: 0,
                price: 0
            };
        }
        this.totalPrice -= cartDish.price;
        this.cartTotalPrice -= cartDish.price;
        cartDish.quantity += qty;
        cartDish.price = cartDish.dish.price * cartDish.quantity;
        this.totalDishes += qty;
        this.cartTotalDishes += qty;
        this.totalPrice += cartDish.price;
        this.cartTotalPrice += cartDish.price;
    };

    this.removeAll = function (id) {
        this.totalDishes -= this.dishes[id].quantity;
        this.cartTotalDishes -= this.dishes[id].quantity;
        this.totalPrice -= this.dishes[id].price;
        this.cartTotalPrice -= this.dishes[id].price;
        delete this.dishes[id];
    };

    this.remove = function (id, qty) {
        if (qty != this.dishes[id].quantity) {
            var cartDish = this.dishes[id];
            var price = cartDish.price;
            cartDish.quantity -= qty;
            cartDish.price = cartDish.dish.price * cartDish.quantity;
            this.totalDishes -= qty;
            this.cartTotalDishes -= qty;
            this.totalPrice -= price - cartDish.price;
            this.cartTotalPrice -= price - cartDish.price;
            this.dishes[id] = cartDish;
        } else {
            this.removeAll(id);
        }
    };

    this.getDishes = function () {
        var arr = [];
        for (var id in this.dishes) {
            arr.push(this.dishes[id]);
        }
        return (arr.length === 0) ? null : arr;
    };

    this.order = function () {
        for (cartDish in this.dishes) {
            if (!this.orderedDishes[cartDish]) {
                this.orderedDishes[cartDish] = JSON.parse(JSON.stringify(this.dishes[cartDish]));
            }else{
                this.orderedDishes[cartDish].quantity += this.dishes[cartDish].quantity;
                this.orderedDishes[cartDish].price = this.orderedDishes[cartDish].dish.price * this.orderedDishes[cartDish].quantity;
            }
        }
        this.orderedTotalDishes += this.cartTotalDishes;
        this.orderedTotalPrice += this.cartTotalPrice;
        this.cartTotalDishes = 0;
        this.cartTotalPrice = 0;
        this.dishes = {};
    }

    this.getOrder = function () {
        var arr = [];
        if (this.orderedDishes) {
            for (var id in this.orderedDishes) {
                arr.push(this.orderedDishes[id]);
            }
        }
        return (arr.length === 0) ? null : arr;
    };
};