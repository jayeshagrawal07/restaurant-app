var innital = function(){   var toRender = `<div class="row">
        <div class="col-3 pt-2">
            <div id="tableSection" class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <%orders.forEach((order,i) => {%>
                        <%var activTableTab = i===0? "active":""; %>
                        <a class="nav-link <%= activTableTab %>" id="v-pills-<%= order.name %>-tab" data-toggle="pill" href="#v-pills-<%= order.name %>" role="tab"
                    aria-controls="v-pills-<%= order.name %>" aria-selected="false"><%= order.name %></a>
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
                            <a class="nav-item nav-link active" id="nav-received-<%= order.name %>-tab" data-toggle="tab" href="#nav-received-<%= order.name %>"
                                role="tab" aria-controls="nav-received-<%= order.name %>" aria-selected="true">Received</a>
                            <a class="nav-item nav-link" id="nav-preparing-<%= order.name %>-tab" data-toggle="tab" href="#nav-preparing-<%= order.name %>"
                                role="tab" aria-controls="nav-preparing-<%= order.name %>" aria-selected="false">Preparing</a>
                            <a class="nav-item nav-link" id="nav-delivered-<%= order.name %>-tab" data-toggle="tab" href="#nav-delivered-<%= order.name %>"
                                role="tab" aria-controls="nav-delivered-<%= order.name %>" aria-selected="false">Delivered</a>
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
                                                class="ordered-qty">x<%= received[dish].quantity %></span>
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
                                <a type="button" id="accept-btn-<%= order.name %>" href="/area/post-received/<%= order.name %>" class="btn btn-red">Accept</a>
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
                                                class="ordered-qty">x<%= preparing[dish].quantity %></span>
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
                                <a type="button" id="delivered-btn-<%= order.name %>" href="/area/post-delivered/<%= order.name %>" class="btn btn-red">Deliver</a>
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
                                                class="ordered-qty">x<%= delivered[dish].quantity %></span>
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
                        class="ordered-qty">x<%= data.received[dish].quantity %></span>
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
});

socket.on("newOrder", function (data) {
    if (!document.getElementById(`orderSection`)) {
        orders = [{name: data.name,received: JSON.stringify(data.received)}];
        innital();
    } else {
        var toRenderNewOrderTable = `<a class="nav-link" id="v-pills-<%= data.name %>-tab" data-toggle="pill" href="#v-pills-<%= data.name %>" role="tab"
    aria-controls="v-pills-<%= data.name %>" aria-selected="false"><%= data.name %></a>`;
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
                                class="ordered-qty">x<%= data.received[dish].quantity %></span>
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