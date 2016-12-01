/*
	棋盘
	INCLUDE FILES
	config.js
*/

function ChessBoard( nWidth, nHeight ) {
	this.width = nWidth ? nWidth : CONFIG.BOARD_WIDTH;
	this.height = nHeight ? nHeight : CONFIG.BOARD_HEIGHT;
	this.grid = new Array( nHeight );

	this.turnType = CONFIG.BLACK;
	this.player = CONFIG.BLACK;
	this.computer = CONFIG.WHITE;
	this.tapLimitTimeToogle = false;

}

ChessBoard.prototype.initBoardArr = function( ) {
	var row = new Array( this.width );
	for( var j = 0; j < this.height; j ++ ) {
		this.grid[j] = [];
		for ( var i = 0; i < this.width; i ++ ) {
			this.grid[j][i] = CONFIG.NOCHESS; 
		}	
	}
};

ChessBoard.prototype.addBoardListener = function( callback ) {
	var self = this,
		selectColumn;

	$( '.ui-board-bg .ui-board-row' ).on( 'click', function( e ) {

		if( this.turnType !== this.player ) return;

		if( self.tapLimitTimeToogle ) return;

		selectColumn = parseInt( $( this ).attr( 'data-column' ) );

		self.toPlayer( selectColumn, callback );

		self.tapLimitTimeToogle = true;

		setTimeout( function(){
			self.tapLimitTimeToogle = false;
		}, 1000 );

	} );
};

ChessBoard.prototype.toPlayer = function( nColumn, callback ) {

	for( var i = this.height - 1; i >= 0; i -- ) {

		if( this.grid[ i ][ nColumn ] === CONFIG.NOCHESS ) {
		
			this.addChess( nColumn, i, this.player );

			this.turnType = this.computer;
				
			if( callback ) callback( nColumn, i );

			return;
		}
	}

	if( callback ) callback( -1, -1 );
};

ChessBoard.prototype.addChess = function( nToX, nToY, nType ) {

	this.grid[ nToY ][ nToX ] = nType;
	
	var yChessElemet = '<a class="ui-grid-'+ ( ( nType === CONFIG.WHITE ) ? 'ychess"' : 'rchess"' ) +' href="#"></a>';

	var curChess = $( '#fn-board' ).children( '.ui-board-row' ).eq( nToX ).children( '.ui-board-grid' ).eq( nToY ).html( yChessElemet );

	if( nToY === 0 ) {
		return;
	}

	curChess.find( 'a' ).addClass( 'animate animateDown' + ( nToY + 1) );
	setTimeout( function(){
		curChess.find( 'a' ).removeClass( 'animate animateDown' + ( nToY + 1) );
	}, 1000 );
};

ChessBoard.prototype.print = function( ) {
	var i = 0, j = 0,
		endOfLine = this.width - 1,
		showGrid = '';

	for( j = 0; j < this.height; j ++ ) {
		for ( i = 0; i < this.width; i ++ ) {
			showGrid = showGrid + ' ' + this.grid[j][i];
			if( i === endOfLine ) {
				showGrid = showGrid + '\n';
			}
		}
	}

	console.log( showGrid );
};