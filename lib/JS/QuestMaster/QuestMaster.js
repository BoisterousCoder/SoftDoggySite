var viewSize = 8;
var socket;
var isOtherPlayerReady = false;
var isPlayerReady = false;
var gameId;
var piecesToRefresh = [];
var maxPointsToSpend = 30;
var multiplierSets = ['Attack', 'Health', 'Mana', 'Speed', 'Stamina'];
var attacks = {
	original: function(attackingPiece, targetPiece) {
		targetPiece = pieces.red[targetPiece];
		attackingPiece = pieces.blue[attackingPiece];
		targetPiece = damage(targetPiece, attackingPiece.newAttack);
		attackingPiece.newStamina -= 5;
		attackingPiece.newSpeed -= 1;
		if (attackingPiece.newStamina < 0 || attackingPiece.newSpeed < 0 || attackingPiece.newMana < 0) {
			targetPiece = damage(targetPiece, -1 * attackingPiece.newAttack);
			attackingPiece.newStamina += 5;
			attackingPiece.newSpeed += 1;
			alert('your ' + attackingPiece.name + ' cannot attack right now');
		}
	},
	origAbil: function(attackingPiece, targetPiece) {
		targetPiece = pieces.red[targetPiece];
		attackingPiece = pieces.blue[attackingPiece];
		targetPiece = damage(targetPiece, attackingPiece.newAttack);
		attackingPiece.newMana -= 5;
		attackingPiece.newSpeed -= 1;
		if (attackingPiece.newStamina < 0 || attackingPiece.newSpeed < 0 || attackingPiece.newMana < 0) {
			targetPiece = damage(targetPiece, -1 * attackingPiece.newAttack);
			attackingPiece.newMana += 5;
			attackingPiece.newSpeed += 1;
			alert('your ' + attackingPiece.name + ' cannot attack right now');
		}
	}
};
var genPieces;

window.onload = function() {
	//initiate the UI
	startUI();

	//set background
	elements.default.background = '#855730';

	var waitingMenu = addElement.menu('waitingMenu', 'none', ['waitingText']);
	waitingMenu.background = 'black';
	waitingMenu.width = c.canvas.width / cScale;
	waitingMenu.height = c.canvas.height / cScale;

	var waitingText = addElement.rect('waitingText', 1 / 3 * (c.canvas.width / cScale),
		1 / 3 * (c.canvas.height / cScale), 1 / 3 * (c.canvas.width / cScale), 1 / 3 * (c.canvas.height / cScale));
	//waitingText.offColor = 'DarkGray';
	waitingText.offBorder = null;
	waitingText.text = 'Waiting on another player to join...';
	waitingText.textColor = 'blue';

	waitingMenu.switchTo();
	refresh();

	socket = io();
	//TODO: Filter for same game
	socket.on('connect', function() {
		createChatBox();
		var isSelfRecived = false;
		socket.emit('joinRequest', {
			id: socket.id
		});

		socket.on('joinRequest', function(res) {
			if (res.id !== socket.id && gameId === undefined && isSelfRecived) {
				gameId = socket.id;
				socket.emit('hostRequest', {
					hostId: socket.id,
					joinId: res.id
				});
				elements.waitingText.text = "Waiting on other player to take thier turn...";
				selectPieces();
			}
			if (res.id === socket.id && gameId === undefined) {
				isSelfRecived = true;
			}
		});

		socket.on('hostRequest', function(res) {
			if (res.joinId === socket.id && gameId === undefined) {
				gameId = res.hostId;
				elements.waitingText.text = "Waiting on other player to take thier turn...";
				selectPieces();
			}
		});
	});
};

function Wrapper(value, callback) {
	this.value = value;
	this.callback = callback;
	this.set = function(newValue) {

		this.value = newValue;
		this.callback();
	};
	this.get = function() {
		return this.value;
	};
}

