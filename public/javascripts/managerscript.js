var innital = function(){   var toRender = `<div class="row">
<div class="col-3 pt-2">
    <div id="tableSection" class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
        aria-orientation="vertical">
        <%orders.forEach((order,i) => {%>
        <%var activTableTab = i===0? "active":""; %>
        <a class="nav-link <%= activTableTab %>" id="v-pills-<%= order.name %>-tab" data-toggle="pill"
            href="#v-pills-<%= order.name %>" role="tab" aria-controls="v-pills-<%= order.name %>"
            aria-selected="false"><%= order.name %>
            <% if(order.received){ %>
                <i id="received-icon-<%= order.name %>" class="fas fa-concierge-bell" aria-hidden="true" style="
                float: right;
                font-size: 1.5rem;
                margin-left: 10px;
            "></i>
            <%}%>
            <% if(order.checkout){ %>
                <i id="bill-icon-<%= order.name %>" class="fas fa-file-invoice" aria-hidden="true" style="
                float: right;
                font-size: 1.5rem;
                margin-left: 10px;
            "></i>
            <%}%>
        </a>
        <%});%>

    </div>
</div>
<div class="col-9">
    <div id="orderSection" class="tab-content" id="v-pills-tabContent">

        <%orders.forEach((order,i) => {%>
        <%var activTableTab = i===0? "show  active":""; %>
        <div class="tab-pane fade <%= activTableTab %>" id="v-pills-<%= order.name %>" role="tabpanel"
            aria-labelledby="v-pills-<%= order.name %>-tab">
            <nav>
                <div class="nav nav-tabs my-2" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-received-<%= order.name %>-tab" data-toggle="tab"
                        href="#nav-received-<%= order.name %>" role="tab"
                        aria-controls="nav-received-<%= order.name %>" aria-selected="true">Received</a>
                    <a class="nav-item nav-link" id="nav-preparing-<%= order.name %>-tab" data-toggle="tab"
                        href="#nav-preparing-<%= order.name %>" role="tab"
                        aria-controls="nav-preparing-<%= order.name %>" aria-selected="false">Preparing</a>
                    <a class="nav-item nav-link" id="nav-delivered-<%= order.name %>-tab" data-toggle="tab"
                        href="#nav-delivered-<%= order.name %>" role="tab"
                        aria-controls="nav-delivered-<%= order.name %>" aria-selected="false">Delivered</a>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-received-<%= order.name %>" role="tabpanel"
                    aria-labelledby="nav-received-<%= order.name %>-tab">
                    <div id="received-<%= order.name %>" class="d-flex flex-wrap justify-content-between">

                        <% var received = order.received ? JSON.parse(order.received) : "" ;%>
                        <% if(received){for(dish in received){ %>
                        <div class="card mb-2">
                            <div class="card-body" style="padding: .5rem;">
                                <div class="ordered-dish-card">
                                    <div class="cart-dish-title"><%= received[dish].dish.name %> <span
                                            class="badge badge-dark">x<%= received[dish].quantity %></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%}%>
                        <div class="empty-card mb-2">
                            <div class="card-body" style="padding: .5rem;">

                            </div>
                        </div>
                        <%}else{%>
                        <h1>No New Order Received</h1>
                        <%}%>
                    </div>
                    <% if(received){ %>
                        <a type="button" id="accept-btn-<%= order.name %>"
                            href="/area/post-received/<%= order.name %>" class="btn btn-red">Accept</a>
                        <% } %>
                    </div>

                    <div class="tab-pane fade" id="nav-preparing-<%= order.name %>" role="tabpanel"
                        aria-labelledby="nav-preparing-<%= order.name %>-tab">
                        <div class="d-flex flex-wrap justify-content-between">

                            <% var preparing = order.accepted ? JSON.parse(order.accepted) : "" ;%>
                            <% if(preparing){for(dish in preparing){ %>
                            <div class="card mb-2">
                                <div class="card-body" style="padding: .5rem;">
                                    <div class="ordered-dish-card">
                                        <div class="cart-dish-title"><%= preparing[dish].dish.name %> <span
                                                class="badge badge-dark">x<%= preparing[dish].quantity %></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <%}%>
                        <div class="empty-card mb-2">
                            <div class="card-body" style="padding: .5rem;">

                            </div>
                        </div>
                        <%}else{%>
                            <h1>No Order Preparing</h1>
                            <%}%>
                    </div>
                    <% if(preparing){ %>
                            <a type="button" id="delivered-btn-<%= order.name %>"
                                href="/area/post-delivered/<%= order.name %>" class="btn btn-red">Deliver</a>
                            <% } %>
                        </div>
                        <div class="tab-pane fade" id="nav-delivered-<%= order.name %>" role="tabpanel"
                            aria-labelledby="nav-delivered-<%= order.name %>-tab">
                            <div class="d-flex flex-wrap justify-content-between">

                                <% var delivered = order.delivered ? JSON.parse(order.delivered) : "" ;%>
                                <% if(delivered){for(dish in delivered){ %>
                                <div class="card mb-2">
                                    <div class="card-body" style="padding: .5rem;">
                                        <div class="ordered-dish-card">
                                            <div class="cart-dish-title"><%= delivered[dish].dish.name %> <span
                                                    class="badge badge-dark">x<%= delivered[dish].quantity %></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <%}%>
                        <div class="empty-card mb-2">
                            <div class="card-body" style="padding: .5rem;">

                            </div>
                        </div>
                        <%}else{%>
                                <h1>No Order Delivered</h1>
                                <%}%>
                        
                            </div>
                            <% if(order.checkout){ %>
                                <button type="button" class="btn btn-red" data-toggle="modal"
                                    data-target="#bill-<%= order.name %>">
                                    View Bill
                                </button>
                                <% var checkout = JSON.parse(order.checkout)%>
                                <!-- Modal -->
                                <div class="modal fade" id="bill-<%= order.name %>" tabindex="-1" role="dialog"
                                    aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <!-- <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5> -->
                                                <button type="button" class="close" data-dismiss="modal"
                                                    aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="divClass" id="page-wrap">

                                                    <div class="divClass" id="header">BILL</div>

                                                    <div class="divClass" id="identity">

                                                        <div class="divClass" id="address">Chris Coyier
                                                            123 Appleseed Street
                                                            Appleville, WI 53719
                                                            <br>
                                                            Phone: (555) 555-5555
                                                        </div>

                                                        <div class="divClass" id="logo">
                                                            <img id="image" src="images/logo.png" alt="logo" />
                                                        </div>

                                                    </div>

                                                    <div class="divClass" style="clear:both"></div>

                                                    <div class="divClass" id="customer">

                                                        <div class="divClass" id="customer-title">
                                                            <%= checkout.table %></div>

                                                        <table id="meta">
                                                            <tr>
                                                                <td class="meta-head">Bill #</td>
                                                                <td>
                                                                    <div class="divClass"><%= checkout.billno %>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>

                                                                <td class="meta-head">Date</td>
                                                                <td>
                                                                    <div class="divClass" id="date">
                                                                        <%= checkout.date %></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="meta-head">Amount Due</td>
                                                                <td>
                                                                    <div class="divClass" class="due">
                                                                        &#8377;<%= checkout.amount %></div>
                                                                </td>
                                                            </tr>

                                                        </table>

                                                    </div>

                                                    <table id="items">

                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Unit Cost</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                        </tr>
                                                        <% checkout.orders.forEach((dish) => { %>
                                                        <tr class="item-row">
                                                            <td class="item-name">
                                                                <div class="divClass" class="delete-wpr">
                                                                    <div class="divClass"><%= dish.dish.name%></div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="divClass" class="cost">
                                                                    &#8377;<%= dish.dish.price%></div>
                                                            </td>
                                                            <td>
                                                                <div class="divClass" class="qty">
                                                                    <%= dish.quantity%></div>
                                                            </td>
                                                            <td><span class="price">&#8377;<%= dish.price%></span>
                                                            </td>
                                                        </tr>
                                                        <%});%>
                                                        <tr>
                                                            <td colspan="1" class="blank"> </td>
                                                            <td colspan="2" class="total-line balance">Total</td>
                                                            <td class="total-value balance">
                                                                <div class="divClass" class="due">
                                                                    &#8377;<%= checkout.amount %>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    </table>

                                                    <div class="divClass" id="terms">
                                                        <div class="divClass">Thank You For Your Visit<br>Have a
                                                            Nice Day</div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                    data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-info" onClick="window.print()">Print</button>
                                                <a type="button" class="btn btn-red" href="/area/paid/<%= checkout.table %>">Paid</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <% } %>
                            </div>

                        </div>
                    </div>

                    <%});%>


                </div>
            </div>
        </div>`;
    var html = ejs.render(toRender, {
        orders
    });
    document.getElementById('output').innerHTML = html;
}
if(orders.length !== 0){
    innital();
}else{
    document.getElementById('output').innerHTML = "<h1>No Order Available</h1>";
}

