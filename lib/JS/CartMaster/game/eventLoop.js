/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
function startLoop() {
    engine.runRenderLoop(function() {
        if (mouse.isDown && playerEnergy >= 5) {
            playerEnergy -= 5;
            var bullet = {
                id: socket.id,
                cartId: playerCart.id,
                size: 0.125,
                speed: 10,
                attack: 8,
                direction: camera.rotation
            }
            socket.emit('bullet', bullet);
            bullet.body = playerCart;
            createMesh.bullet(bullet.size, bullet.speed, bullet.body, bullet.attack, bullet.direction);
            if (!shootSound.ended) {
                shootSound.pause();
                shootSound.currentTime = 0;
                shootSound.play();
            } else {
                shootSound.play();
            }
        } else if (spaceKey.isKeyPressed && playerEnergy >= 100) {
            playerEnergy -= 100;
            var bullet = {
                id: socket.id,
                cartId: playerCart.id,
                size: 0.25,
                speed: 10,
                attack: 200.2,
                direction: camera.rotation
            }
            socket.emit('bullet', bullet);
            bullet.body = playerCart;
            createMesh.bullet(bullet.size, bullet.speed, bullet.body, bullet.attack, bullet.direction);
            if (!shootSound.ended) {
                shootSound.pause();
                shootSound.currentTime = 0;
                shootSound.play();
            } else {
                shootSound.play();
            }
        }
        if (playerEnergy < 100) {
            playerEnergy += 0.5;
        }
        if (playerCart.sheild < playerCart.maxSheild) {
            playerCart.sheild += 0.1;
        }
        switch (true) {
            case (wKey.isKeyPressed):
                playerCart.moveForward();
                break;
            case (sKey.isKeyPressed):
                playerCart.moveBack();
                break;
            case (aKey.isKeyPressed):
                playerCart.rotate(new b.Vector3(0, degreesToRadians(-1), 0));
                break;
            case (dKey.isKeyPressed):
                playerCart.rotate(new b.Vector3(0, degreesToRadians(1), 0));
                break;
        }
        //handle waiting objects
        waitingOBJS.forEach(function(obj, i) {
            if (obj.waitLimit <= obj.framesWaited) {
                obj.callback();
                waitingOBJS.splice(i, 1);
            } else {
                obj.framesWaited++;
            }
            if (obj.bullet !== undefined) {
                obj.bullet.moveForward();
                carts.forEach(function(cart) {
                    if (obj.bullet.intersectsMesh(cart.body, false) ||
                        obj.bullet.intersectsMesh(cart.cannon, false) ||
                        obj.bullet.intersectsMesh(cart.wheelA, false) ||
                        obj.bullet.intersectsMesh(cart.wheelB, false)) {
                        if (obj.bullet.shotFrom !== cart.id && !cart.isDead) {
                            obj.callback();
                            waitingOBJS.splice(i, 1);
                            console.log('hit');
                            cart.damage(obj.bullet.damage);
                            if (!hitSound.ended) {
                                hitSound.pause();
                                hitSound.currentTime = 0;
                                hitSound.play();
                            } else {
                                hitSound.play();
                            }
                        }
                    }
                });
            }
        });
        carts.forEach(function(cart) {
            if (cart.AI) {
                cart.AI.refresh();
            }
        });
        if (view == 'firstPerson') {
            camera.position.x = 3.5;
            camera.position.y = 1.3;
            if (scene.cameras[0].rotation.y > Math.PI) {
                scene.cameras[0].rotation.y = Math.PI;
            }
            if (scene.cameras[0].rotation.y < 0) {
                scene.cameras[0].rotation.y = 0;
            }
            if (scene.cameras[0].rotation.x > Math.PI / 8) {
                scene.cameras[0].rotation.x = Math.PI / 8;
            }
            if (scene.cameras[0].rotation.x < -Math.PI / 8) {
                scene.cameras[0].rotation.x = -Math.PI / 8;
            }
        } else {
            camera.position.x = -4;
            camera.position.y = 5.7;
        }

        AIs.all.forEach(function(AI) {
            AI.refresh();
        });
		
        if (isWindowLoaded) {
            updateUI();
        }
        scene.render();
    });
}