/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var waitingOBJS = [];
var shootSound = new Audio('sounds/Cannon-SoundBible.com-1661203605.ogg');
var hitSound = new Audio('sounds/Swords_Collide-Sound_Explorer-2015600826.ogg');
var b = BABYLON;
var engine = new b.Engine(canvas, true);
var view = 'firstPerson';
var wKey = KeyListener(87);
var aKey = KeyListener(65);
var sKey = KeyListener(83);
var dKey = KeyListener(68);
var playerCart;
var playerEnergy = 100;
var isWindowLoaded = false;
var playerTeam;
var map;
var scene;

var oneKey = KeyListener(49, function() {
    view = 'firstPerson';
});
var threeKey = KeyListener(51, function() {
    view = 'thirdPerson';
});
var spaceKey = KeyListener(32);

function startGame() {
    createSceneWorld(function() {
        startGameUI();
        startLoop();
    });
}

function createSceneWorld(callback) {
    startSocketListeners();
    if (isHost) {
        playerTeam = 1;
    } else {
        playerTeam = 0;
    }
    shootSound.preload = "auto";

    // This creates a basic Babylon Scene object (non-mesh)
    scene = new b.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    camera = new b.FreeCamera("camera1", new b.Vector3(0, 4, -10), scene);

    
    loadJSON(mapIndex.src, function(map) {
        //Params: name, width, depth, subdivs, scene
        ground = b.Mesh.CreateGround("theGround", map.size.x, map.size.y, 2, scene);
        ground.setPhysicsState({
            impostor: b.PhysicsEngine.BoxImpostor,
            mass: 0,
            friction: 1,
            restitution: 0.7
        });
        ground.material = new b.StandardMaterial("texture1", scene);
        ground.material.diffuseColor = new b.Color3(map.floorColor.r / 127, map.floorColor.g / 127, map.floorColor.b / 127);

        map.lights.forEach(function(light, i) {
            babylonlight = new b.PointLight("light" + i, new b.Vector3(0, 0, 0), scene);
            // Default intensity is 1.
            babylonlight.intensity = light.light;
            babylonlight.position = new b.Vector3(light.x, light.y, light.z);
        });

        map.walls.forEach(function(wall, i) {
            rect = createMesh.rect(wall.size.x, wall.size.y, wall.size.z, true, scene);
            rect.position.x = wall.pos.x;
            rect.position.y = wall.size.y / 2;
            rect.position.z = wall.pos.z;
            rect.setPhysicsState({
                impostor: b.PhysicsEngine.BoxImpostor,
                mass: 0,
                friction: 10,
                restitution: 0
            });
            rect.material = new b.StandardMaterial("texture1", scene);
            rect.material.diffuseColor = new b.Color3(wall.color.r / 127, wall.color.g / 127, wall.color.b / 127);
        });

        map.teams.forEach(function(team, teamNum) {
            teamColor = new b.StandardMaterial("texture1", scene);
            teamColor.diffuseColor = new b.Color3(team.color.r / 127, team.color.g / 127, team.color.b / 127);
            team.carts.forEach(function(cart, cartNum) {
                babylonCart = createMesh.cart(team.spawn.x, cartNum * 10 + team.spawn.z, cart.health, cart.shield, cart.speed, cart.lives, teamNum, scene);
                babylonCart.body.material = teamColor;
                babylonCart.wheelA.material = teamColor;
                babylonCart.wheelB.material = teamColor;
                babylonCart.cannon.material = teamColor;
                if (teamNum == playerTeam && cartNum != 0) {
                    selectableCarts['platoon' + cart.platoon]['squad' + cart.squad]['cart' + cart.cartNum][0] = babylonCart;
                    squad = selectableCarts['platoon' + cart.platoon]['squad' + cart.squad];
                    squad.all[squad.all.length] = babylonCart;
                    platoon = selectableCarts['platoon' + cart.platoon];
                    platoon.all[platoon.all.length] = babylonCart;
                    selectableCarts.all[selectableCarts.all.length] = babylonCart;
                }
                if (teamNum == playerTeam && cartNum == 0) {
                    camera.parent = babylonCart.body;
                    camera.position = new b.Vector3(0, 0, 0);
                    camera.rotation = new b.Vector3(0, Math.PI / 2, 0);
                    playerCart = babylonCart;
                } else if (teamNum == playerTeam) {
                    attachFreindlyCartAI(babylonCart);
                }
            });
        });
        callback();
    });
};