/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var healthBar;
var energyBar;
var shieldBar;
var controlText;
var selectedCartsText;
var crossHair;
var moveSound;
var selectedCarts = [];
var selectedLevel = selectableCarts;
var commandUnitName = '';
var lifeText;

var qKey = KeyListener(81, function(isPressed) {
    if (isPressed) {
        if (selectedLevel.tag == 'command') {
            selectedLevel = selectableCarts;
        } else {
            selectedCarts = selectedLevel.all;
            selectedLevel = {
                tag: 'command'
            };
        }
        reloadSelection();
    }
});
var eKey = KeyListener(69, function(isPressed) {
    if (isPressed) {
        if (selectedLevel.tag == 'command') {
            selectedCarts.forEach(function(cart, i) {

            });
        } else if (selectedLevel.tag == 'cart') {
            selectedCarts = selectedLevel['' + selectedLevel.tag + '1'];
            selectedLevel = {
                tag: 'command'
            };
        } else {
            selectedLevel = selectedLevel['' + selectedLevel.tag + '1'];
        }
        reloadSelection();
    }
});
var rKey = KeyListener(82, function(isPressed) {
    if (isPressed) {
        if (selectedLevel.tag == 'command') {
            selectedCarts.forEach(function(cart, i) {

            });
        } else if (selectedLevel.tag == 'cart') {
            selectedCarts = selectedLevel['' + selectedLevel.tag + '2'];
            selectedLevel = {
                tag: 'command'
            };
        } else {
            selectedLevel = selectedLevel['' + selectedLevel.tag + '2'];
        }
        reloadSelection();
    }
});
var fKey = KeyListener(70, function(isPressed) {
    if (isPressed) {
        if (selectedLevel.tag == 'command') {
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.pickedMesh == ground) {
                selectedCarts.forEach(function(cart, i) {
                    cart.moveSphere.position = pickResult.pickedPoint;
                    cart.AI.target = cart.moveSphere;
                });
            }
        } else if (selectedLevel.tag == 'cart') {
            selectedCarts = selectedLevel['' + selectedLevel.tag + '3'];
            selectedLevel = {
                tag: 'command'
            };
        } else {
            selectedLevel = selectedLevel['' + selectedLevel.tag + '3'];
        }
        reloadSelection();
    }
});

function updateUI() {
    if (isWindowLoaded) {
        if (playerCart.health >= 0) {
            healthBar.css({
                'width': (playerCart.health / playerCart.maxHealth)*100 + '%',
            });
        }
        if (playerEnergy >= 0) {
            energyBar.css({
                'width': playerEnergy + '%',
            });
        }
        if (playerCart.sheild >= 0) {
            shieldBar.css({
                'width': (playerCart.sheild / playerCart.maxSheild)*100 + '%',
            });
        }
		lifeText.html('<h2>' + playerCart.lives + '</h2>')
		reloadSelection();
    }
}
window.onload = function() {
    isWindowLoaded = true;
};
window.onresize = function() {
    engine.resize();
    if (crossHair) {
        crossHair.css('left', (window.innerWidth / 2 - $('#crossHair').width() / 2) + 'px');
        crossHair.css('top', (window.innerHeight / 2 - $('#crossHair').height() / 2) + 'px');
    }
};

function reloadSelection() {
    if (selectedLevel.tag != 'command') {
        controlText.html('<h2>' + selectedLevel.tag + 's </h2> </br> Q: select all </br> E: ' + selectedLevel.tag + '1 </br> R: ' + selectedLevel.tag + '2 </br> F: ' + selectedLevel.tag + '3');
        selectedCartsText.html('');
    } else {
        var selectedCartsString = '';
        selectedCarts.forEach(function(cart) {
            if (cart) {
                if (!cart.isDead) {
                    selectedCartsString += '</br><strong>Cart ' + cart.id + ':</strong> health-' + cart.health + ', shield-' + cart.sheild + ', lives-' + cart.lives;
                }
            }
        });
        controlText.html('<h2>Commands </h2></br> Q: select new unit set </br> E: Attack target cart</br> R: Return to base</br> F: Move to defend location');
        selectedCartsText.html('<h2>Selected Units</h2>' + selectedCartsString);
    }
}

function startGameUI() {
    if (isWindowLoaded) {
        healthBar = $("#healthBar").children();
        shieldBar = $("#shieldBar").children();
        energyBar = $("#energyBar").children();
        controlText = $("#controlText");
        crossHair = $('#crossHair');
		lifeText = $('#lifeText');
        selectedCartsText = $('#selectedUnits');
        crossHair.css('left', (window.innerWidth / 2 - $('#crossHair').width() / 2) + 'px');
        crossHair.css('top', (window.innerHeight / 2 - $('#crossHair').height() / 2) + 'px');
        healthBar.css({
            'z-index': '2',
            'height': '100%',
            'width': (playerCart.health / playerCart.maxHealth) * 100 + '%',
        });
        energyBar.css({
            'z-index': '2',
            'height': '100%',
            'width': playerEnergy + '%',
        });
        shieldBar.css({
            'z-index': '2',
            'height': '100%',
            'width': (playerCart.sheild / playerCart.maxSheild) * 100 + '%',
        });
        moveSound = new Audio('sounds/Tank-SoundBible.com-1359027625.ogg');
        moveSound.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        moveSound.play();
        document.getElementById('muteButton').onclick = function() {
            moveSound.muted = !moveSound.muted;
            shootSound.muted = !shootSound.muted;
            hitSound.muted = !hitSound.muted;
        };
        setTimeout(function() {
            reloadSelection();
            $('#loader').remove();
        }, 0);
    } else {
        window.onload = function() {
            healthBar = $("#healthBar").children();
            shieldBar = $("#shieldBar").children();
            energyBar = $("#energyBar").children();
            controlText = $("#controlText");
            crossHair = $('#crossHair');
			lifeText = $('#lifeText');
            selectedCartsText = $('#selectedUnits');
            crossHair.css('left', (window.innerWidth / 2 - $('#crossHair').width() / 2) + 'px');
            crossHair.css('top', (window.innerHeight / 2 - $('#crossHair').height() / 2) + 'px');
            healthBar.css({
                'z-index': '2',
                'height': '100%',
                'width': (playerCart.health / playerCart.maxHealth) * 100 + '%',
            });
            energyBar.css({
                'z-index': '2',
                'height': '100%',
                'width': playerEnergy + '%',
            });
            shieldBar.css({
                'z-index': '2',
                'height': '100%',
                'width': (playerCart.sheild / playerCart.maxSheild) * 100 + '%',
            });
            moveSound = new Audio('sounds/Tank-SoundBible.com-1359027625.ogg');
            moveSound.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            moveSound.play();
            document.getElementById('muteButton').onclick = function() {
                moveSound.muted = !moveSound.muted;
                shootSound.muted = !shootSound.muted;
                hitSound.muted = !hitSound.muted;
            };
            setTimeout(function() {
                isWindowLoaded = true;
                reloadSelection();
                $('#loader').remove();
            }, 0);
        }
    }
}