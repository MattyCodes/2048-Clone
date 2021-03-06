var newGame = function() {
	clearBoard();
	playerScore = 0;
	var boardArray = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ];
	var indexOne = randomIndex();
	do { var indexTwo = randomIndex() } while (indexOne == indexTwo);
	boardArray.splice(indexOne, 1, 2);
	boardArray.splice(indexTwo, 1, 2);
	populateBoard(boardArray);
	$("table").animateCss("bounceIn");
};

var clearBoard = function() {
	var gameBoard = $("tr").children();
	$.each(gameBoard, function(i, e) {
		$(e).empty();
	});
};

var populateBoard = function(boardArray) {
	// Populate the game board given an array.
	var gameBoard = $("tr").children();
	for (var i = 0; i < gameBoard.length; i ++) {
		$( gameBoard[i] ).append( boardArray[i] );
		if ( Number( $(gameBoard[i]).html() ) != 0 ) {
			$( gameBoard[i] ).animateCss('bounceIn');
		};
	};
};

var randomIndex = function() {
	return Math.floor((Math.random() * 16) + 0);
};

var anyEmpty = function() {
	var board = $("tr").children();
	var empty = false;
	for (var i = 0; i <= board.length; i ++) {
		if ( Number( $( board[i]).html() ) == 0 ) {
			empty = true;
		};
	};
	return empty;
};

var removeMerge = function() {
	$( "td" ).removeClass("merge");
};

var randomTile = function(boardArray) {
	// Generate a random '2' tile somewhere on the board that is not yet filled.
	if ( anyEmpty() == true ) {
		var gameBoard = $("tr").children();
		var tile = gameBoard[randomIndex()];
		while ( isEmpty(tile) == false ) { 
			tile = gameBoard[randomIndex()];
		};
		$(tile).append(2);
		$(tile).animateCss('bounceIn');
	};
};

var isEmpty = function(item) {
	var n = Number( $(item).html() );
	if (n == 0) {
		return true;
	} else {
		return false;
	};
};

var getGrid = function() {
	// Get a grid of the table rows.
	var fullGrid = $("tr").children();
	var rowOne = fullGrid.splice(0,4);
	var rowTwo = fullGrid.splice(0,4);
	var rowThree = fullGrid.splice(0,4);
	var rowFour = fullGrid.splice(0,4);
	return [ rowOne, rowTwo, rowThree, rowFour ];
};

var animateAll = function() {
	var g = getGrid();
	for (var r = 0; r < 4; r ++) {
		for (var i = 0; i < 4; i ++) {
			if ( isEmpty(g[r][i]) == false ) {
				$( g[r][i] ).animateCss('bounceIn');
			};
		};
	};
};

var sameState = function(init, curr) {
	var same = true;
	for (var i = 0; i < 16; i ++) {
		var a = init[i];
		var b = curr[i];
		if ( Number( $(a).html() ) != Number( $(b).html() ) ) {
			var same = false;
		};
	};
	return same;
};

var moveRight = function() {
	var initialState = $("tr").children().clone();
		g = getGrid();
	for (r = 0; r <= 3; r ++) {
		for (i = 3; i >= 0; i --) {
			rightRow(g[r], i);
		};
	};
	var currentState = $("tr").children().clone();
	if ( sameState(initialState, currentState) == false) {
		randomTile();
	};
};

var rightRow = function(row, i) {
	// Check each item of the grid and apply logic.
	// Serves as both the right function and the down function.
	if ( isEmpty(row[i] ) == false) {
		if ( isEmpty(row[i + 1]) ) {
			var num = Number( $(row[i]).html() );
			$( row[i] ).empty();
			$( row[i + 1] ).append(num);
			rightRow(row, i + 1);
		} else if ( Number( $(row[i]).html() ) == Number( $(row[i + 1]).html() ) && $(row[i + 1]).hasClass('merge') == false ) {
			var numOne = Number( $(row[i]).html() );
			var numTwo = Number( $(row[i + 1]).html() );
			var result = numOne + numTwo;
			playerScore += result;
			$( row[i] ).empty();
			$( row[i + 1] ).empty();
			$( row[i + 1] ).append(result);
			$( row[i + 1] ).addClass('merge');
			return 'Done';
		} else {
			return 'Done';
		};
	};
};

var keyRight = function() {
	Mousetrap.bind('right', function() {
		moveRight();
		animateAll();
		removeMerge();
		displayResult();
	});
};

