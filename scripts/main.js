var CONNECTION;
var FUNCS = {};
var View = {};
var SESSION = {};

View.strings = {
    "connections.socket.status.true": "Connected",
    "connections.socket.status.false": "Disconnected",
    "connections.auth.status.true": "Authenticated",
    "connections.auth.status.false": "Not Authenticated"

    // TODO find a good way to make these status things work as "functions"... kinda.
};


FUNCS.onConnect = function () {
    View.connectionStatus.html("OK");
    View.connectionStatus.css("color", "green");
};

FUNCS.onMessage = function (e) {
    console.log("MSG :");
    console.log(e);

    var json = 0;

};

FUNCS.onClose = function (e) {
    console.log("CLOSE :");
    console.log(e);
    View.connectionStatus.html("Not Connected");
    View.connectionStatus.css("color", "red");
};

FUNCS.onError = function (e) {
    console.log("ERR :");
    console.log(e);
};

function send(object) {
    CONNECTION.send(JSON.stringify(object));
}


function connect() {
    CONNECTION = new WebSocket("ws://localhost:4269/");
    CONNECTION.onopen = FUNCS.onConnect;
    CONNECTION.onmessage = FUNCS.onMessage;
    CONNECTION.onclose = FUNCS.onClose;
    CONNECTION.onerror = FUNCS.onError;
}


function initialize() {
    View.connectionStatus = $("#connection-status");

    connect();
}


