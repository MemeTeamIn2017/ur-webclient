var CONNECTION;
var FUNCS = {};

/**
 * Thus object contains two fields, OUT and IN
 /////* @type {{OUT: {}, IN: {}}}
 * They are used for storing the various protocol functions in 2 categories as the client sees them.
 * OUT contains functions that will send something to the server.
 * IN contains event-handlers that will be called when the server sends response.
 */
var PROTOCOL = {
    OUT: {},
    IN: {}
};

/**
 * ezpzlemonsqueezy log.
 */
var dbg = console.log;

