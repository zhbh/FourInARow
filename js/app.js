var chessBoard = new ChessBoard( ),
	//robotMG = new MoveGenerator( ),
	robotSE = new SearchEngine( ),
	robotRE = {};

chessBoard.initBoardArr( );

chessBoard.addBoardListener( function( nToX, nToY ){
	var robotRE = robotSE.searchAGoodMove( chessBoard.grid, chessBoard.computer );

	chessBoard.grid = robotRE.grid;
	chessBoard.addChess( robotRE.x, robotRE.y, robotRE.type );
	chessBoard.turnType = this.player;

	//chessBoard.print( );
} );