var moveLeft = function() {
	var initialState = $("tr").children().clone();
	g = getGrid();
	for (r = 0; r <= 3; r ++) {
		for (i = 0; i <= 3; i ++) {
			leftRow(g[r], i);
		};
	};
	var currentState = $("tr").children().clone();
	if ( sameState(initialState, currentState) == false) {
		randomTile();
	};
};

var leftRow = function(row, i) {
	// Check each item of the grid and apply logic.
	// Serves as both the left function and the up function.
	if ( isEmpty(row[i] ) == false) {
		if ( isEmpty(row[i - 1]) ) {
			var num = Number( $(row[i]).html() );
			$( row[i] ).empty();
			$( row[i - 1] ).append(num);
			leftRow(row, i - 1);
		} else if ( Number( $(row[i]).html() ) == Number( $(row[i - 1]).html() ) && $(row[i - 1]).hasClass('merge') == false ) {
			var numOne = Number( $(row[i]).html() );
			var numTwo = Number( $(row[i - 1]).html() );
			var result = numOne + numTwo;
			playerScore += result;
			$( row[i] ).empty();
			$( row[i - 1] ).empty();
			$( row[i - 1] ).append(result);
			$( row[i - 1] ).addClass('merge');
			return 'Done';
		} else {
			return 'Done';
		};
	};
};

var keyLeft = function() {
	Mousetrap.bind('left', function() {
		moveLeft();
		animateAll();
		removeMerge();
		displayResult();
	});
};

var getColumns = function(grid) {
	// Get a grid of the table columns.
	// Right is down and left is up.
	one = [ grid[0][0], grid[1][0], grid[2][0], grid[3][0] ];
	two = [ grid[0][1], grid[1][1], grid[2][1], grid[3][1] ];
	three = [ grid[0][2], grid[1][2], grid[2][2], grid[3][2] ];
	four = [ grid[0][3], grid[1][3], grid[2][3], grid[3][3] ];
	return [ one, two, three, four ];
};

var moveUp = function() {
	var initialState = $("tr").children().clone();
	g = getColumns( getGrid() );
	for (c = 0; c <= 3; c ++) {
		for (i = 0; i <= 3; i ++) {
			leftRow(g[c], i);
		};
	};
	var currentState = $("tr").children().clone();
	if ( sameState(initialState, currentState) == false) {
		randomTile();
	};
};

var keyUp = function() {
	Mousetrap.bind('up', function() {
		moveUp();
		animateAll();
		removeMerge();
		displayResult();
	});
};

var moveDown = function() {
	var initialState = $("tr").children().clone();
	g = getColumns( getGrid() );
	for (c = 0; c <= 3; c ++) {
		for (i = 3; i >= 0; i --) {
			rightRow(g[c], i);
		};
	};
	var currentState = $("tr").children().clone();
	if ( sameState(initialState, currentState) == false) {
		randomTile();
	};
};

var keyDown = function() {
	Mousetrap.bind('down', function() {
		moveDown();
		animateAll();
		removeMerge();
		displayResult();
	});
};

var gameOver = function() {
	if ( anyEmpty() == false ) {
		var ended = true;
		var g = getGrid();
		for (var r = 0; r <= 3; r ++) {
			for (var i = 0; i <= 3; i ++) {
				if ( i != 3 && Number( $(g[r][i]).html() ) == Number( $(g[r][i + 1]).html() ) ) {
					ended = false;
				} else if ( i != 0 && Number( $(g[r][i]).html() ) == Number( $(g[r][i - 1]).html() ) ) {
					ended = false;
				} else if ( r != 0 && Number( $(g[r][i]).html() ) == Number( $(g[r - 1][i]).html() ) ) {
					ended = false;
				} else if ( r != 3 && Number( $(g[r][i]).html() ) == Number( $(g[r + 1][i]).html() ) ) {
					ended = false;
				};
			};
		};
	};
	return ended;
};

var displayResult = function() {
		if ( gameOver() == true ) {
			$("#game-play").hide();
			$(".score").empty()
			$(".score").append("Score: " + playerScore + "<br>" + "Max Number: " + findLargestNumber() );
			$("#game-over").fadeIn(450);
		};
};

var buttonListener = function() {
	$("body").on("click", "#new-game", function() {
		newGame();
	});
	$("body").on("click", "#try-again", function() {
		$("#game-over").hide();
		$("#game-play").fadeIn(450);
		newGame();
	});
};

var findLargestNumber = function() {
	var max = 0;
	var cells = $("tr").children();
	for (var i = 0; i <= cells.length; i ++) {
		if ( Number( $(cells[i]).html() ) > max ) {
			max = Number( $(cells[i]).html() );
		};
	};
	return max;
};

// Extend jQuery to use Animate.css

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});


