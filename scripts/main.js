var CONNECTION;
var FUNCS = {};
var View = {};
var SESSION = {};

var Enums = {
    Socket: {
        Status: {
            VALUE: undefined,

            Connected: "ws.ok",
            Disconnected: "ws.fail",

            set: function (status) {
                Enums.Socket.Status.VALUE = status;

                View.connectionStatus.html(View.strings[status].txt);
                View.connectionStatus.css("color", View.strings[status].color);

                if (status === Enums.Socket.Status.Connected) {
                    View.buttonWsConnect.prop("disabled", true);
                    Enums.Auth.Status.set(Enums.Auth.Status.VALUE)
                } else {
                    View.buttonWsConnect.prop("disabled", false);
                    Enums.Auth.Status.set(Enums.Auth.Status.NotAuthenticated)
                }
            }
        }
    },

    Auth: {
        Status: {
            VALUE: undefined,

            Authenticated: "auth.ok",
            NotAuthenticated: "auth.fail",
            NameTaken: "auth.name_taken",

            set: function (status) {
                Enums.Auth.Status.VALUE = status;

                View.authenticationStatus.html(View.strings[status].txt);
                View.authenticationStatus.css("color", View.strings[status].color);

                var shouldDisable = status === Enums.Auth.Status.Authenticated || Enums.Socket.Status.VALUE !== Enums.Socket.Status.Connected;
                View.fieldName.prop("disabled", shouldDisable);
                View.buttonSubmitName.prop("disabled", shouldDisable);
            }
        }
    }

};


View.strings = {
    "ws.ok": {txt: "Connected", color: "green"},
    "ws.fail": {txt: "Disconnected", color: "red"},
    "auth.ok": {txt: "Authenticated", color: "green"},
    "auth.name_taken": {txt: "Name is taken", color: "magenta"},
    "auth.fail": {txt: "Not Authenticated", color: "red"}
};


FUNCS.onConnect = function () {
    Enums.Socket.Status.set(Enums.Socket.Status.Connected);
};

FUNCS.onMessage = function (rawMsg) {
    console.log("MSG :");
    var e = JSON.parse(rawMsg.data);
    console.log(e);

    switch (e.id) {
        case "AUTH_STATUS":
            if (e.status) {
                // ok
                Enums.Auth.Status.set(Enums.Auth.Status.Authenticated);
            }
            else {
                // fail
                if (e.hasOwnProperty("reason")) {
                    if (e.reason === "TAKEN") {
                        Enums.Auth.Status.set(Enums.Auth.Status.NameTaken);
                    } else {
                        Enums.Auth.Status.set({txt: e.reason, color: "blue"});
                    }
                } else {
                    Enums.Auth.Status.set(Enums.Auth.Status.NotAuthenticated);
                }
            }
            break;
        case "PLAYER_LIST":
            break;
    }

};

FUNCS.onClose = function (e) {
    console.log("CLOSE:");
    console.log(e);
    Enums.Auth.Status.set(Enums.Auth.Status.NotAuthenticated);
    Enums.Socket.Status.set(Enums.Socket.Status.Disconnected);
};

FUNCS.onError = function (e) {
    console.log("ERR :");
    console.log(e);
};

function send(object) {
    CONNECTION.send(JSON.stringify(object));
}

function authenticate() {
    var name = View.fieldName.val();

    send({
        id: "AUTH",
        name: name
    });
}


function connect() {
    CONNECTION = new WebSocket("ws://localhost:4269/");
    CONNECTION.onmessage = FUNCS.onMessage;
    CONNECTION.onopen = FUNCS.onConnect;
    CONNECTION.onclose = FUNCS.onClose;
    CONNECTION.onerror = FUNCS.onError;
}

function disconnect() {
    CONNECTION.close()
}


function initialize() {
    View.connectionStatus = $("#connection-status");
    View.authenticationStatus = $("#authentication-status");
    View.fieldName = $("#fields-name");
    View.buttonWsConnect = $("#buttons-ws-connect");
    View.buttonSubmitName = $("#buttons-name-submit");

    Enums.Socket.Status.set(Enums.Socket.Status.Disconnected);
}


