/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
function startSocketListeners() {
    socket.on('disconnector', function(id) {
        if (id == otherPlayerId) {
			alert('other player has left the game');
            location.reload();
        }
    });

    socket.on('bullet', function(res) {
        if (res.id == otherPlayerId) {
            createMesh.bullet(res.size, res.speed, carts[res.cartId], res.attack, res.direction);
        }
    });

    socket.on('movement', function(res) {
        if (res.id == otherPlayerId) {
            carts[res.cartId].body.position = res.position;
        }
    });
	socket.on('rotation', function(res) {
        if (res.id == otherPlayerId) {
			carts[res.cartId].body.rotation = res.rotation;
        }
    });
}