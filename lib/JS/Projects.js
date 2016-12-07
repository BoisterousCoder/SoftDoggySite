var gitHubUsername = 'Shadowace112';
initProjects = function () {
	numberOfplaceHolders = 4 - $('.projectBuble').length % 4;
	for (var i = 0; i < numberOfplaceHolders; i++) {
		$('#projectWrapper').append('<div class="projectBuble placeHolderBuble" projectName="placeHolder"></div>');
	}
	$('.projectBuble').each(function (i, projectElement) {
		projectElement = $(projectElement);
		var projectName = projectElement.attr('projectName');
		
		var header = $('<h3></h3>');
		header.html(projectName);

		var playButton = $('<button></button>');
		playButton.addClass('playButton');
		playButton.addClass('link');
		playButton.html('Play');
		playButton.attr('goto', projectElement.attr('playLink'));

		var sourceButton = $('<button></button>');
		sourceButton.addClass('sourceButton');
		sourceButton.addClass('link');
		sourceButton.html('Source');
		sourceButton.attr('goto', projectElement.attr('srcLink'));
		
		var buttonWrapper = $('<div></div>');
		buttonWrapper.addClass('buttonWrapper');
		buttonWrapper.append(playButton);
		buttonWrapper.append(sourceButton);

		var desc = $('<p></p>');
		desc.addClass('projectDesc');
		desc.html(projectElement.attr('descr'));

		projectElement.html(header);
		projectElement.append(desc);
		projectElement.append(buttonWrapper);
		projectElement.addClass('noselect');
		
		fectchRepoData(projectElement, function () {
			var desc = projectElement.children('p');
			desc.html(projectElement.attr('desc'));
			playButton.attr('goto', projectElement.attr('playLink'));
			sourceButton.attr('goto', projectElement.attr('srcLink'));
		});
	});
}

resizeProjects = function (screenWidth) {
	var projectWrapper = $('#projectWrapper');
	var collumns;
	var fontSize;

	if (screenWidth < smallScreenMax) {
		collumns = 1;
		fontSize = 1.5;
	} else if (screenWidth < mediumScreenMax) {
		collumns = 2;
		fontSize = 1.5;
	} else {
		collumns = 4;
		fontSize = 1;
	}

	projectWrapper.css('-webkit-column-count', collumns);
	projectWrapper.css('-moz-column-count', collumns);
	projectWrapper.css('column-count', collumns);
	projectWrapper.css('font-size', fontSize + 'em');

	if (($('.projectBuble').length - numberOfplaceHolders) % collumns == 0) {
		$('.placeHolderBuble').css('visibility', 'collapse');
		$('.placeHolderBuble').css('display', 'none');
	} else {
		$('.placeHolderBuble').css('visibility', 'hidden');
		$('.placeHolderBuble').css('display', 'initial');
	}
}

function fectchRepoData(projectElement, callback) {
	var repoName = projectElement.attr('gitRepo');
	if(repoName){
		$.getJSON('https://api.github.com/repos/' + gitHubUsername + '/' + repoName, function (data) {
			projectElement.attr('srcLink', 'https://github.com/' + gitHubUsername + '/' + repoName);
			projectElement.attr('desc', data.description)
			callback(data);
		});
	}
}

function onClickLink(e){
	var clickedButton = $(this);
	var url = clickedButton.attr('goto');
	window.open(url);
}