function addPiece(obj, isInSelectorBox) {
	var y_ = 0;
	if (obj.team === 'blue') {
		y_ = viewSize;
	}
	obj.y = y_ * -1 + 7;
	obj.x = pieces.blue.length;
	obj.isInGame = false;
	obj.id = obj.x;
	obj.isDead = false;
	pieces.blue[pieces.blue.length] = obj;

	if (isInSelectorBox) {
		//main button
		var piece = addElement.rect('piece' + obj.name, 125 * obj.x + 12.5, 20, 100, 50);
		piece.isToggleable = true;
		piece.text = obj.name;
		piece.textColor = 'black';
		piece.textFont = 'Palatino';
		piece.pieceRefrence = obj.x;
		piece.offColor = 'DarkGray';
		piece.onColor = 'DarkGray';

		piece.onClick = function(clickedPiece) {
			var refrence = pieces.blue[clickedPiece.pieceRefrence];
			refrence.isInGame = !clickedPiece.isOn;
		};

		elements.startMenu.addChild('piece' + obj.name);


		//multiplier buttons
		var multiples = [1.5, 2, 2.5, 3, 3.5];

		multiplierSets.forEach(function(multiplierSet, i) {
			var x = 125 * obj.x + 12.5;
			var y = 35 * i + 90;
			var multiplierSetTitle = addElement.rect('multiplierSetTitle' + obj.name + multiplierSet, x, y, 100, 15);
			multiplierSetTitle.textColor = 'green';
			multiplierSetTitle.textAlgin = 'left';
			multiplierSetTitle.text = multiplierSet;
			//multiplierSetTitle.textFont = 'Palatino';
			multiplierSetTitle.textSize = 15;
			multiplierSetTitle.offBorder = null;

			elements.startMenu.addChild(multiplierSetTitle.name);

			var multiplierSetTabCont = addElement.tabCont('multiplierSetTabCont' + obj.name + multiplierSet, [], true);

			multiples.forEach(function(multiple, i_) {
				x = 125 * obj.x + 14 + 20 * i_;
				y = 35 * i + 106.5;

				var multipleButton = addElement.rect('multipleButton' + multiple + obj.name + multiplierSet, x, y, 17, 12);
				multipleButton.textColor = 'blue';
				multipleButton.textFont = 'Palatino';
				multipleButton.textSize = 10;
				multipleButton.text = multiple;
				multipleButton.offColor = 'gray';
				multipleButton.onColor = 'gray';
				multipleButton.isToggleable = true;
				multipleButton.multiplierSet = multiplierSet;
				multipleButton.multiplier = multiple;
				multipleButton.pieceRefrence = obj.x;
				multipleButton.borderWidth = 3;
				piecesToRefresh[piecesToRefresh.length] = multipleButton.name;

				multipleButton.onClick = function(clickedButton) {
					if (clickedButton.isOn) {
						pieces.blue[clickedButton.pieceRefrence]["new" + clickedButton.multiplierSet] =
							pieces.blue[clickedButton.pieceRefrence]['original' + clickedButton.multiplierSet];
						pieces.blue[clickedButton.pieceRefrence]["max" + clickedButton.multiplierSet] =
							pieces.blue[clickedButton.pieceRefrence]['original' + clickedButton.multiplierSet];
					}
					else {
						pieces.blue[clickedButton.pieceRefrence]["new" + clickedButton.multiplierSet] =
							pieces.blue[clickedButton.pieceRefrence]['original' + clickedButton.multiplierSet] * clickedButton.multiplier;
						pieces.blue[clickedButton.pieceRefrence]["max" + clickedButton.multiplierSet] =
							pieces.blue[clickedButton.pieceRefrence]['original' + clickedButton.multiplierSet] * clickedButton.multiplier;
					}
				};

				pieces.blue[multipleButton.pieceRefrence]["new" + multipleButton.multiplierSet] =
					pieces.blue[multipleButton.pieceRefrence]['original' + multipleButton.multiplierSet];
				pieces.blue[multipleButton.pieceRefrence]["max" + multipleButton.multiplierSet] =
					pieces.blue[multipleButton.pieceRefrence]['original' + multipleButton.multiplierSet];
				multiplierSetTabCont.addTab(multipleButton.name);
				elements.startMenu.addChild(multipleButton.name);
			});
		});

		//Ability Select Buttons
		var pieceRefrence = pieces.blue[obj.x];
		var x = 125 * obj.x + 12.5;
		var y = 35 * 5 + 106.5;
		var set1Title = addElement.rect('set1TitleFor' + obj.name, x, y, 100, 15);
		set1Title.offBorder = null;
		set1Title.offColor = null;
		set1Title.text = 'Abilities';
		set1Title.textColor = 'green';
		set1Title.textFont = 'Palatino';
		set1Title.textSize = 15;
		elements.startMenu.addChild(set1Title.name);


		//set 1
		addElement.tabCont('set1ContFor' + obj.name, [], false);
		pieceRefrence.abilSet1.forEach(function(ability, i) {
			var x = 125 * obj.x + 12.5;
			var y = 35 * 5 + 106.5 + 20 + 15 * i;
			var abilButton = addElement.rect('abil' + i + 'Set1' + obj.name + 'Button', x, y, 47, 12);
			abilButton.borderWidth = 3;
			abilButton.offColor = 'gray';
			abilButton.onColor = 'gray';
			abilButton.isToggleable = true;
			abilButton.text = ability.name;
			abilButton.textColor = 'blue';
			abilButton.textFont = 'Palatino';
			abilButton.textSize = 7.5;
			abilButton.pieceRefrence = obj.x;
			abilButton.ability = ability;
			abilButton.onClick = function(clickedButton) {
				pieces.blue[clickedButton.pieceRefrence].abil1 = clickedButton.ability;
			};

			elements['set1ContFor' + obj.name].addTab(abilButton.name);
			elements.startMenu.addChild(abilButton.name);
		});

		//set 2
		addElement.tabCont('set2ContFor' + obj.name, [], false);
		pieceRefrence.abilSet2.forEach(function(ability, i) {
			var x = 125 * obj.x + 12.5 + 50;
			var y = 35 * 5 + 106.5 + 20 + 15 * i;
			var abilButton = addElement.rect('abil' + i + 'Set2' + obj.name + 'Button', x, y, 47, 12);
			abilButton.borderWidth = 3;
			abilButton.offColor = 'gray';
			abilButton.onColor = 'gray';
			abilButton.isToggleable = true;
			abilButton.text = ability.name;
			abilButton.textColor = 'blue';
			abilButton.textFont = 'Palatino';
			abilButton.textSize = 7.5;
			abilButton.pieceRefrence = obj.x;
			abilButton.ability = ability;
			abilButton.onClick = function(clickedButton) {
				pieces.blue[clickedButton.pieceRefrence].abil2 = clickedButton.ability;
			};

			elements['set2ContFor' + obj.name].addTab(abilButton.name);
			elements.startMenu.addChild(abilButton.name);
		});
	}
}

var pieces = {
	red: [],
	blue: []
};

function selectPieces() {
	//create UI
	var startMenu = addElement.menu('startMenu', 'click', ['readyButton']);
	startMenu.background = elements.default.background;
	startMenu.width = c.canvas.width;
	startMenu.height = c.canvas.height;

	var readyButton = addElement.rect('readyButton', 20, c.canvas.height / cScale - 40, 100, 20);
	readyButton.offColor = 'black';
	readyButton.onColor = 'black';
	readyButton.offBorder = null;
	readyButton.text = 'ready';
	readyButton.textColor = 'green';
	readyButton.isToggleable = true;
	readyButton.onClick = function() {
		if (!readyButton.isOn) {
			socket.emit('teamPieces', {
				id: socket.id,
				data: pieces.blue,
				gameId: gameId
			});
			socket.emit('ready', {
				id: socket.id,
				data: true,
				gameId: gameId
			});
			if (isOtherPlayerReady && pieces.red !== null) {
				startGame();
			}
			isPlayerReady = true;
		}
		else {
			socket.emit('ready', {
				id: socket.id,
				data: false,
				gameId: gameId
			});
			isPlayerReady = false;
		}
	};
	readyButton.onClick_ = readyButton.onClick;

	var pointCounter = addElement.rect('pointCounter', 140, c.canvas.height / cScale - 40, 200, 20);
	pointCounter.text = maxPointsToSpend;
	pointCounter.textColor = 'blue';
	pointCounter.textAlgin = 'left';
	pointCounter.offBorder = null;
	pointCounter.offColor = elements.default.background;
	pointCounter.textWrapper = new Wrapper(readyButton.text, function() {});
	pointCounter.onPreRefresh = function() {
		pointCounter.textWrapper.set(maxPointsToSpend);
		piecesToRefresh.forEach(function(pieceName, i) {
			var piece = elements[pieceName];
			if (piece.isOn) {
				pointCounter.textWrapper.set(pointCounter.textWrapper.get() - 2 * (piece.multiplier - 1));
				if (pointCounter.textWrapper.get() < 0) {
					readyButton.isOn = true;
					readyButton.onClick(readyButton);
					readyButton.isOn = false;
					readyButton.isToggleable = false;
					readyButton.onClick = function(thisElement) {};
					readyButton.offColor = 'red';

					pointCounter.textWrapper.callback = function() {
						if (pointCounter.textWrapper.get() >= 0) {
							readyButton.isToggleable = true;
							readyButton.onClick = readyButton.onClick_;
							readyButton.offColor = 'black';
						}
					};
				}
				readyButton.refresh();
			}
		});
		pieces.blue.forEach(function(piece, i) {
			if (elements['piece' + piece.name].isOn) {
				pointCounter.textWrapper.set(pointCounter.textWrapper.get() - 5);
				if (pointCounter.textWrapper.get() < 0) {
					readyButton.isOn = true;
					readyButton.onClick(readyButton);
					readyButton.isOn = false;
					readyButton.isToggleable = false;
					readyButton.onClick = function(thisElement) {};
					readyButton.offColor = 'red';

					pointCounter.textWrapper.callback = function() {
						if (pointCounter.textWrapper.get() >= 0) {
							readyButton.isToggleable = true;
							readyButton.onClick = readyButton.onClick_;
							readyButton.offColor = 'black';
						}
					};
				}
				readyButton.refresh();
			}
		});
		pointCounter.text = pointCounter.textWrapper.get();
	};

	startMenu.addChild(pointCounter.name);
	createAllPieces();

	//Socket listeners
	socket.on('teamPieces', function(res) {
		if (res.id !== socket.id && gameId == res.gameId) {
			res.data.forEach(function(piece) {
				piece.y = -1 * piece.y + 7;
			});
			pieces.red = res.data;
		}
	});

	socket.on('ready', function(res) {
		if (res.id !== socket.id && gameId == res.gameId) {
			isOtherPlayerReady = res.data;
			if (isPlayerReady && pieces.red !== null) {
				startGame();
			}
		}
	});

	elements.startMenu.switchTo();
	refresh();
}

