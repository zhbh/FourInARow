function Eveluation() {}

Eveluation.prototype.eveluate = function( nPosition, bIsWhiteTurn ) {

	//偶数：人／黑，奇数：机／白
	if( bIsWhiteTurn === 0 ) {
		bIsWhiteTurn = false;
	}else{
		bIsWhiteTurn = true;
	}

	COUNT ++;

	this.lineRecord = this.initArrayValueFn( 20, SCORE.TOBEANALSIS );

	function generateTypeRecordArr( ) {
		var typeRecordArr = [];

		for( var i = 0; i < CONFIG.BOARD_HEIGHT; i ++ ) {
			typeRecordArr[i] = [];
			for ( var j = 0; j < CONFIG.BOARD_WIDTH; j ++ ) {
				typeRecordArr[i][j] = [];
				for (var k = 0; k < 4; k ++ ) {
					typeRecordArr[i][j][k] = SCORE.TOBEANALSIS;
				}
			}
		}

		return typeRecordArr;
	}

	function generateTypeCountArr( ) {
		var typeCountArr = [];

		for( var i = 0; i < 2; i ++ ) {
			typeCountArr[i] = [];
			for ( var j = 0; j < 20; j ++ ) {
				typeCountArr[i][j] = SCORE.TOBEANALSIS;
			}
		}

		return typeCountArr;

	}


	this.typeRecord = generateTypeRecordArr( );

	this.typeCount = generateTypeCountArr( );

	var i = CONFIG.BOARD_HEIGHT,
		j = CONFIG.BOARD_WIDTH,
		k = 0;

	//对棋子四个方向进行分析：4连、3连、2连情况分析
	for( i = i - 1; i >= 0; i -- ){
		for ( j = j - 1; j >= 0; j -- ) {
			if( nPosition[ i ][ j ] !== CONFIG.NOCHESS ) {
				if( this.typeRecord[ i ][ j ][ 0 ] === SCORE.TOBEANALSIS ) {
					this.analysisHorizon( nPosition, i, j );
				}

				if( this.typeRecord[ i ][ j ][ 1 ] === SCORE.TOBEANALSIS ) {
					this.analysisVertical( nPosition, i, j );
				}

				if( this.typeRecord[ i ][ j ][ 2 ] === SCORE.TOBEANALSIS ) {
					this.analysisLeft( nPosition, i, j );
				}

				if( this.typeRecord[ i ][ j ][ 3 ] === SCORE.TOBEANALSIS ) {
					this.analysisRight( nPosition, i, j );
				}

			}	
		}
	}

	var nChessType = 0;

	//对上面棋子的情况进行统计
	for( i = CONFIG.BOARD_HEIGHT - 1; i >= 0; i -- ) {
		for( j = CONFIG.BOARD_WIDTH - 1; j >= 0; j -- ) {
			for( ; k < 4; k ++ ) {
				nChessType = nPosition[ i ][ j ];
				if( nChessType !== CONFIG.NOCHESS ) {
					switch( this.typeRecord[ i ][ j ][ k ]) {
						// case SCORE.LIVE5:
						// 	this.typeCount[ nChessType - 1][ SCORE.LIVE5 ] ++;
						// break;
						case SCORE.LIVE4:
							this.typeCount[ nChessType - 1 ][ SCORE.LIVE4 ] ++;
						break;
						case SCORE.LIVE3:
							this.typeCount[ nChessType - 1 ][ SCORE.LIVE3 ] ++;
						break;
						case SCORE.LIVE2:
							this.typeCount[ nChessType - 1 ][ SCORE.LIVE2 ] ++;
						break;
						case SCORE.SLEEP4:
							this.typeCount[ nChessType - 1 ][ SCORE.SLEEP4 ] ++;
						break;
						case SCORE.SLEEP3:
							this.typeCount[ nChessType - 1 ][ SCORE.SLEEP3 ] ++;
						break;
						case SCORE.SLEEP2:
							this.typeCount[ nChessType - 1 ][ SCORE.SLEEP2 ] ++;
						break;
						default:
						break;

					}
				} 
			}
		}
	}

	//4连，返回极值
	if( bIsWhiteTurn ) {
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE4 ] ) {
			return -9999;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE4 ] ) {
			return 9999;
		}

	}else{
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE4 ] ) {
			return 9999;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE4 ] ) {
			return -9999;
		}

	}

	//两个冲3等于一个活3
	if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP3 ] > 1 ) {
		this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE3 ] ++;
	}

	if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP3 ] > 1 ) {
		this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE3 ] ++;
	}

	var whiteValue = 0, blackValue = 0;

	//轮到白棋
	if( bIsWhiteTurn ) {
		//活3，白棋
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE3 ] ) {
			return 9990;
		}
		//冲3，白棋
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP3 ] ) {
			return 9980;
		}

		//活3，黑棋
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE3 ] ) {
			return -9970;
		}

		//黑棋有冲3，活2
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP3 ] && this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] ) {
			return -9960;
		}

		//白棋有活2，黑棋没有冲3
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] && this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP3 ] === 0 ) {
			return 9950;
		}

		//黑棋活2多于1个，白棋没有冲3，活2，冲2
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] > 1 && this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP3 ] === 0 && this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] === 0 && this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP2 ] === 0 ) {
			return -9940;
		}

		//白棋活2多于1个
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] > 1 ) {
			whiteValue += 2000;
		}else if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] ){
			//白棋活2
			whiteValue += 200;
		}

		//黑棋活2多于1个
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] > 1 ) {
			blackValue += 500;
		}else if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] ) {
			//黑棋活2
			blackValue += 200;
		}

		//白棋每个冲2加10
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP2 ] ) {
			whiteValue += this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP2 ] * 10;
		}
		//黑棋每个冲2加10
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP2 ] ) {
			whiteValue += this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP2 ] * 10;
		}

	}else{
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE3 ] ) {
			return 9990;
		}
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP3 ] ) {
			return 9980;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE3 ] ) {
			return -9970;
		}
		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP3 ] && this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] ) {
			return -9960;
		}
		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] && this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP3 ] === 0 ) {
			return 9950;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] > 1 && this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP3 ] === 0 && this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] === 0 && this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP2 ] === 0 ) {
			return -9940;
		}

		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] > 1 ) {
			blackValue += 2000;
		}else if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.LIVE2 ] ){
			blackValue += 200;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] > 1 ) {
			whiteValue += 500;
		}else if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.LIVE2 ] ) {
			whiteValue += 200;
		}

		if( this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP2 ] ) {
			blackValue += this.typeCount[ CONFIG.BLACK - 1 ][ SCORE.SLEEP2 ] * 10;
		}

		if( this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP2 ] ) {
			blackValue += this.typeCount[ CONFIG.WHITE - 1 ][ SCORE.SLEEP2 ] * 10;
		}

	}


	for( i = CONFIG.BOARD_HEIGHT - 1; i >= 0; i -- ) {
		for( j = CONFIG.BOARD_WIDTH - 1; j >= 0; j -- ) {
			nChessType = nPosition[ i ][ j ];
			if( nChessType !== CONFIG.NOCHESS ) {
				if( nChessType === CONFIG.BLACK ) {
					blackValue += PositionValueArr[i][j];
				}else{
					whiteValue += PositionValueArr[i][j];
				}
			}
		}
	}

	if( !bIsWhiteTurn ) {
		return blackValue - whiteValue;
	}else{
		return whiteValue - blackValue;
	}
}

