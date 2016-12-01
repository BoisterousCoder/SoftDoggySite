var smallScreenMax = 735;
var mediumScreenMax = 1068;
var isVertMenuHidden = false;

$(function () {
	$('#vertMenuList').hide();
	$('#menuButton').click(function () {
		if (!isVertMenuHidden) {
			showVertList();
		} else {
			hideVertList();
		}
	});
	$('.menuItem').click(function(){
        var pathParts = window.location.pathname.split('/');
        pathParts[pathParts.length-1] = $(this).attr('goto');
        window.location.pathname = pathParts.join('/');
	});
	refreshSize();
	while($('.project').length % 4 != 0){
		var placeHolder = $('div');
		placeHolder.addClass('project');
		$('#projectWrapper').append(placeHolder);
	}
	$('.project').each(function(i, projectElement){
		projectElement = $(projectElement);
		var projectName = projectElement.attr('projectname');
		
		var header = $('<h3></h3>');
		header.html(projectName);
		
		var playButton = $('<button></button>');
		playButton.addClass('playButton');
		playButton.html('Play');
		
		var sourceButton = $('<button></button>');
		sourceButton.addClass('sourceButton');
		sourceButton.html('Source')
		
		var buttonWrapper = $('<div></div>');
		buttonWrapper.addClass('buttonWrapper');
		buttonWrapper.append(playButton);
		buttonWrapper.append(sourceButton);
		
		projectElement.html(header);
		projectElement.append(buttonWrapper);
	});
	$(window).resize(refreshSize);
});

function showVertList() {
	isVertMenuHidden = true;
	$('#vertMenuList').slideDown();
	$('#menuButton div').rotate(45);
	$('#topBar').rotate(90);
	$('#topBar').moveTo(16, 24);
	$('#bottomnBat').moveTo(24, 16);
}

function hideVertList() {
	isVertMenuHidden = false;
	$('#vertMenuList').slideUp();
	$('#menuButton div').rotate(0);
	$('#topBar').rotate(0);
	$('#topBar').moveTo(16, 20);
	$('#bottomnBat').moveTo(16, 25);
}

function refreshSize() {
	var screenWidth = window.innerWidth;
	var projectWrapper = $('#projectWrapper');
	var collumns;
	var fontSize;
	
	if (screenWidth < smallScreenMax) {
		$('#menuButton').show();
		$('#horizMenuList li').hide();
		$('#logo, #bag').show();
		$('#bag').css('float', 'right');
	}else{
		hideVertList();
		$('#menuButton').hide();
		$('#horizMenuList li').show();
		$('#bag').css('float', 'none');
	}
	
	if(screenWidth < smallScreenMax){
		collumns = 1;
		fontSize = 1.5;
	}else if(screenWidth < mediumScreenMax){
		collumns = 2;
		fontSize = 1.5;
	}else{
		collumns = 4;
		fontSize = 1;
	}
	
	projectWrapper.css('-webkit-column-count', collumns);
	projectWrapper.css('-moz-column-count', collumns);
	projectWrapper.css('column-count', collumns);
	projectWrapper.css('font-size', fontSize +'em');
	
	var footer = $('footer');
	var main = $('main');
	var possibleHeight1 = main.position().top + main.outerHeight(true);
	var possibleHeight2 = window.innerHeight - em(4, footer);
	var height = Math.max(possibleHeight1, possibleHeight2);
	footer.moveTo(0, height);
	
	var body = $('body').perfectScrollbar();
	
	if(isOverflowing(footer)){
		footer.css('display', 'none');
	}
}

function em(input, jqueryObj) {
	var emSize = parseFloat(jqueryObj.css("font-size"));
	return (emSize * input);
}

function isOverflowing(element){
	if( element.offsetHeight < element.scrollHeight ||
		element.offsetWidth < element.scrollWidth ){
		return true;
	}else{
		return false;
	}
}
	
jQuery.fn.rotate = function (degrees) {
	$(this).css({
		'transform': 'rotate(' + degrees + 'deg)'
	});
	return $(this);
};
jQuery.fn.moveTo = function (x, y) {
	$(this).css({
		'left': x + 'px',
		'top': y + 'px'
	});
	return $(this);
};