const CHESS_MATCH = {
  chessField: require('./chess-field.png'),
  pieces:{
    black: {
      pawn: require('./chess-pieces/black-pawn.svg').default,
      bishop: require('./chess-pieces/black-bishop.svg').default,
      knight: require('./chess-pieces/black-knight.svg').default,
      rook: require('./chess-pieces/black-rook.svg').default,
      queen: require('./chess-pieces/black-queen.svg').default,
      king: require('./chess-pieces/black-king.svg').default
    },
    white: {
      pawn: require('./chess-pieces/white-pawn.svg').default,
      bishop: require('./chess-pieces/white-bishop.svg').default,
      knight: require('./chess-pieces/white-knight.svg').default,
      rook: require('./chess-pieces/white-rook.svg').default,
      queen: require('./chess-pieces/white-queen.svg').default,
      king: require('./chess-pieces/white-king.svg').default
    }
  }
}

export default CHESS_MATCH;