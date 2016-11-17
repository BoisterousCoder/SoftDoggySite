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
	var showCase = $('#showcase');
	var collumns;
	
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
	}else if(screenWidth < mediumScreenMax){
		collumns = 2;
	}else{
		collumns = 4;
	}
	
	showCase.css('-webkit-column-count', collumns);
	showCase.css('-moz-column-count', collumns);
	showCase.css('column-count', collumns);
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