socket.on("order", function (data) {
    var toRenderOrder = `<% for(dish in data.received){ %>
        <div class="card mb-2">
            <div class="card-body" style="padding: .5rem;">
                <div class="ordered-dish-card">
                    <div class="cart-dish-title"><%= data.received[dish].dish.name %> <span
                        class="badge badge-dark">x<%= data.received[dish].quantity %></span>
                </div>
                </div>
            </div>
        </div>
        <%}%>
        <div class="empty-card mb-2">
            <div class="card-body" style="padding: .5rem;">

            </div>
        </div>`;
    var renderedOrder = ejs.render(toRenderOrder, {
        data
    });
    document.getElementById(`received-${data.name}`).innerHTML = renderedOrder;
    if(!document.getElementById(`accept-btn-${data.name}`)){
        document.getElementById(`nav-received-${data.name}`).innerHTML += `<a type="button" id="accept-btn-${data.name}" href="/area/post-received/${data.name}" class="btn btn-red">Accept</a>`
    }
    if(!document.getElementById(`received-icon-${data.name}`)){
        if(!document.getElementById(`bill-icon-${data.name}`)){
            document.getElementById(`v-pills-${data.name}-tab`).innerHTML += `<i id="received-icon-${data.name}" class="fas fa-concierge-bell" aria-hidden="true" style="
            float: right;
            font-size: 1.5rem;
            margin-left: 10px;
        "></i>`
        }else{
            document.getElementById(`v-pills-${data.name}-tab`).innerHTML = `${data.name}<i id="received-icon-${data.name}" class="fas fa-concierge-bell" aria-hidden="true" style="
            float: right;
            font-size: 1.5rem;
            margin-left: 10px;
        "></i><i id="bill-icon-${data.name}" class="fas fa-file-invoice" aria-hidden="true" style="
        float: right;
        font-size: 1.5rem;
        margin-left: 10px;
    "></i>`
        }
    }
});