function startGame() {
	var offSet = 20;
	var tileSize = (scale - (2 * offSet)) / viewSize;

	//create tab cont
	var moveTarget = addElement.tabCont('moveTarget', [], true);

	//gen tiles
	for (var y = 0, x = 0, i = 0, isBlack = false; y < viewSize; x++, i++, isBlack = !isBlack) {
		var element = addElement.rect("boardSquare" + i, x * tileSize + offSet, y * tileSize + offSet, tileSize, tileSize);
		if (isBlack) {
			element.offColor = "white";
		}
		else {
			element.offColor = "black";
		}
		element.offBorder = null;
		element.onClick = function(clickedElement) {
			if (elements.moveTarget.selected !== null) {
				var selected = elements[elements.moveTarget.selected];
				var oldx = selected.x;
				var oldy = selected.y;
				var isNotSameLoc = !((selected.x === clickedElement.x + 0.5 * tileSize) && (selected.y === clickedElement.y + 0.5 * tileSize));
				var piece = pieces.blue[selected.pieceRefrence];
				var isInSpeedReach = (
					(clickedElement.x >= selected.x - 0.5 * tileSize - piece.newSpeed * tileSize && clickedElement.x 
					< selected.x + 0.5 * tileSize + piece.newSpeed * tileSize) &&
					(clickedElement.y >= selected.y - 0.5 * tileSize - piece.newSpeed * tileSize && clickedElement.y 
					< selected.y + 0.5 * tileSize + piece.newSpeed * tileSize));
				var isOtherPieceInNewSquare = false;
				pieces.blue.forEach(function(thisPiece) {
					if ((thisPiece.x * tileSize + 0.5 * tileSize + offSet == clickedElement.x) 
					&& (thisPiece.y * tileSize + 0.5 * tileSize + offSet == clickedElement.y)) {
						isOtherPieceInNewSquare = true;
					}
				});
				pieces.red.forEach(function(thisPiece) {
					if ((thisPiece.x * tileSize + offSet == clickedElement.x) && (thisPiece.y * tileSize + offSet == clickedElement.y)) {
						isOtherPieceInNewSquare = true;
					}
				});
				if (selected.isOn && isNotSameLoc && isInSpeedReach && !isOtherPieceInNewSquare) {
					movePieceByElement(selected, clickedElement.x, clickedElement.y);
					var d;
					if (Math.abs(selected.x - oldx) > Math.abs(selected.y - oldy)) {
						d = Math.abs(selected.x - oldx);
					}
					else {
						d = Math.abs(selected.y - oldy);
					}
					for (var n = 0; n < d; n += tileSize) {
						piece.newSpeed -= 1;
					}
					refresh();
				}
			}
		};
		if (x === viewSize - 1) {
			y++;
			x = -1;
			isBlack = !isBlack;
		}
	}

	//gen top buttons
	addElement.tabCont('menuCont', [], true);

	pieces.blue.forEach(function(piece, i) {
		if (piece.isInGame) {
			var menu = addElement.menu('menuFor' + piece.name, 'click', []);
			menu.x = 0;
			menu.y = offSet;
			menu.width = c.canvas.width;
			menu.height = c.canvas.height - offSet;
			menu.pieceRefrence = piece.id;
			menu.background = 'gray';

			var element = addElement.rect('menuButtonFor' + piece.name, ((c.canvas.width / cScale) / pieces.blue.length) * i,
				0, (c.canvas.width / cScale) / pieces.blue.length, offSet);
			element.offColor = 'black';
			element.offBorder = 'DarkGray';
			element.textColor = 'green';
			element.textSize = offSet;
			element.pieceRefrence = piece.id;
			element.isPieceDead = false;
			element.text = piece.name;
			element.opensMenu = menu.name;
			element.isToggleable = true;
			element.onPreRefresh = function(thisElement) {
				var refrencedPiece = pieces.blue[thisElement.pieceRefrence];
				if (refrencedPiece.isDead && !thisElement.isPieceDead) {
					thisElement.offColor = 'red';
					thisElement.opensMenu = null;
					thisElement.isToggleable = false;
					thisElement.isOn = false;
					thisElement.isPieceDead = true;
					thisElement.onClick = function() {};
				}
			};

			elements.menuCont.addTab(element.name);

			//create buttons in piece menus
			var portrait = addElement.rect('portaitFor' + piece.name, offSet, 2 * offSet, 125, 125);
			portrait.offBorder = 'black';
			portrait.offColor = 'DarkGray';
			portrait.textColor = 'green';
			portrait.text = piece.name;
			menu.addChild(portrait.name);

			var mainAttack = addElement.rect('mainAttackButtonFor' + piece.name, offSet + 150, offSet * 2, 110, 30);
			mainAttack.ability = piece.mainAttack;
			mainAttack.offColor = 'DarkGray';
			mainAttack.offBorder = 'yellow';
			mainAttack.text = piece.mainAttack.name;
			mainAttack.onPreRefresh = function(thisElement) {
				thisElement.ability = piece.mainAttack;
			};
			mainAttack.onClick = function() {
				attack(piece, i, 'mainAttack');
			};
			menu.addChild(mainAttack.name);

			if (piece.abil1 !== undefined) {
				var abil1 = addElement.rect('abil1ButtonFor' + piece.name, offSet + 150, offSet * 2 + 50, 150, 30);
				abil1.ability = piece.abil1;
				abil1.offColor = 'DarkGray';
				abil1.offBorder = 'black';
				// abil1.textColor = 'blue';
				abil1.text = piece.abil1.name;
				abil1.onRefresh = function(thisElement) {
					abil1.ability = piece.abil1;
				};
				abil1.onClick = function() {
					attack(piece, i, 'abil1');
				};
				menu.addChild(abil1.name);
			}

			if (piece.abil2 !== undefined) {
				var abil2 = addElement.rect('abil2ButtonFor' + piece.name, offSet + 150, offSet * 2 + 100, 150, 30);
				abil2.ability = piece.abil2;
				abil2.offColor = 'DarkGray';
				abil2.offBorder = 'black';
				// abil2.textColor = 'blue';
				abil2.text = piece.abil2.name;
				abil2.onRefresh = function(thisElement) {
					abil2.ability = piece.abil2;
				};
				abil2.onClick = function() {
					attack(piece, i, 'abil2');
				};
				menu.addChild(abil2.name);
			}

			//gen stats
			multiplierSets.forEach(function(stat, i) {
				var statText = addElement.rect('statTextFor' + stat + 'of' + piece.name, offSet, 150 + offSet + 60 * i, 125, 50);
				statText.text = stat + ": " + piece['new' + stat] + '/' + piece['max' + stat];
				statText.textColor = 'blue';
				statText.offBorder = null;
				statText.stat = stat;
				statText.pieceRefrence = piece.id;
				statText.onPreRefresh = function(thisElement) {
					piece = pieces.blue[thisElement.pieceRefrence];
					thisElement.text = thisElement.stat + ": " + piece['new' + thisElement.stat] + '/' + piece['max' + thisElement.stat];
				};

				menu.addChild(statText.name);
			});
		}
	});

	//gen end turn button
	var turnEndButton = addElement.rect('turnEndButton', 0, c.canvas.height / cScale - offSet, offSet * 5, offSet);
	turnEndButton.offColor = 'blue';
	turnEndButton.offBorder = null;
	turnEndButton.textSize = offSet;
	turnEndButton.text = 'End Turn';
	turnEndButton.onClick = function() {
		socket.emit('turn', {
			id: socket.id,
			gameId: gameId,
			data: pieces
		});
		elements.waitingMenu.switchTo();
		refresh();
	};
	elements.default.addChild(turnEndButton.name);

	//create socket end turn listener
	socket.on('turn', function(res) {
		if (res.id !== socket.id && res.gameId == gameId) {
			res.data.blue.forEach(function(piece) {
				piece.y = -1 * piece.y + 7;
			});
			pieces.red = res.data.blue;

			res.data.red.forEach(function(piece) {
				piece.y = -1 * piece.y + 7;
			});
			pieces.blue = res.data.red;

			genPieces();
			genPieces();

			pieces.blue.forEach(function(piece, i) {
				piece.newSpeed = piece.maxSpeed;
				piece.newMana = piece.maxMana;
				piece.newStamina = piece.maxStamina;
			});

			elements.default.switchTo();

			refresh();
		}
	});

	genPieces = function() {
		//create blue pieces
		pieces.blue.forEach(function(piece) {
			if (piece.isDead) {
				elements['bluePiece' + piece.name] = undefined;
				var deadPieceButton = addElement.circ('bluePiece' + piece.name,
					tileSize * piece.x + offSet + 0.5 * tileSize,
					tileSize * piece.y + offSet + 0.5 * tileSize,
					0.5 * tileSize - 3);
				deadPieceButton.offColor = 'grey';
				deadPieceButton.textColor = 'red';
				deadPieceButton.textAlgin = 'center';
				deadPieceButton.borderWidth = 3;
				deadPieceButton.textSize = (3 / 4) * tileSize;
				deadPieceButton.textFont = 'Palatino';
				deadPieceButton.text = piece.name.charAt(0);
			}
			else if (piece.isInGame) {
				elements['bluePiece' + piece.name] = undefined;
				var moveGuideBox = addElement.rect('moveGuideBoxFor' + piece.name, 0, 0, 0, 0);
				moveGuideBox.offBorder = 'yellow';

				var pieceButton = addElement.circ('bluePiece' + piece.name,
					tileSize * piece.x + offSet + 0.5 * tileSize,
					tileSize * piece.y + offSet + 0.5 * tileSize,
					0.5 * tileSize - 3);
				pieceButton.offColor = 'blue';
				pieceButton.onColor = 'blue';
				pieceButton.textColor = 'green';
				pieceButton.textAlgin = 'center';
				pieceButton.borderWidth = 3;
				pieceButton.textSize = (3 / 4) * tileSize;
				pieceButton.textFont = 'Palatino';
				pieceButton.text = piece.name.charAt(0);
				pieceButton.pieceRefrence = piece.id;
				pieceButton.isToggleable = true;
				//pieceButton.hasSwitchedStates = false;
				pieceButton.onRefresh = function(thisElement) {
					var thisPiece = pieces.blue[thisElement.pieceRefrence];
					var guide = elements['moveGuideBoxFor' + thisPiece.name];

					if (thisElement.isOn) {
						guide.x = thisElement.x - 0.5 * tileSize - thisPiece.newSpeed * tileSize;
						guide.y = thisElement.y - 0.5 * tileSize - thisPiece.newSpeed * tileSize;
						guide.width = tileSize + thisPiece.newSpeed * tileSize * 2;
						guide.height = tileSize + thisPiece.newSpeed * tileSize * 2;
						guide.isVisible = true;
						thisElement.hasSwitchedStates = true;
						guide.refresh();
					}
					else {
						guide.isVisible = false;
						if (thisElement.hasSwitchedStates) {
							thisElement.hasSwitchedStates = false;
							refresh();
						}
					}
				};
				pieceButton.onClick_ = pieceButton.onClick;

				piece.element = element.name;
				moveTarget.addTab(pieceButton.name);
				elements.default.addChild(pieceButton.name);
			}
		});

		//deselect all pieces
		elements.moveTarget.select();

		//create red pieces
		pieces.red.forEach(function(piece) {
			if (piece.isDead) {
				elements['redPiece' + piece.name] = undefined;
				var deadPieceButton = addElement.circ('redPiece' + piece.name,
					tileSize * piece.x + offSet + 0.5 * tileSize,
					tileSize * piece.y + offSet + 0.5 * tileSize,
					0.5 * tileSize - 3);
				deadPieceButton.offColor = 'grey';
				deadPieceButton.textColor = 'red';
				deadPieceButton.textAlgin = 'center';
				deadPieceButton.borderWidth = 3;
				deadPieceButton.textSize = (3 / 4) * tileSize;
				deadPieceButton.textFont = 'Palatino';
				deadPieceButton.text = piece.name.charAt(0);
			}
			else if (piece.isInGame) {
				elements['redPiece' + piece.name] = undefined;
				var pieceButton = addElement.circ('redPiece' + piece.name,
					tileSize * piece.x + offSet + 0.5 * tileSize,
					tileSize * piece.y + offSet + 0.5 * tileSize,
					0.5 * tileSize - 3);
				pieceButton.offColor = 'red';
				pieceButton.onColor = 'red';
				pieceButton.textColor = 'green';
				pieceButton.textAlgin = 'center';
				pieceButton.borderWidth = 3;
				pieceButton.textSize = (3 / 4) * tileSize;
				pieceButton.textFont = 'Palatino';
				pieceButton.text = piece.name.charAt(0);
				pieceButton.pieceRefrence = piece.id;

				moveTarget.addTab(pieceButton.name);
				elements.default.addChild(pieceButton.name);
			}
		});
	};

	//gen pieces
	genPieces();

	function movePieceByElement(element, x, y) {
		element.x = x + 0.5 * tileSize;
		element.y = y + 0.5 * tileSize;
		elements[element.tabCont].select();
		var piece = pieces[element.offColor][element.pieceRefrence];
		piece.x = ((element.x - offSet) - 0.5 * tileSize) / tileSize;
		piece.y = ((element.y - offSet) - 0.5 * tileSize) / tileSize;
	}

	//switch to correct menu
	if (socket.id == gameId) {
		elements.default.switchTo();
	}
	else {
		elements.waitingMenu.switchTo();
	}

	//refresh canvas
	refresh();
}

