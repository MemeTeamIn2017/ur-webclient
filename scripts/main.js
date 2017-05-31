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
                View.fieldCountryCode.prop("disabled", !shouldDisable);
                View.fieldCountryCode.val("REAL_CC");
                View.fieldCountryCodeAuto.prop("disabled", shouldDisable);
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

var Lobby = {};


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
                if (e.hasOwnProperty("locale")) {
                    View.fieldCountryCode.val(e.locale);
                    console.log(e.locale)
                }
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
        case "LOBBY_LIST":
            if (e.hasOwnProperty("players")) {
                var player;
                if (typeof e.players === typeof Array.prototype)
                    for (var i in e.players) {
                        player = e.players[i];

                        addPlayerToLobby(player.name, player.locale, player.ingame);
                    }
            }
            break;
        case "PLAYER_JOINED_LOBBY":
            var player = e.player;
            addPlayerToLobby(player.name, player.locale, player.ingame);
            break;
    }

};

function addPlayerToLobby(name, locale, ingame) {
    var playerRow = "<tr class='lobby-player-row'>" +
        "<td><img src='./image/flags_iso/32/" + locale.toLowerCase() + ".png' alt='" + locale + "'/>" + name + "</td>" +
        (ingame ? "ingame" : "Free" ) +
        "</td>" +
        "</tr>";


    View.playerTable.append(playerRow)
}

FUNCS.onClose = function (e) {
    console.log("CLOSE:");
    console.log(e);
    Enums.Socket.Status.set(Enums.Socket.Status.Disconnected);
};

FUNCS.onError = function (e) {
    console.log("ERR :");
    console.log(e);
};

function send(object) {
    var sentData = JSON.stringify(object);
    console.log(sentData);

    CONNECTION.send(sentData);
}

function authenticate() {
    var name = View.fieldName.val();

    var locale = View.fieldCountryCode.val();

    if (View.fieldCountryCodeAuto.prop("checked")) {
        locale = "";
    }

    send({
        id: "AUTH",
        name: name,
        locale: locale
    });
}


function connect() {
    CONNECTION = new WebSocket("ws://82.103.92.123:4269/");
    CONNECTION.onmessage = FUNCS.onMessage;
    CONNECTION.onopen = FUNCS.onConnect;
    CONNECTION.onclose = FUNCS.onClose;
    CONNECTION.onerror = FUNCS.onError;
}

function disconnect() {
    CONNECTION.close()
}

function updateCountryCodeLock() {
    View.fieldCountryCode.prop("disabled", View.fieldCountryCodeAuto.prop("checked"));
    console.log("change");
}


function initialize() {
    View.connectionStatus = $("#connection-status");
    View.authenticationStatus = $("#authentication-status");
    View.fieldName = $("#fields-name");
    View.buttonWsConnect = $("#buttons-ws-connect");
    View.buttonSubmitName = $("#buttons-name-submit");

    View.fieldCountryCode = $("#fields-countrycode");
    View.fieldCountryCodeAuto = $("#fields-countrycode-auto");


    View.playerTable = $("#game-lobby-playertable");

    Enums.Socket.Status.set(Enums.Socket.Status.Disconnected);
}


