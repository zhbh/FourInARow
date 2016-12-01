function SearchEngine() {

	this.curPosition = [];

	this.maxDepth = 3;

	this.moveGenerator = new MoveGenerator( );

	this.eveluation = new Eveluation( );

	this.bestMove = null;
}

SearchEngine.prototype.setPoistion = function( sPosition ) {
	var i = 0, 
		j = 0,
		copyPosition = [];

	for( i = 0; i < CONFIG.BOARD_HEIGHT; i ++ ) {
		copyPosition[ i ] = [];
		for( j = 0; j < CONFIG.BOARD_WIDTH; j ++ ) {
			copyPosition[ i ][ j ] = sPosition[ i ][ j ];
		}
	}

 	return copyPosition;

};


SearchEngine.prototype.searchAGoodMove = function( nPosition, nType) {
	var score;

	this.curPosition = this.setPoistion( nPosition );

	score = this.falphaBeta( this.maxDepth, -20000, 20000 );

	if( this.curPosition[ this.bestMove[0].y ][ this.bestMove[0].x ] !== CONFIG.NOCHESS ) {
		if( score < 0 ){
			alert( 'You win!' );
		}else{
			alert( 'You loss!' );
		}
	}

	this.makeMove( this.bestMove, 0, nType );
	nPosition = this.setPoistion( this.curPosition );

	return {
		grid : nPosition,
		x : this.bestMove[0].x,
		y : this.bestMove[0].y,
		type : nType
	};

};

SearchEngine.prototype.setSearchDepth = function( ) { };

SearchEngine.prototype.falphaBeta = function( nDepth, nAlpha, nBeta ) {
	var current = -20000,
		score,count,i,type;


	if( nDepth > 0 ) {
		i = this.isGameOver( this.curPosition, nDepth );
		if( i != 0 ) {
			return i;
		}
	}
	
	if( nDepth <= 0 ) {
		var xx = this.eveluation.eveluate( this.curPosition, ( this.maxDepth - nDepth ) % 2 );
		console.log('resultScore:'+xx);
		return xx;
	}

	count = this.moveGenerator.createPossibleMove( this.curPosition, nDepth );

	if( (this.maxDepth - nDepth ) % 2 === 0 ) {
		type = CONFIG.WHITE;
	}else{
		type = CONFIG.BLACK;
	}

	for( i = 0; i < count; i ++ ) {
		this.makeMove( this.moveGenerator.movelist[ nDepth ][ i ], i, type );

		score = - ( this.falphaBeta( nDepth - 1, -nBeta, -nAlpha ) );
		//score = this.falphaBeta( nDepth - 1, nAlpha, nBeta );
		this.unMakeMove( this.moveGenerator.movelist[ nDepth ][ i ], i );

		if( score > nAlpha ) {
			nAlpha = score;
			if( nDepth === this.maxDepth ) {
				this.bestMove = this.moveGenerator.movelist[ nDepth ][ i ];
			}

			// if( score >= nAlpha ) {
			// 	nAlpha = score;
			// }

			if( nAlpha >= nBeta ) {
				break;
			}
		}
	}

	return nAlpha;
};

SearchEngine.prototype.makeMove = function( move, index, type ) {
	this.curPosition[ move[index].y ][ move[index].x ] = type;
};

SearchEngine.prototype.unMakeMove = function( move, index ) {
	this.curPosition[ move[index].y ][ move[index].x ] = CONFIG.NOCHESS;
};

SearchEngine.prototype.isGameOver = function( nPosition, nDepth ) {
	var score = 0, i = 0, nextChessType = CONFIG.WHITE;

	i = ( this.maxDepth - nDepth ) % 2;

	//偶数：人／黑，奇数：机／白
	//nextChessType = i ? CONFIG.WHITE : CONFIG.BLACK; 

	score = this.eveluation.eveluate( nPosition, i );

	if( Math.abs( score ) > 8000 ) {
		return score;
	}

	return 0;
};