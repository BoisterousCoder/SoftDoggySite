// Get the canvas element from our HTML above
var keysAssined = [];
var html = document.getElementById('html');

var KeyListener = function(key, callback) {
    var handler = {};
    handler.key = key;
    handler.isKeyPressed = false;
    if (callback) {
        handler.callback = callback;
    } else {
        handler.callback = function() {};
    }
    handler.pressKey = function() {
        handler.isKeyPressed = true;
        handler.callback(true);
    };
    handler.releaseKey = function() {
        handler.isKeyPressed = false;
        handler.callback(false);
    };
    keysAssined[keysAssined.length] = {
        key: key,
        handler: handler
    };
    return handler;
}

html.onkeydown = function(event) {
    keysAssined.forEach(function(obj) {
        if (obj.key == event.keyCode) {
            obj.handler.pressKey();
        }
    });
};
html.onkeyup = function(event) {
    keysAssined.forEach(function(obj) {
        if (obj.key == event.keyCode) {
            obj.handler.releaseKey();
        }
    });
};