Eveluation.prototype.initArrayValueFn = function( nLenght, nValue ) {
	var i = 0, 
		lineRecordArr = [];

	for( ; i < nLenght; i ++ ) {
		lineRecordArr[ i ] = nValue;
	}

	return lineRecordArr;
}


Eveluation.prototype.analysisHorizon = function( nPosition, i, j ) {
	var s = 0;

	this.analysisLine( nPosition[i], CONFIG.BOARD_WIDTH, j );
	for( ; s < CONFIG.BOARD_WIDTH; s ++ ) {
		if ( this.lineRecord[ s ] !== SCORE.TOBEANALSIS ) {
			this.typeRecord[ i ][ s ][ 0 ] = this.lineRecord[ s ];
		}
	}

	return this.typeRecord[ i ][ j ][ 0 ];

};

Eveluation.prototype.analysisVertical = function( nPosition, i, j ) {
	var tempArray = [];
	for( var k = 0; k < CONFIG.BOARD_HEIGHT; k ++ ) {
		tempArray[ k ] = nPosition[ k ][ j ];
	}

	this.analysisLine( tempArray, CONFIG.BOARD_HEIGHT, i );

	for( var s = 0; s < CONFIG.BOARD_HEIGHT; s ++ ) {
		if( this.lineRecord[ s ] !== SCORE.TOBEANALSIS ) {
			this.typeRecord[ s ][ j ][ 1 ] = this.lineRecord[ s ];
		}
	}

	return this.typeRecord[ i ][ j ][ 1 ];
};

