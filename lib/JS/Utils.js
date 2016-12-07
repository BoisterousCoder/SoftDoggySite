function makePolarCoord(linearCoord) {
    //note: this function goes by degrees from from the positive y axis
    var x = linearCoord.x;
    var y = linearCoord.y;
    //r=sqrt(x^(2)+y^(2))
    //theta=arctan(x/y)

    var polarCoord = {
        r: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
        theta: Math.atan(y / x)
    }
	if(isNaN(polarCoord.theta)){
		console.log("atan fail");
	}
    if ((x < 0) && (y < 0)) {
        polarCoord.theta -= degreesToRadians(90);
    } else if (x < 0) {
        polarCoord.theta += degreesToRadians(90);
    }
    return polarCoord;
}

function makeCoordRelative(origon, coord) {
    coord = {
        x: coord.x - origon.x,
        y: coord.y - origon.y
    };
    return coord;
}

function degreesToRadians(degrees) {
    return (Math.PI * degrees) / 180
}

function setWaitFrames(limit, callback, bullet) {
    var index = waitingOBJS.length;
    waitingOBJS[index] = {
        waitLimit: limit,
        framesWaited: 0,
        callback: callback,
        bullet: bullet
    };
    return function() {
        waitingOBJS.splice(index, 1);
        callback();
    }
}

function loadJSON(src, callback){
	var XMLObj = new XMLHttpRequest();
    XMLObj.overrideMimeType("application/json");
    XMLObj.open('GET', src, true);
    XMLObj.onreadystatechange = function() {
        if (XMLObj.readyState == 4 && XMLObj.status == "200") {
            callback(JSON.parse(XMLObj.responseText));
        }
    }
	
    XMLObj.send(null);
}