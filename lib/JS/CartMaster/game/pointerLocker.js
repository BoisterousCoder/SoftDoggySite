/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var isCursorLocked = false;
var canvas = document.getElementById("renderCanvas");
var mouse = {
    isDown: false,
    x: 0,
    y: 0
}

var tildaKey = KeyListener(192, function() {
    if (tildaKey.isKeyPressed) {
        if (!isCursorLocked) {
            //lock
            canvas.requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        } else {
            //unlock
            document.exitPointerLock = document.exitPointerLock ||
                document.mozExitPointerLock ||
                document.webkitExitPointerLock;
            document.exitPointerLock();
        }
    }
    // pointer lock event listener

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
});

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas ||
        document.webkitPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", canvasLoop, false);
        isCursorLocked = true;
    } else {
        console.log('The pointer lock status is now unlocked');
        document.removeEventListener("mousemove", canvasLoop, false);
        isCursorLocked = false;
    }
}

function canvasLoop(e) {
    var movementX = e.movementX ||
        e.mozMovementX ||
        e.webkitMovementX ||
        0;

    var movementY = e.movementY ||
        e.mozMovementY ||
        e.webkitMovementY ||
        0;
    scene.cameras[0].cameraRotation.y += movementX / 1600;
    scene.cameras[0].cameraRotation.x += movementY / 2000;
}
canvas.onmousedown = function() {
    mouse.isDown = true;
}
canvas.onmouseup = function() {
    mouse.isDown = false;
}