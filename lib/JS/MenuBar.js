var verySmallScreenMax = 403;
var smallScreenMax = 735;
var mediumScreenMax = 1068;
var isVertMenuHidden = false;
var numberOfplaceHolders;
var initProjects = function(){}
var resizeProjects = function(){}

$(function () {
	$('#vertMenuList').hide();
	$('#menuButton').click(function () {
		if (!isVertMenuHidden) {
			showVertList();
		} else {
			hideVertList();
		}
	});
	initProjects();
	var body = $('body').perfectScrollbar();
	$('.link').click(onClickLink);
	
	refreshSize();
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
	
	resizeProjects(screenWidth);
	
	var footer = $('footer');
	var main = $('main');
	var possibleHeight1 = main.position().top + main.outerHeight(true);
	var possibleHeight2 = window.innerHeight - em(4, footer);
	var height = Math.max(possibleHeight1, possibleHeight2);
	footer.moveTo(0, height);
	if(height==possibleHeight1){
		footer.css('margin-top', '1em');
	}else{
		footer.css('margin-top', '0em');
	}
	
	if(window.innerWidth < verySmallScreenMax){
		footer.css('display', 'none');
	}else{
		footer.css('display', 'block');
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

function onClickLink(e){
	var clickedButton = $(this);
	var url = clickedButton.attr('goto');
	window.open(url, '_self');
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