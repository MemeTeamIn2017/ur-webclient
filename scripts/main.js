/**
 * Designer space :D
 * You can use this as your main JS file.
 * Everything here can be removed, its only visual leftover parts that DO NOT WORK (currently).
 */
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

function addPlayerToLobby(name, locale, ingame) {
    var playerRow = "<tr class='lobby-player-row'>" +
        "<td><img src='./image/flags_iso/32/" + locale.toLowerCase() + ".png' alt='" + locale + "'/>" + name + "</td>" +
        (ingame ? "ingame" : "Free" ) +
        "</td>" +
        "</tr>";


    View.playerTable.append(playerRow)
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