Eveluation.prototype.analysisLeft = function( nPosition, i, j ) {
	var tempArray = [],
		x, y;

	if( i < j ) {
		y = 0;
		x = j - i;
	}else{
		x = 0;
		y = i - j;
	}

	for( var k = 0; k < CONFIG.BOARD_HEIGHT; k ++ ) {
		if( x + k > 5 || y + k > 5 ) {
			break;
		}

		tempArray[ k ] = nPosition[ y + k ][ x + k ];
	}

	this.analysisLine( tempArray, tempArray.length, j - x  );

	for( var s = 0; s < tempArray.length; s ++ ) {
		if( this.lineRecord[ s ] !== SCORE.TOBEANALSIS ) {
			this.typeRecord[ y + s ][ x + s ][ 2 ] = this.lineRecord[ s ];
		}
	}

	return this.typeRecord[ i ][ j ][ 2 ];

};

Eveluation.prototype.analysisRight = function( nPosition, i, j ) {
	var tempArray = [],
		x, y, realNum;

	if( 5 - i < j ) {
		y = 5;
		x = j - 5 + i;
		realNum = 5 - i;
	}else{
		x = 0;
		y = i + j;
		realNum = j;
	}

	for( var k = 0; k < CONFIG.BOARD_HEIGHT; k ++ ) {
		if( x + k > 5 || y - k < 0 ) {
			break;
		} 
		tempArray[ k ] = nPosition[ y - k ][ x + k ];
	}

	this.analysisLine( tempArray, tempArray.length, j - x );

	for( var s = 0; s < tempArray.length; s ++ ) {
		if( this.lineRecord[ s ] !== SCORE.TOBEANALSIS ) {
			this.typeRecord[ y - s ][ x + s ][ 3 ] = this.lineRecord[ s ];
		}
	}

	return this.typeRecord[ i ][ j ][ 3 ];

};

