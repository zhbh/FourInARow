var CONFIG = {
	BOARD_WIDTH : 7,
	BOARD_HEIGHT : 6,
	// BOARD_NUM : 7,
	NOCHESS : 0,
	BLACK : 1,
	WHITE : 2,
};

var SCORE = {
	SLEEP2 : 1,
	SLEEP3 : 2,
	SLEEP4 : 3,
	LIVE2 : 4,
	LIVE3 : 5,
	LIVE4 : 6,
	LIVE5 : 7,
	NOTYPE : 11,
	ANALSISED : 255,
	TOBEANALSIS : 0
};

var PositionValueArr = [
	[0,0,0,0,0,0,0],
	[0,1,1,1,1,1,0],
	[0,1,1,1,1,1,0],
	[0,1,1,1,1,1,0],
	[0,1,2,2,2,1,0],
	[0,1,2,2,2,1,0],
	[0,1,2,3,2,1,0]
]; 

var COUNT = 0;
