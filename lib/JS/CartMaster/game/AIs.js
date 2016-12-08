var AIs = {
    all: [],
    freindly: []
};

function attachFreindlyCartAI(cart) {
    var AI = {
        refresh: function() {
            if (AI.target) {
                AI.cart = carts[AI.cart.id];
                var target = {
                    x: AI.target.position.x,
                    y: AI.target.position.z
                };
                var body = {
                    x: AI.cart.body.position.x,
                    y: AI.cart.body.position.z
                };
                var relativeCoord = makeCoordRelative(body, target);
                if ((Math.abs(relativeCoord.x) > 1) ||
                    (Math.abs(relativeCoord.y) > 1)) {

                    var polarCoord = makePolarCoord(relativeCoord);
                    polarCoord.theta -= degreesToRadians(AI.rotations);
					/*if (polarCoord.theta >= degreesToRadians(180)) {
                        polarCoord.theta -= degreesToRadians(360);
                    } else if (polarCoord.theta <= degreesToRadians(-180)) {
                        polarCoord.theta += degreesToRadians(360);
                    }*/
					if (polarCoord.theta >= degreesToRadians(1)) {
                        if (carts[AI.cart.id].rotate(new b.Vector3(0, degreesToRadians(-1), 0))) {
                            AI.rotations++;
                        }

                    } else if (polarCoord.theta <= degreesToRadians(-1)) {
                        if (carts[AI.cart.id].rotate(new b.Vector3(0, degreesToRadians(1), 0))) {
                            AI.rotations--;
                        }
                    }else {
                        carts[AI.cart.id].moveForward();

                    } 
                }else{
					console.log("target reached");
					AI.target = false;
				}
            }
        },
        cart: cart,
        target: false,
        rotations: 0,
        team: playerTeam,
        lastTargetPolarPos: {
            r: 0,
            theta: 0
        }
    }
    var trendMin = -5;
    var trendMax = 5;
    AIs.all[AIs.all.length] = AI;
    AIs.freindly[AIs.freindly.length] = AI;
    cart.AI = AI;
}