Eveluation.prototype.analysisLine = function( nPosition, nBoardNum, nChessPos ) {

	var chessType, 
		analyLine = [],
		nAnalyPos,
		leftEdge,
		rightEdge,
		leftRange,
		rightRange;

	if( nBoardNum < 4 ) {
		this.lineRecord = this.initArrayValueFn( nBoardNum, SCORE.ANALSISED );
		return 0;
	}

	nAnalyPos = nChessPos;
	this.lineRecord = this.initArrayValueFn( 30, SCORE.TOBEANALSIS );
	analyLine = this.initArrayValueFn( 30, 0 );

	for( var i = 0; i < nBoardNum; i ++ ) {
		analyLine[ i ] = nPosition[ i ];
	}

	nBoardNum --;

	chessType = analyLine[ nChessPos ];

	leftEdge = nChessPos;
	rightEdge = nChessPos;

	while( leftEdge > 0 ) {
		if( analyLine[ leftEdge - 1 ] !== chessType ) {
			break;
		}

		leftEdge --;
	}

	while( rightEdge < nBoardNum ) {
		if( analyLine[ rightEdge + 1 ] !== chessType ) {
			break;
		}

		rightEdge ++;
	}

	leftRange = leftEdge;
	rightRange = rightEdge;


	var anotherType; 
	if( chessType === CONFIG.WHITE ) {
		anotherType = CONFIG.BLACK;
	}else{
		anotherType = CONFIG.WHITE;
	}

	while( leftRange > 0 ) {
		if( analyLine[ leftRange - 1 ] == anotherType ) {
			break;
		}

		leftRange --;
	}

	while( rightRange < nBoardNum ) {
		if( analyLine[ rightRange - 1 ] == anotherType ) {
			break;
		}

		rightRange ++;
	}

	//x000x、x00x、x0x情况，不用分析
	if( rightRange - leftRange < 3 ) {
		for( var i = leftRange; i <= rightRange; i ++ ) {
			this.lineRecord[i] = SCORE.ANALSISED;
		}

		return false;
	}

	for( var i = leftEdge; i <= rightEdge; i ++ ) {
		this.lineRecord[i] = SCORE.ANALSISED;
	}

	//_000_、_000x、x000_情况（上面已经排除两边x情况）
	//返回4连
	if( rightEdge - leftEdge > 2 ) {
		this.lineRecord[nChessPos] = SCORE.LIVE4;
		return SCORE.LIVE4;
	}

	//3连分析
	if( rightEdge - leftEdge === 2 ) {
		var leftThree = false;
		//_000情况
		if( leftEdge > 0 ) {
			if( analyLine[ leftEdge - 1 ] === CONFIG.NOCHESS ) {
				leftThree = true;
			}
		}

		if( rightEdge < nBoardNum ) {
			if( analyLine[ rightEdge + 1 ] === CONFIG.NOCHESS ) {
				//_000_情况
				if( leftThree ) {
					this.lineRecord[nChessPos] = SCORE.LIVE3;
				}else{
					//x000_、|000_情况
					this.lineRecord[nChessPos] = SCORE.SLEEP3;
				}
			}else{
				//_000x情况
				if( leftThree ) {
					this.lineRecord[nChessPos] = SCORE.SLEEP3;
				}
			}
		}else{
			//_000|情况
			if( leftThree ) {
				this.lineRecord[nChessPos] = SCORE.SLEEP3;
			}
		}

		return this.lineRecord[nChessPos];
	}

	//2连棋子水平分析
	if( rightEdge - leftEdge === 1 ) { 
		var leftTwo = false;
		if( leftEdge > 1 ) {
			if( analyLine[ leftEdge - 1 ] === CONFIG.NOCHESS ) {
				//0_00情况
				if( leftEdge > 1 && analyLine[ leftEdge - 2 ] === analyLine[ leftEdge ] ) {
					this.lineRecord[ leftEdge ] = SCORE.SLEEP3;
					this.lineRecord[ leftEdge - 2 ] = SCORE.ANALSISED;
				}else{
					leftTwo = true;
				}
			} 

		}

		if( rightEdge < nBoardNum ) {
			if( analyLine[ rightEdge + 1 ] === CONFIG.NOCHESS ) {
				//00_0情况
				if( rightEdge < nBoardNum - 1 && analyLine[ rightEdge + 2 ] === analyLine[ rightEdge ] ) {
					this.lineRecord[ rightEdge ] = SCORE.SLEEP3;
					this.lineRecord[ rightEdge + 2 ] = SCORE.ANALSISED;
				}else{
					//?_00_?情况
					if( leftTwo ) {
						this.lineRecord[ rightEdge ] = SCORE.LIVE2;
					}else{
						//?00_情况
						this.lineRecord[ rightEdge ] = SCORE.SLEEP2;
					}
				}
			}else{
				if( this.lineRecord[ leftEdge ] === SCORE.SLEEP3 ) {
					return this.lineRecord[ leftEdge ];
				}
				//_00?情况
				if( leftTwo ) {
					this.lineRecord[ nAnalyPos ] = SCORE.SLEEP2;
				}
			}
		}else{
			if( this.lineRecord[ leftEdge ] === SCORE.SLEEP3 ) {
				return this.lineRecord[ leftEdge ];
			}
			if( leftTwo ) {
				this.lineRecord[ nAnalyPos ] = SCORE.SLEEP2;
			}

		}

		return this.lineRecord[ nAnalyPos ];
	}

	return 0;
};


