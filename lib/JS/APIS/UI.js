var c = null;
var canvasName = "menuCanvas"

var elements = {};
var cScale = null;
var scale = 360;
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
	var canvas = document.getElementById(canvasName);
	c = canvas.getContext("2d");

	//set cScale
	c.canvas.height = window.innerHeight;
	c.canvas.width = window.innerWidth;
	cScale = c.canvas.height / scale;
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