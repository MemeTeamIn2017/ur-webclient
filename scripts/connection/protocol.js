/**
 * You are allowed to override any of the PROTOCOL.IN functions, but don't modify the PROTOCOL.OUT ones
 * without a good reason.
 *
 * - Braynstorm.
 */

/**
 * Opens the socket and tries to connect to the server,
 * if something happens, one of {@link PROTOCOL.IN.onSocket****} functions will be called.
 */
PROTOCOL.OUT.connect = function () {
    CONNECTION = new WebSocket("ws://82.103.92.123:4269/");
    CONNECTION.onmessage = FUNCS.onMessage;
    CONNECTION.onopen = FUNCS.onConnect;
    CONNECTION.onclose = FUNCS.onClose;
    CONNECTION.onerror = FUNCS.onError;
};

/**
 * Closes the socket connection to the server.
 */
PROTOCOL.OUT.disconnect = function () {
    CONNECTION.close()
};

/**
 * Sends a AUTH packet to the server, attempting to authenticate and log in.
 * @param name: String - the name of the player.
 * @see PROTOCOL.onAuthStatus
 */
PROTOCOL.OUT.tryAuthenticate = function (name) {
    var packet = {
        id: "AUTH",
        name: name
    };

    dbg("Sending AUTH packet: " + packet);

    FUNCS.send(packet);
};

/**
 * Gets called when the socket gets open and connected.
 * @return void
 */
PROTOCOL.IN.onSocketOpen = function () {
};

/**
 * Gets called when the socket closes.
 * @param event - the event data
 * @return void
 */
PROTOCOL.IN.onSocketClose = function (event) {
};

/**
 * Gets called when the socket receives an error.
 * @param event - the event data
 * @return void
 */
PROTOCOL.IN.onSocketError = function (event) {
};

/**
 * This method will be called when the server returns a response
 * from {@link PROTOCOL.tryAuthenticate(string)}.
 *
 * @param status - Boolean - True means the authentication was successful. If it wasn't - false
 * @param reason - String - The reason for the auth-fail.
 * @param countryCode - String - If the auth was successful, this will countain
 *      a two-letter name of the country this client's IP is pointing to.
 * @return void
 */
PROTOCOL.IN.onAuthStatus = function (status, reason, countryCode) {
};

/**
 * This function will be called when the server informs the client about
 * and incoming challenge from another player.
 * @param challenger - String - the player that challenged this player.
 * @param gameMode - Number - the gamemode they wish to play. (placeholder)
 * @return void
 */
PROTOCOL.IN.onChallengeReceived = function (challenger, gameMode) {
};

/**
 * This function will be called when the client receives the list of players currently in the lobby - all of them.
 * A player is defined as an object with a set of fields, mainly: name and locale.
 * player.name is a unique identifier for every single player currently in the lobby.
 * player.locale is a two-character country code.
 *
 * This packet will be received right after an logging in.
 * @param list - Player[] - a list of all the players in the lobby.
 * @return void
 */
PROTOCOL.IN.onLobbyListReceived = function (list) {
};

/**
 * This function will be called when a player joins the lobby.
 * @param player - Player - the player that joined
 * @return void
 */
PROTOCOL.IN.onPlayerJoinedLobby = function (player) {
};

/**
 * This function will be called when a player leaves the lobby.
 * @param name - String - the name of the player that left
 * @return void
 */
PROTOCOL.IN.onPlayerJoinedLobby = function (name) {
};