function damage(targetPiece, damage) {
	targetPiece.newHealth -= damage;
	if (targetPiece.newHealth > targetPiece.maxHealth) {
		targetPiece.newHealth = targetPiece.maxHealth;
	}
	else if (targetPiece.newHealth <= 0) {
		targetPiece.isDead = true;
		genPieces();
		refresh();
	}
	return targetPiece;
}

function createChatBox() {
	//gen html
	var x = c.canvas.width;
	var width = window.innerWidth - c.canvas.width;
	var height = c.canvas.height;

	$('#chatBox').css({
		'left': x + 'px',
		'top': '0px',
		'width': width + 'px',
		'height': height + 'px',
	});

	//on form submit
	$('form').submit(function() {
		if (gameId == undefined) {
			alert('You must wait until you are in a game to chat');
		}
		else if ($('#nameInput').val() == "") {
			alert('enter a name to use in chat\nbefore you type in chat');
		}
		else if ($('#m').val() == "") {
			alert('You are not allowed to send a blank mesage');
		}
		else {
			socket.emit('chat message', {
				name: $('#nameInput').val(),
				data: $('#m').val(),
				gameId: gameId,
				id: socket.id
			});
			$('#m').val('');
		}
		return false;
	});

	//when one recives a message
	socket.on('chat message', function(msg) {
		if (gameId == msg.gameId) {
			var team;
			if (gameId == undefined) {
				team = 'black';
			}
			else if (socket.id == msg.id) {
				team = 'blue';
			}
			else {
				team = 'red';
			}
			msg.data = msg.data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			msg.name = msg.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

			$('#messages').append($('<li>').prepend('<strong class="' + team + '">' + msg.name + '</strong>: ' + msg.data));
		}
	});
}

