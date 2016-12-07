var carts = [];
var walls = [];
//Spere Params: name, subdivs, size, scene
//Cylindar Params: name, height, diamTop, diamBottom, tessellation, [height subdivs], scene, updatable

var createMesh = {
    bullet: function(diameter, speed, shotFrom, damage, direction, Scene) {
        var bullet;
        var bulletPerams = {
            name: "bullet" + numberOfCreated.bullets,
            height: 5 * diameter,
            diameter: diameter,
            tessellation: 6,
            subdivs: 1,
            updatable: true
        };
        if (Scene != undefined) {
            bullet = b.Mesh.CreateCylinder(bulletPerams.name, bulletPerams.height, bulletPerams.diameter, bulletPerams.diameter,
                bulletPerams.tessellation, bulletPerams.subdivs, Scene, bulletPerams.updatable);
        } else {
            bullet = b.Mesh.CreateCylinder(bulletPerams.name, bulletPerams.height, bulletPerams.diameter, bulletPerams.diameter,
                bulletPerams.tessellation, bulletPerams.subdivs, scene, bulletPerams.updatable);
        }
        numberOfCreated.bullets++;
        bullet.rotation = new b.Vector3(direction.x, direction.y, 0);
        bullet.rotation.x += degreesToRadians(90);
        bullet.parent = shotFrom.body;
        bullet.position.y -= 2;
        bullet.damage = damage;
        bullet.shotFrom = shotFrom.id;
        bullet.moveForward = function() {
            bullet.locallyTranslate(new b.Vector3(0, speed, 0));
        }
        bullet.remove = setWaitFrames(250, function() {
            bullet.dispose();
        }, bullet);
    },
    cart: function(x, z, health, shield, speed, lives, team, Scene) {
        if (Scene != undefined) {
            scene = Scene;
        }

        var cart = {
            moveForward: function() {
                var isColliding = false;
                walls.forEach(function(wall) {
                    if (cart.frontImpostor.intersectsMesh(wall, false)) {
                        isColliding = true;
                    }
                });
                if (!isColliding) {
                    cart.body.locallyTranslate(new b.Vector3(cart.speed, 0, 0));
                    socket.emit('movement', {
                        position: cart.body.position,
                        id: socket.id,
                        cartId: cart.id
                    });
                    return true;
                } else {
                    return false;
                }
            },
            moveBack: function() {
                var isColliding = false;
                walls.forEach(function(wall) {
                    if (cart.backImpostor.intersectsMesh(wall, false)) {
                        isColliding = true;
                    }
                });
                if (!isColliding) {
                    cart.body.locallyTranslate(new b.Vector3(-cart.speed, 0, 0));
                    socket.emit('movement', {
                        position: cart.body.position,
                        id: socket.id,
                        cartId: cart.id
                    });
                    return true;
                } else {
                    return false;
                }
            },
            rotate: function(vector) {
                var isColliding = false;
                walls.forEach(function(wall) {
                    if (cart.leftImpostor.intersectsMesh(wall, false)) {
                        isColliding = true;
                    }
                    if (cart.rightImpostor.intersectsMesh(wall, false)) {
                        isColliding = true;
                    }
                });
                if (!isColliding) {
                    cart.body.rotation.x += vector.x;
                    cart.body.rotation.y += vector.y;
                    cart.body.rotation.z += vector.z;
                    socket.emit('rotation', {
                        rotation: cart.body.rotation,
                        id: socket.id,
                        cartId: cart.id
                    });
                    return true;
                } else {
                    return false;
                }
            },
            die: function() {
                if (!cart.isDead) {
                    if (cart.lives == 0) {
                        console.log('a cart died');
                        cart.body.dispose();
                        cart.wheelA.dispose();
                        cart.wheelB.dispose();
                        cart.cannon.dispose();
                        cart.isDead = true;
                        if (cart.id == 0) {
                            $('#gameOver').css('z-index', '3');
                        }
                    } else {
                        cart.body.position = cart.pos;
                        //cart.body.position.y += 1.2;
                        cart.lives -= 1;
                        cart.health = cart.maxHealth;
                    }
                }
            },
            damage: function(damage) {
                if (cart.sheild > 0) {
                    cart.health -= damage / 2;
                    cart.sheild -= damage;
                } else {
                    cart.health -= damage;
                }
                if (cart.health < 0) {
                    cart.die();
                }
            },
            isDead: false,
            pos: new b.Vector3(x, 2.2, z),
            body: createMesh.rect(6, 3.9, 4, false, scene),
            //Parameters are: name, height, diamTop, diamBottom, tessellation, [height subdivs], scene, updatable
            wheelA: b.Mesh.CreateCylinder("wheelA" + numberOfCreated.carts, 2, 3, 3, 6, 1, scene, true),
            wheelB: b.Mesh.CreateCylinder("wheelB" + numberOfCreated.carts, 2, 3, 3, 6, 1, scene, true),
            cannon: b.Mesh.CreateCylinder("$cannon" + numberOfCreated.carts, 5, 0.5, 0.5, 16, 1, scene, true),
            moveSphere: createMesh.moveSphere(scene),
            health: health,
            maxHealth: health,
            speed: speed,
            sheild: shield,
            maxSheild: shield,
            lives: lives,
            team: team
        }
        cart.frontImpostor = createMesh.rect(cart.speed, 0.1, 8, false, scene);
        cart.backImpostor = createMesh.rect(cart.speed, 0.1, 8, false, scene);
        cart.leftImpostor = createMesh.rect(20, 0.1, cart.speed, false, scene);
        cart.rightImpostor = createMesh.rect(20, 0.1, cart.speed, false, scene);

        cart.frontImpostor.material = new b.StandardMaterial("texture1", scene);
        cart.backImpostor.material = new b.StandardMaterial("texture1", scene);
        cart.leftImpostor.material = new b.StandardMaterial("texture1", scene);
        cart.rightImpostor.material = new b.StandardMaterial("texture1", scene);

        cart.frontImpostor.material.alpha = 0;
        cart.backImpostor.material.alpha = 0;
        cart.leftImpostor.material.alpha = 0;
        cart.rightImpostor.material.alpha = 0;

        cart.wheelA.scaling.x = 4;
        cart.wheelB.scaling.x = 4;

        cart.wheelA.rotation = new b.Vector3(Math.PI / 2, 0, 0);
        cart.wheelB.rotation = new b.Vector3(Math.PI / 2, 0, 0);
        cart.cannon.rotation = new b.Vector3(0, 0, Math.PI / 2);

        cart.body.position = new b.Vector3(cart.pos.x, cart.pos.y, cart.pos.z);
        cart.cannon.position = new b.Vector3(4, 1.3, 0);
        cart.wheelA.position = new b.Vector3(0, -1.2, 2.5);
        cart.wheelB.position = new b.Vector3(0, -1.2, -2.5);
        cart.frontImpostor.position = new b.Vector3(10, 0, 0);
        cart.backImpostor.position = new b.Vector3(-10, 0, 0);
        cart.moveSphere.position = cart.pos;

        cart.wheelA.parent = cart.body;
        cart.wheelB.parent = cart.body;
        cart.cannon.parent = cart.body;
        cart.backImpostor.parent = cart.body;
        cart.frontImpostor.parent = cart.body;
        cart.leftImpostor.parent = cart.body;
        cart.rightImpostor.parent = cart.body;

        cart.id = carts.length;
        carts[cart.id] = cart;

        numberOfCreated.carts += 1;
        return cart;
    },
    rect: function(width, height, depth, isWall, Scene) {
        var box;
        if (Scene != undefined) {
            box = b.Mesh.CreateBox("rectangularPrism" + numberOfCreated.rects, height, Scene);
        } else {
            box = b.Mesh.CreateBox("rectangularPrism" + numberOfCreated.rects, height, Scene);
        }
        if (isWall) {
            walls[walls.length] = box;
        }
        numberOfCreated.rects += 1;
        box.scaling.x = width / height;
        box.scaling.z = depth / height;
        return box;
    },
    moveSphere: function(Scene) {
        var moveSphere;
        if (Scene != undefined) {
            moveSphere = b.Mesh.CreateSphere("moveSphere" + numberOfCreated.moveSpheres, 16, 2, Scene);
        } else {
            moveSphere = b.Mesh.CreateSphere("moveSphere" + numberOfCreated.moveSpheres, 16, 2, Scene);
        }
        return moveSphere;
    }

}
var numberOfCreated = {
    bullets: 0,
    carts: 0,
    rects: 0,
    moveSpheres: 0
};
/*function getDistance(vector1, vector2) {
    return new b.Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
}*/

//function makeRelative(vector1, vector2) {
//    return new b.Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
//}

/*function getReverseVector(vector) {
    return new b.Vector3(-vector.x, -vector.y, -vector.z);
}*/