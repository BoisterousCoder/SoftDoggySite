var isHost;
var socket = io();
var otherPlayerId;
var isInGame = false;

$(function() {
    function endMenu() {
        $('#menuCanvas').remove();
        $('#background').remove();
        startGame();
    }

    function searchForFriend() {
        waitMenu.switchTo();

        socket.emit('hostRequest', {
            id: socket.id,
            game: 'CartMaster-' + mapIndex.name
        });
        socket.on('hostRequest', function(res) {
            if ((res.id != socket.id) && (!isInGame) && (res.game == 'CartMaster-' + mapIndex.name)) {
                socket.emit('joinRequest', {
                    clientId: socket.id,
                    hostId: res.id
                });
                otherPlayerId = res.id;
                isHost = false;
                endMenu();
            }
        });
        socket.on('joinRequest', function(res) {
            if ((res.hostId == socket.id) && !isInGame) {
                otherPlayerId = res.clientId;
                isHost = true;
                isInGame = true;
                endMenu();
            }
        });

        refresh();
    }

    startUI();

    elements.default.background = 'lightGrey';

    var startButton = addElement.rect('startButton', 30, 30, 90, 20);
    startButton.onClick = searchForFriend;
    startButton.offColor = 'green';
    startButton.text = 'start game';
    startButton.textColor = 'black';

    var settingsButton = addElement.rect('settingsButton', 30, 70, 90, 20);
    settingsButton.onClick = searchForFriend;
    settingsButton.offColor = 'green';
    settingsButton.text = 'settings';
    settingsButton.textColor = 'black';

    var waitMenu = addElement.menu('waitMenu', 'click', []);
    waitMenu.background = elements.default.background;
    waitMenu.width = c.canvas.width;
    waitMenu.height = c.canvas.height;

    var waitText = addElement.rect('waitText', 125, 30, 250, 20);
    waitText.offColor = 'green';
    waitText.text = 'Waiting on another player';
    waitText.textColor = 'black';
    elements.waitMenu.addChild(waitText.name);
	
	elements.default.switchTo();
	
	addMapSelector();
});