function createAllPieces() {
	addPiece({
		name: 'Knight',
		originalHealth: 10,
		originalAttack: 2,
		originalSpeed: 2,
		originalMana: 10,
		originalStamina: 10,
		abilSet1: [{
				name: 'Use Shield',
				target: 'foe',
				range: 3,
				desc: 'Damage you foes using your sword',
				action: 'origAbil'
			},

			{
				name: 'Large Swing',
				target: 'foe',
				range: 3,
				desc: 'Damage you foes using your sword',
				action: 'origAbil'
			}
		],
		abilSet2: [{
				name: 'Charge',
				target: 'foe',
				range: 3,
				desc: 'Damage you foes using your sword',
				action: 'origAbil'
			},

			{
				name: 'Use Javlin',
				target: 'foe',
				range: 3,
				desc: 'Damage you foes using your sword',
				action: 'origAbil'
			}
		],
		mainAttack: {
			name: 'Slash',
			target: 'foe',
			range: 1,
			desc: 'Damage you foes using your sword',
			action: 'original'
		}
	}, true);

	addPiece({
		name: 'Cleric',
		originalHealth: 10,
		originalAttack: 2,
		originalSpeed: 2,
		originalMana: 10,
		originalStamina: 10,
		abilSet1: [{
			name: 'Heal Minor',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: 'Heal Major',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		abilSet2: [{
			name: 'Pray for Speed',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: 'Pray for Attack',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		mainAttack: {
			name: 'Purge',
			target: 'foe',
			range: 1,
			desc: 'Damage you foes using your sword',
			action: 'original'
		}
	}, true);

	addPiece({
		name: 'Mage',
		originalHealth: 10,
		originalAttack: 2,
		originalSpeed: 2,
		originalMana: 10,
		originalStamina: 10,
		abilSet1: [{
			name: "Fire Ball",
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: 'Bolt',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		abilSet2: [{
			name: 'teleport',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: 'Life Drain',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		mainAttack: {
			name: 'Whack',
			target: 'foe',
			range: 1,
			desc: 'Damage you foes using your sword',
			action: 'original'
		}
	}, true);

	addPiece({
		name: 'Rogue',
		originalHealth: 10,
		originalAttack: 2,
		originalSpeed: 2,
		originalMana: 1,
		originalStamina: 1,
		abilSet1: [{
			name: "Rapid Shot",
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: "Long Shot",
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		abilSet2: [{
			name: 'Throw Dagger',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}, {
			name: 'Plant a Trap',
			target: 'foe',
			range: 3,
			desc: 'Damage you foes using your sword',
			action: 'origAbil'
		}],
		mainAttack: {
			name: 'Stab',
			target: 'foe',
			range: 1,
			desc: 'Damage you foes using your sword',
			action: 'original'
		}
	}, true);
}

function attack(piece, i, attackType) {
	var possibleTargets;
	var attackingPiece = pieces.blue[piece.id];
	switch (attackingPiece[attackType].target) {
		case 'alli':
			possibleTargets = 'blue';
			break;
		case 'foe':
			possibleTargets = 'red';
			break;
		default:
			alert('attackingPiece\'s target property is equil to ' + attackingPiece[attackType].target);
	}
	elements.targetSelectMenu = undefined;
	var targetSelectMenu = addElement.menu('targetSelectMenu', 'none', []);
	targetSelectMenu.background = elements.default.background;
	targetSelectMenu.width = c.canvas.width;
	targetSelectMenu.height = c.canvas.height;

	pieces[possibleTargets].forEach(function(targetPiece, x) {
		var d;
		if (Math.abs(targetPiece.x - attackingPiece.x) > Math.abs(targetPiece.y - attackingPiece.y)) {
			d = Math.abs(targetPiece.x - attackingPiece.x);
		}
		else {
			d = Math.abs(targetPiece.y - attackingPiece.y);
		}
		var isTargetInRange = (attackingPiece[attackType].range >= d);

		if (targetPiece.isInGame && isTargetInRange) {
			elements['targetElement' + x] = undefined;
			var targetElement = addElement.rect('targetElement' + x, 100, 100 + 100 * x, 200, 50);
			targetElement.borderWidth = 5;
			targetElement.offBorder = 'black';
			targetElement.offColor = possibleTargets;
			targetElement.textColor = 'green';
			targetElement.text = targetPiece.name;
			targetElement.targetPiece = x;
			targetElement.attackingPiece = i;
			targetElement.onClick = function() {
				switch (possibleTargets) {
					case 'blue':
						attacks[pieces.red[this.attackingPiece][attackType].action](this.attackingPiece, this.targetPiece);
						break;
					case 'red':
						attacks[pieces.red[this.attackingPiece][attackType].action](this.attackingPiece, this.targetPiece);
						break;
				}
				elements.default.switchTo();
				refresh();
				refresh();
			};

			targetSelectMenu.addChild(targetElement.name);
		}
	});
	elements.menuCont.select();

	if (targetSelectMenu.children.length == 0) {
		alert('no targets in range');
		elements.default.switchTo();
	}
	else {
		targetSelectMenu.switchTo();
	}

	refresh();
}


//ondisconect
window.onbeforeunload = function() {
	socket.disconnect();
};

//onresize
window.onresize = function() {
	//set cScale
	c.canvas.height = window.innerHeight;
	c.canvas.width = window.innerHeight;
	cScale = c.canvas.width / scale;
	c.scale(cScale, cScale);

	refresh();

	var x = c.canvas.width;
	var width = window.innerWidth - c.canvas.width;
	var height = c.canvas.height;

	$('#chatBox').css({
		'left': x + 'px',
		'top': '0px',
		'width': width + 'px',
		'height': height + 'px',
	});
};


/*
	|		|	---------
	|		|		|	
	|		|		|	
	|		|		|	
	|		|		|	
	|		|		|	
	|_______|	---------
*/

var c = null;

var elements = {};
var cScale = null;
var scale = 500;
var elementNames = [];
var menus = [];

var mouse = {
	x: 999,
	y: 999,
	newX: 999,
	newY: 999,
	dragging: "",
	draggingMenu: null,
	isDraggingMenu: false,
	isDragging: false,
	isDraggingX: false,
	isDraggingY: false,
	lastPathSave: null
};

var addElement = {
	tabCont: function(name, tabs, isAbleToSelectNone) {
		elements[name] = {};
		var element = elements[name];
		elementNames[elementNames.length] = name;

		element.tabs = tabs;
		element.parent = "default";
		element.name = name;
		element.isAbleToSelectNone = isAbleToSelectNone;
		element.type = 'tabCont';
		element.selected = null;
		element.isOn = true;
		element.onClick = null;
		element.x = 0;
		element.y = 0;
		element.opennedFrom = null;
		element.width = 0;
		element.height = 0;
		element.onRefresh = function(thisElement) {

		};

		element.tabs.forEach(function(tab) {
			elements[tab].tabCont = element.name;
		});

		element.path = function() {
			c.rect(0, 0, 0, 0);
		};
		element.addTab = function(tab) {
			this.tabs[this.tabs.length] = tab;
			elements[tab].tabCont = this.name;
		};
		element.select = function(tab) {
			if (tab !== undefined) {
				this.tabs.forEach(function(thisTab) {
					if (thisTab !== tab) {
						elements[thisTab].isOn = false;
					}
				});
				if (this.isAbleToSelectNone) {
					elements[tab].isOn = !elements[tab].isOn;
					if (!tab.isOn) {
						this.selected = tab;
					}
					else {
						this.selected = null;
					}
				}
				else {
					elements[tab].isOn = true;
					this.selected = tab;
				}
			}
			else {
				this.tabs.forEach(function(thisTab) {
					elements[thisTab].isOn = false;
				});
				this.selected = null;
			}
		};
		element.refresh = function() {
			this.onRefresh(this);
		};
		return element;
	},
	menu: function(name, openType, children) {
		elements[name] = {};
		var element = elements[name];
		elementNames[elementNames.length] = name;
		menus[menus.length] = name;

		element.children = children;
		element.tabCont = null;
		element.parent = "default";
		element.name = name;
		element.type = 'menu';
		element.selected = null;
		element.isOn = true;
		element.onClick = null;
		element.openType = openType;
		element.x = 0;
		element.y = 0;
		element.opennedFrom = null;
		element.width = 0;
		element.isOn = true;
		element.background = 'gray';
		element.height = 0;
		element.onRefresh = function(thisElement) {

		};

		element.switchTo = function() {
			for (var i = 0; i < menus.length; i++) {
				if (menus[i] === this.name) {
					this.isOn = true;
					var menu = this;
					for (var x = 0; x < menu.children.length; x++) {
						elements[menu.children[x]].isVisible = true;
					}
				}
				else {
					elements[menus[i]].isOn = false;
					var menu = elements[menus[i]];
					for (var x = 0; x < menu.children.length; x++) {
						elements[menu.children[x]].isVisible = false;
					}
				}
			}
			if (this.opennedFrom !== null) {
				elements[this.opennedFrom].isVisible = true;
			}
		};
		element.path = function() {
			c.rect(this.x, this.y, this.width, this.height);
		};
		element.addChild = function(child) {
			children[children.length] = child;
			elements[child].parent = this.name;
		};
		element.refresh = function() {
			for (var i = 0; i < this.children.length; i++) {
				elements[this.children[i]].parent = this.name;
				switch (this.openType) {
					case "slideUp":
						c.beginPath();
						this.path();
						if (c.isPointInPath(elements[this.children[i]].x, elements[this.children[i]].y)) {
							elements[this.children[i]].isVisible = true;
						}
						else {
							elements[this.children[i]].isVisible = false;
						}
						break;
					case "slideDown":
						c.beginPath();
						elements[this.children[i]].path();
						if (c.isPointInPath(elements[this.children[i]].x, elements[this.children[i]].y)) {
							elements[this.children[i]].isVisible = true;
						}
						else {
							elements[this.children[i]].isVisible = false;
						}
						break;
					case "slideLeft":
						c.beginPath();
						elements[this.children[i]].path();
						if (c.isPointInPath(elements[this.children[i]].x, elements[this.children[i]].y)) {
							elements[this.children[i]].isVisible = true;
						}
						else {
							elements[this.children[i]].isVisible = false;
						}
						break;
					case "slideRight":
						c.beginPath();
						elements[this.children[i]].path();
						if (c.isPointInPath(elements[this.children[i]].x, elements[this.children[i]].y)) {
							elements[this.children[i]].isVisible = true;
						}
						else {
							elements[this.children[i]].isVisible = false;
						}
						break;
				}
			}
			if (this.isOn) {
				c.beginPath();
				this.path();
				c.fillStyle = this.background;
				c.fill();
			}
			this.isDraggable = null;
			this.onRefresh(this);
		};
		return element;
	},
	rect: function(name, x, y, width, height) {
		elements[name] = {};
		var element = elements[name];
		elementNames[elementNames.length] = name;
		elements.default.addChild(name);

		element.name = name;
		element.type = 'rect';
		element.x = x;
		element.y = y;
		element.width = width;
		element.height = height;
		element.rotation = 0;
		element.onClick = null;
		element.isDraggable = null;
		element.isOn = false;
		element.onColor = null;
		element.offColor = null;
		element.onBorder = 'yellow';
		element.tabCont = null;
		element.offBorder = 'black';
		element.isToggleable = false;
		element.parent = null;
		element.opensMenu = null;
		element.opensMenuType = null;
		element.text = null;
		element.textFont = "Georgia";
		element.textSize = 20;
		element.onPreRefresh = function(thisElement) {

		};
		element.textStyle = function() {
			return this.textSize + 'px ' + this.textFont;
		};
		element.textColor = "black";
		element.borderWidth = 4;
		element.isVisible = true;
		element.textAlgin = 'center';
		element.onRefresh = function(thisElement) {

		};

		element.path = function() {
			c.rect(this.x, this.y, this.width, this.height);
		};
		element.refresh = function() {
			this.onPreRefresh(this);
			if (this.isVisible) {
				c.beginPath();
				this.path();
				if (this.isOn) {
					if (this.onBorder !== null) {
						c.strokeStyle = this.onBorder;
						c.stroke();
					}
					if (this.onColor !== null) {
						c.fillStyle = this.onColor;
						c.fill();
					}
				}
				else {
					if (this.offBorder !== null) {
						c.lineWidth = this.borderWidth;
						c.strokeStyle = this.offBorder;
						c.stroke();
					}
					if (this.offColor !== null) {
						c.lineWidth = this.borderWidth;
						c.fillStyle = this.offColor;
						c.fill();
					}
				}
				if (this.text !== null) {
					c.beginPath();
					c.font = this.textStyle();
					c.fillStyle = this.textColor;
					var x = 0;
					switch (this.textAlgin) {
						case 'left':
							x = this.x;
							break;
						case 'right':
							x = this.x + this.width - c.measureText(this.text).width;
							break;
						case 'center':
							x = this.x + this.width / 2 - c.measureText(this.text).width / 2;
							break;
					}
					c.fillText(this.text, x, this.y + this.height - 0.25 * this.textSize);
				}
				if (this.opensMenu !== null) {
					this.opensMenuType = elements[this.opensMenu].openType;
					elements[this.opensMenu].opennedFrom = this.name;
					switch (this.opensMenuType) {
						case "click":
							this.isToggleable = true;
							break;
						case "slideUp":
							this.isDraggable = 2;
							break;
						case "slideDown":
							this.isDraggable = 2;
							break;
						case "slideLeft":
							this.isDraggable = 1;
							break;
						case "slideRight":
							this.isDraggable = 1;
							break;
						default:
							console.log("Error bad menu type");
							break;
					}
				}
				this.onRefresh(this);
			}
		};
		return element;
	},
	iso: function(name, x, y, width, height) {
		elements[name] = {};
		var element = elements[name];
		elementNames[elementNames.length] = name;
		elements.default.addChild(name);

		element.name = name;
		element.type = 'iso';
		element.x = x;
		element.y = y;
		element.width = width;
		element.height = height;
		element.rotation = 0;
		element.onClick = null;
		element.isDraggable = null;
		element.isOn = false;
		element.onColor = null;
		element.offColor = null;
		element.onBorder = 'yellow';
		element.offBorder = 'black';
		element.isToggleable = false;
		element.tabCont = null;
		element.parent = null;
		element.opensMenu = null;
		element.opensMenuType = null;
		element.text = null;
		element.textFont = "Georgia";
		element.textSize = 20;
		element.textStyle = function() {
			this.textSize + 'px ' + this.textFont;
		};
		element.textColor = "black";
		element.borderWidth = 4;
		element.isVisible = true;
		element.textAlgin = 'center';
		element.onRefresh = function(thisElement) {

		};

		element.path = function() {
			c.moveTo(this.x, this.y + this.height);
			c.lineTo(this.x + this.width, this.y + this.height);
			c.lineTo(this.x + 0.5 * this.width, this.y);
			c.closePath();
		};
		element.refresh = function() {
			if (this.isVisible) {
				c.beginPath();
				this.path();
				if (this.isOn) {
					if (this.onBorder !== null) {
						c.strokeStyle = this.onBorder;
						c.stroke();
					}
					if (this.onColor !== null) {
						c.fillStyle = this.onColor;
						c.fill();
					}
				}
				else {
					if (this.offBorder !== null) {
						c.lineWidth = this.borderWidth;
						c.strokeStyle = this.offBorder;
						c.stroke();
					}
					if (this.offColor !== null) {
						c.lineWidth = this.borderWidth;
						c.fillStyle = this.offColor;
						c.fill();
					}
				}
				if (this.text !== null) {
					c.beginPath();
					c.font = this.textStyle();
					c.fillStyle = this.textColor;
					var x = 0;
					switch (this.textAlgin) {
						case 'left':
							x = this.x;
							break;
						case 'right':
							x = this.x + this.width - c.measureText(this.text).width;
							break;
						case 'center':
							x = this.x + this.width / 2 - c.measureText(this.text).width / 2;
							break;
					}
					c.fillText(this.text, x, this.y + this.height - 0.25 * this.textSize);
				}

				if (this.opensMenu !== null) {
					this.opensMenuType = elements[this.opensMenu].openType;
					switch (this.opensMenuType) {
						case "click":
							this.isToggleable = true;
							break;
						case "slideUp":
							this.isDraggable = 2;
							break;
						case "slideDown":
							this.isDraggable = 2;
							break;
						case "slideLeft":
							this.isDraggable = 1;
							break;
						case "slideRight":
							this.isDraggable = 1;
							break;
					}
				}
				this.onRefresh(this);
			}
		};
		return element;
	},
	circ: function(name, x, y, radius) {
		elements[name] = {};
		var element = elements[name];
		elementNames[elementNames.length] = name;
		elements.default.addChild(name);

		element.name = name;
		element.type = 'circ';
		element.x = x;
		element.y = y;
		element.radius = radius;
		element.rotation = 0;
		element.onClick = null;
		element.isDraggable = null;
		element.isOn = false;
		element.onColor = null;
		element.offColor = null;
		element.onBorder = 'yellow';
		element.tabCont = null;
		element.offBorder = 'black';
		element.isToggleable = false;
		element.parent = null;
		element.opensMenu = null;
		element.opensMenuType = null;
		element.text = null;
		element.textFont = "Georgia";
		element.textSize = 20;
		element.textStyle = function() {
			return this.textSize + 'px ' + this.textFont;
		};
		element.textColor = "black";
		element.borderWidth = 4;
		element.isVisible = true;
		element.textAlgin = 'center';
		element.onRefresh = function(thisElement) {

		};

		element.path = function() {
			c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		};
		element.refresh = function() {
			if (this.isVisible) {
				c.beginPath();
				this.path();
				if (this.isOn) {
					if (this.onBorder !== null) {
						c.strokeStyle = this.onBorder;
						c.stroke();
					}
					if (this.onColor !== null) {
						c.fillStyle = this.onColor;
						c.fill();
					}
				}
				else {
					if (this.offBorder !== null) {
						c.lineWidth = this.borderWidth;
						c.strokeStyle = this.offBorder;
						c.stroke();
					}
					if (this.offColor !== null) {
						c.lineWidth = this.borderWidth;
						c.fillStyle = this.offColor;
						c.fill();
					}
				}
				if (this.text !== null) {
					c.beginPath();
					c.font = this.textStyle();
					c.fillStyle = this.textColor;
					var x = 0;
					switch (this.textAlgin) {
						case 'left':
							x = this.x - this.radius;
							break;
						case 'right':
							x = this.x + this.radius - c.measureText(this.text).width;
							break;
						case 'center':
							x = this.x + this.radius / 2 - c.measureText(this.text).width;
							break;
					}
					c.fillText(this.text, x, this.y + this.radius - 0.25 * this.textSize);
				}
				if (this.opensMenu !== null) {
					this.opensMenuType = elements[this.opensMenu].openType;
					elements[this.opensMenu].opennedFrom = this.name;
					switch (this.opensMenuType) {
						case "click":
							this.isToggleable = true;
							break;
						case "slideUp":
							this.isDraggable = 2;
							break;
						case "slideDown":
							this.isDraggable = 2;
							break;
						case "slideLeft":
							this.isDraggable = 1;
							break;
						case "slideRight":
							this.isDraggable = 1;
							break;
						default:
							console.log("Error bad menu type");
							break;
					}
				}
				this.onRefresh(this);
			}
		};
		return element;
	}
};

function startUI() {
	//get canvas
	var canvas = document.getElementById("mainCanvas");
	c = canvas.getContext("2d");

	//set cScale
	c.canvas.height = window.innerHeight;
	c.canvas.width = window.innerHeight;
	cScale = c.canvas.width / scale;
	c.scale(cScale, cScale);

	mouse.lastPathSave = c.createImageData(1, 1);
	//create click listener
	canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();

		var pos = findOffset(canvas);
		mouse.x = e.pageX - pos.x;
		mouse.y = e.pageY - pos.y;

		for (var i = elementNames.length - 1; i > 0; i -= 1) {
			var element = elements[elementNames[i]];
			if (element.isVisible) {
				c.beginPath();
				element.path();
				if (c.isPointInPath(mouse.x, mouse.y)) {
					if ((element.onClick !== null) && element.isVisible) {
						if (c.isPointInPath(mouse.x, mouse.y)) {
							element.onClick(element);
						}
					}
					if ((element.isDraggable !== null) && element.isVisible) {
						mouse.dragging = element.name;
						mouse.isDragging = true;
						switch (element.isDraggable) {
							case 1:
								mouse.isDraggingX = true;
								mouse.isDraggingY = false;
								break;
							case 2:
								mouse.isDraggingX = false;
								mouse.isDraggingY = true;
								break;
							case 3:
								mouse.isDraggingX = true;
								mouse.isDraggingY = true;
								break;
						}
					}
					if (element.isToggleable && element.isVisible) {
						if (element.tabCont === null) {
							element.isOn = !element.isOn;
						}
						else {
							elements[element.tabCont].select(element.name);
						}
						if (element.opensMenuType === 'click') {
							if (element.isOn) {
								elements[element.opensMenu].switchTo();
								refresh();
							}
							else {
								var parentMenuName = elements[element.opensMenu].parent;
								elements[parentMenuName].switchTo();
								refresh();
							}
						}
						refresh();
					}
					/*if ((element.opensMenu !== null) && element.isVisible) {
						switch (element.opensMenuType) {
							case "slideUp":
								mouse.draggingMenu = element.opensMenu;
								mouse.isDraggingMenu = true;
								elements[element.opensMenu].width = element.width;
								elements[element.opensMenu].height = c.canvas.height / cScale;
								elements[element.opensMenu].x = element.x;
								elements[element.opensMenu].y = element.y + element.height;
								break;
							case "slideDown":
								mouse.draggingMenu = element.opensMenu;
								mouse.isDraggingMenu = true;
								elements[element.opensMenu].width = element.width;
								elements[element.opensMenu].height = c.canvas.height / cScale;
								elements[element.opensMenu].x = element.x;
								elements[element.opensMenu].y = element.y - element.height - menu.height;
								break;
							case "slideLeft":
								mouse.draggingMenu = element.opensMenu;
								mouse.isDraggingMenu = true;
								elements[element.opensMenu].width = c.canvas.width / cScale;
								elements[element.opensMenu].height = element.height;
								elements[element.opensMenu].y = element.y;
								elements[element.opensMenu].x = element.x + element.width;
								break;
							case "slideRight":
								mouse.draggingMenu = element.opensMenu;
								mouse.isDraggingMenu = true;
								elements[element.opensMenu].width = c.canvas.width / cScale;
								elements[element.opensMenu].height = element.height;
								elements[element.opensMenu].y = element.y;
								elements[element.opensMenu].x = element.x - element.width - menu.width;
								break;
						}
					}*/
				}
			}
		}
	}, false);

	canvas.addEventListener('mousemove', function(e) {
		if (mouse.isDragging) {
			var pos = findOffset(canvas);
			if (mouse.isDraggingY && mouse.isDraggingX) {
				mouse.newX = e.pageX - pos.x;
				mouse.newY = e.pageY - pos.y;
				elements[mouse.dragging].x -= (mouse.x - mouse.newX) / cScale;
				elements[mouse.dragging].y -= (mouse.y - mouse.newY) / cScale;
				if (mouse.isDraggingMenu) {
					elements[mouse.draggingMenu].x -= (mouse.x - mouse.newX) / cScale;
					elements[mouse.draggingMenu].y -= (mouse.y - mouse.newY) / cScale;
				}
				mouse.x = e.pageX - pos.x;
				mouse.y = e.pageY - pos.y;
				refresh();
			}
			else if (mouse.isDraggingX) {
				mouse.newX = e.pageX - pos.x;
				elements[mouse.dragging].x -= (mouse.x - mouse.newX) / cScale;
				if (mouse.isDraggingMenu) {
					elements[mouse.draggingMenu].x -= (mouse.x - mouse.newX) / cScale;
				}
				mouse.x = e.pageX - pos.x;
				refresh();
			}
			else if (mouse.isDraggingY) {
				c.beginPath();
				elements[mouse.dragging].path();
				c.clip;
				mouse.newY = e.pageY - pos.y;
				elements[mouse.dragging].y -= (mouse.y - mouse.newY) / cScale;
				if (mouse.isDraggingMenu) {
					elements[mouse.draggingMenu].y -= (mouse.y - mouse.newY) / cScale;
				}
				mouse.y = e.pageY - pos.y;
				refresh();
			}
		}
	}, false);

	canvas.addEventListener('mouseup', function(e) {
		if (mouse.isDragging) {
			mouse.isDragging = false;
			mouse.isDraggingMenu = false;
			refresh();
		}
	}, false);

	canvas.addEventListener('mouseout', function(e) {
		if (mouse.isDragging) {
			mouse.isDragging = false;
			mouse.isDraggingMenu = false;
			refresh();
		}
	}, false);

	//create default menu
	addElement.menu('default', 'none', []);
	elements.default.x = 0;
	elements.default.y = 0;
	elements.default.width = c.canvas.width / cScale;
	elements.default.height = c.canvas.height / cScale;

	//create function to find cursor pos
	function findOffset(obj) {
		var curX = 0;
		var curY = 0;
		if (obj.offsetParent) {
			do {
				curX += obj.offsetLeft;
				curY += obj.offsetTop;
			} while (obj == obj.offsetParent);
			return {
				x: curX,
				y: curY
			};
		}
	}
}

//create function to refresh all elements
function refresh() {
	c.clearRect(0, 0, c.canvas.width, c.canvas.height);
	for (var i = 0; i < elementNames.length; i++) {
		elements[elementNames[i]].refresh();
	}
}