socket.on("newOrder", function (data) {
    if (!document.getElementById(`orderSection`)) {
        orders = [{name: data.name,received: JSON.stringify(data.received)}];
        innital();
    } else {
        var toRenderNewOrderTable = `<a class="nav-link" id="v-pills-<%= data.name %>-tab" data-toggle="pill" href="#v-pills-<%= data.name %>" role="tab"
    aria-controls="v-pills-<%= data.name %>" aria-selected="false"><%= data.name %><i id="received-icon-<%= data.name %>" class="fas fa-concierge-bell" aria-hidden="true" style="
    float: right;
    font-size: 1.5rem;
    margin-left: 10px;
"></i></a>`;
        var toRenderNewOrder = `<div class="tab-pane fade" id="v-pills-<%= data.name %>" role="tabpanel"
    aria-labelledby="v-pills-<%= data.name %>-tab">
    <nav>
        <div class="nav nav-tabs my-2" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-received-<%= data.name %>-tab" data-toggle="tab" href="#nav-received-<%= data.name %>"
                role="tab" aria-controls="nav-received-<%= data.name %>" aria-selected="true">Received</a>
            <a class="nav-item nav-link" id="nav-preparing-<%= data.name %>-tab" data-toggle="tab" href="#nav-preparing-<%= data.name %>"
                role="tab" aria-controls="nav-preparing-<%= data.name %>" aria-selected="false">Preparing</a>
            <a class="nav-item nav-link" id="nav-delivered-<%= data.name %>-tab" data-toggle="tab" href="#nav-delivered-<%= data.name %>"
                role="tab" aria-controls="nav-delivered-<%= data.name %>" aria-selected="false">Delivered</a>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-received-<%= data.name %>" role="tabpanel"
            aria-labelledby="nav-received-<%= data.name %>-tab">
            <div id="received-<%= data.name %>" class="d-flex flex-wrap justify-content-between">
                <% for(dish in data.received){ %>
                <div class="card mb-2">
                    <div class="card-body" style="padding: .5rem;">
                        <div class="ordered-dish-card">
                            <div class="cart-dish-title"><%= data.received[dish].dish.name %> <span
                                class="badge badge-dark">x<%= data.received[dish].quantity %></span>
                        </div>
                        </div>
                    </div>
                </div>
                <%}%>
                <div class="empty-card mb-2">
                    <div class="card-body" style="padding: .5rem;">

                    </div>
                </div>
            </div>
                <a type="button" id="accept-btn-<%= data.name %>" href="/area/post-received/<%= data.name %>" class="btn btn-red">Accept</a>
        </div>

        <div class="tab-pane fade" id="nav-preparing-<%= data.name %>" role="tabpanel"
            aria-labelledby="nav-preparing-<%= data.name %>-tab">
            <div class="d-flex flex-wrap justify-content-between">
                    <h1>No Order Preparing</h1>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-delivered-<%= data.name %>" role="tabpanel"
            aria-labelledby="nav-delivered-<%= data.name %>-tab">
            <div class="d-flex flex-wrap justify-content-between">

                    <h1>No Order Delivered</h1>
            </div>
        </div>

    </div>
</div>`;

        var renderedNewOrderTable = ejs.render(toRenderNewOrderTable, {
            data
        });
        document.getElementById(`tableSection`).innerHTML += renderedNewOrderTable;
        var renderedNewOrder = ejs.render(toRenderNewOrder, {
            data
        });
        document.getElementById(`orderSection`).innerHTML += renderedNewOrder;
    }
});
var toChangePointer = function(){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var accepted = url.searchParams.get("accepted");
    var delivered = url.searchParams.get("delivered");
    var table = url.searchParams.get("table");

    if(accepted){
        document.getElementById(`v-pills-${table}-tab`).click()
        document.getElementById(`nav-preparing-${table}-tab`).click()
    }
    if(delivered){
        document.getElementById(`v-pills-${table}-tab`).click()
        document.getElementById(`nav-delivered-${table}-tab`).click()
    }
}

