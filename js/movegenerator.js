/*
	走法产生器

	INCLUDE FILES
		config.js
*/

function MoveGenerator() { 
	this.movelist = [];
	this.moveCount = 0;
}

MoveGenerator.prototype.addMove = function( nToX, nToY, nLayout ) {
	var moveArr = [];
	moveArr[this.moveCount] = {};

	moveArr[this.moveCount].x = nToX;
	moveArr[this.moveCount].y = nToY;

	moveArr[this.moveCount].score = PositionValueArr[nToY][nToX];

	//console.log(typeof(this.movelist[nLayout]));

	if( this.movelist[nLayout] === 'undefined' || typeof(this.movelist[nLayout]) !== 'object' ) {
		this.movelist[nLayout] = [];
	}
	this.movelist[nLayout].push( moveArr );

	this.moveCount ++;

	return this.moveCount;
};

MoveGenerator.prototype.createPossibleMove = function( nPosition, nLayout ) {

	var i = 0, j = 0, k = 0,
		bottomOfGridRow = CONFIG.BOARD_HEIGHT - 1;

	this.moveCount = 0;

	for ( i = CONFIG.BOARD_WIDTH - 1; i >= 0; i -- ) {
		if( nPosition[bottomOfGridRow][i] === CONFIG.NOCHESS ) {
			this.addMove( i, bottomOfGridRow, nLayout );
		}else{
			for( j = bottomOfGridRow - 1; j >= 0; j -- ) {
				if( nPosition[j][i] === CONFIG.NOCHESS ) {
					this.addMove( i, j, nLayout );
					break;
				}
			}
		}
	}

	return this.moveCount;
};

