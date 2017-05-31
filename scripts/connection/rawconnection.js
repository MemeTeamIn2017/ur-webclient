FUNCS.onMessage = function (rawMsg) {
    console.log("[DEBUG] MSG :");
    var e = JSON.parse(rawMsg.data);
    console.log(e);

    switch (e.id) {
        case "AUTH_STATUS":
            PROTOCOL.IN.onAuthStatus(e.name, e.reason, e.locale);
            break;
        case "LOBBY_LIST":
            if (e.hasOwnProperty("players") && typeof e.players === typeof Array.prototype)
                PROTOCOL.IN.onLobbyListReceived(e.players);
            else
                PROTOCOL.IN.onLobbyListReceived([]);
            break;
        case "PLAYER_JOINED_LOBBY":
            PROTOCOL.IN.onPlayerJoinedLobby(e.player);
            break;
        case "PLAYER_LEFT_LOBBY":
            PROTOCOL.IN.onPlayerLeftLobby(e.name);
            break;
    }

};

FUNCS.onClose = function (e) {
    console.log("CLOSE:");
    console.log(e);
    PROTOCOL.IN.onSocketClose(e)
    // Enums.Socket.Status.set(Enums.Socket.Status.Disconnected);
};

FUNCS.onError = function (e) {
    console.log("ERR :");
    console.log(e);
    PROTOCOL.IN.onSocketError(e);
};

FUNCS.onConnect = function () {
    // Enums.Socket.Status.set(Enums.Socket.Status.Connected);
    PROTOCOL.IN.onSocketOpen()
};

FUNCS.send = function (object) {
    var sentData = JSON.stringify(object);
    console.log(sentData);

    CONNECTION.send(sentData);
};