socket.on("bill", function (data) {
    if(!document.getElementById(`bill-${data.table}`)){
    var toRenderBill = `<button type="button" class="btn btn-red" data-toggle="modal" data-target="#bill-<%= data.table %>">
    View Bill
</button>
<!-- Modal -->
<div class="modal fade" id="bill-<%= data.table %>" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <!-- <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5> -->
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="divClass" id="page-wrap">
                    <div class="divClass" id="header">BILL</div>
                    <div class="divClass" id="identity">
                        <div class="divClass" id="address">Chris Coyier
                            123 Appleseed Street
                            Appleville, WI 53719
                            <br>
                            Phone: (555) 555-5555
                        </div>
                        <div class="divClass" id="logo">
                            <img id="image" src="images/logo.png" alt="logo" />
                        </div>
                    </div>
                    <div class="divClass" style="clear:both"></div>
                    <div class="divClass" id="customer">
                        <div class="divClass" id="customer-title">
                            <%= data.table %></div>
                        <table id="meta">
                            <tr>
                                <td class="meta-head">Bill #</td>
                                <td>
                                    <div class="divClass"><%= data.billno %>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="meta-head">Date</td>
                                <td>
                                    <div class="divClass" id="date">
                                        <%= data.date %></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="meta-head">Amount Due</td>
                                <td>
                                    <div class="divClass" class="due">
                                        &#8377;<%= data.amount %></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <table id="items">
                        <tr>
                            <th>Item</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        <% data.orders.forEach((dish) => { %>
                        <tr class="item-row">
                            <td class="item-name">
                                <div class="divClass" class="delete-wpr">
                                    <div class="divClass"><%= dish.dish.name%></div>
                                </div>
                            </td>
                            <td>
                                <div class="divClass" class="cost">
                                    &#8377;<%= dish.dish.price%></div>
                            </td>
                            <td>
                                <div class="divClass" class="qty">
                                    <%= dish.quantity%></div>
                            </td>
                            <td><span class="price">&#8377;<%= dish.price%></span>
                            </td>
                        </tr>
                        <%});%>
                        <tr>
                            <td colspan="1" class="blank"> </td>
                            <td colspan="2" class="total-line balance">Total</td>
                            <td class="total-value balance">
                                <div class="divClass" class="due">
                                    &#8377;<%= data.amount %>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="divClass" id="terms">
                        <div class="divClass">Thank You For Your Visit<br>Have a
                            Nice Day</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-info" onClick="window.print()">Print</button>
                <a type="button" class="btn btn-red" href="/area/paid/<%= data.table %>">Paid</a>
            </div>
        </div>
    </div>
</div>`;
    var renderedBill = ejs.render(toRenderBill, {
        data
    });
    document.getElementById(`nav-delivered-${data.table}`).innerHTML += renderedBill;
    if(!document.getElementById(`received-icon-${data.table}`)){
        document.getElementById(`v-pills-${data.table}-tab`).innerHTML += `<i id="bill-icon-${data.table}" class="fas fa-file-invoice" aria-hidden="true" style="
        float: right;
        font-size: 1.5rem;
        margin-left: 10px;
        "></i>`
    }else{
        document.getElementById(`v-pills-${data.table}-tab`).innerHTML = `${data.table}<i id="received-icon-${data.table}" class="fas fa-concierge-bell" aria-hidden="true" style="
        float: right;
        font-size: 1.5rem;
        margin-left: 10px;
    "></i><i id="bill-icon-${data.table}" class="fas fa-file-invoice" aria-hidden="true" style="
    float: right;
    font-size: 1.5rem;
    margin-left: 10px;
    "></i>`
    }
}
});