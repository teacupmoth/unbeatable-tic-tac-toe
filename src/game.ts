import produce from 'immer';

export type CellIdentifier = [number, number];
export type BoardState = string[][];

/**
 * Returns an empty board state.
 */
export function emptyBoardState(): BoardState {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
}

/**
 * Returns an updated board state derived from given cell id
 * and player token.
 */
export function updatedBoardState(
  boardState: BoardState,
  cellId: CellIdentifier,
  player: string
): BoardState {
  return produce(boardState, (draft) => {
    draft[cellId[0]][cellId[1]] = player;
  });
}

/**
 * Given a board state and cellId, determine if a move played there
 * is valid.
 */
export function isValidMove(boardState: BoardState, cellId: CellIdentifier) {
  return boardState[cellId[0]][cellId[1]] === '';
}

/**
 * Returns the number of remaining possible moves for a board state.
 */
export function numPossibleMoves(boardState: BoardState) {
  return boardState.flat().reduce((sum, cell) => {
    if (cell === '') {
      return sum + 1;
    }

    return sum;
  }, 0);
}

/**
 * Check if this board state is has a win condition and return the winning
 * token, 'DRAW', or null for no win.
 */
export function checkWinner(boardState: BoardState): string | null {
  let winner = null;

  // Check for horizontal wins
  for (let i = 0; i < 3; i++) {
    if (
      boardState[i][0] !== '' &&
      boardState[i][0] === boardState[i][1] &&
      boardState[i][1] === boardState[i][2]
    ) {
      winner = boardState[i][0];
    }
  }

  // Check for veritical wins
  for (let i = 0; i < 3; i++) {
    if (
      boardState[0][i] !== '' &&
      boardState[0][i] === boardState[1][i] &&
      boardState[1][i] === boardState[2][i]
    ) {
      winner = boardState[0][i];
    }
  }

  // Check for diagonal wins
  if (
    boardState[0][0] !== '' &&
    boardState[0][0] === boardState[1][1] &&
    boardState[1][1] === boardState[2][2]
  ) {
    winner = boardState[0][0];
  }

  if (
    boardState[2][0] !== '' &&
    boardState[2][0] === boardState[1][1] &&
    boardState[1][1] === boardState[0][2]
  ) {
    winner = boardState[2][0];
  }

  if (winner !== null) return winner;

  // If we have no winner, there could be a draw.
  if (numPossibleMoves(boardState) === 0) {
    return 'DRAW';
  }

  return winner;
}

/**
 * Given a board state and player token, return an array of possible
 * child board states.
 */
export function possibleChildBoardStates(
  boardState: BoardState,
  player: string
) {
  const states = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (isValidMove(boardState, [i, j])) {
        states.push(updatedBoardState(boardState, [i, j], player));
      }
    }
  }

  return states;
}

/**
 * The algorithm that powers the unbeatable AI. Minimax is a game theory
 * concept, in which one player, our AI, attempts to maximize its chance
 * of winning, while assuming the player is minimizing the AI's
 * chance of winning. This works well because tic-tac-toe is as solved game,
 * which means two players playing optimally will always end the game in a
 * draw. Because the search space of tic-tac-toe is not very large, we
 * can recursively test every game outcome without too much performance
 * loss. In a more complex game, like chess, you would need some way
 * to prune branches because the search space is impossibly large.
 *
 * https://www.youtube.com/watch?v=l-hh51ncgDI
 *
 * This function will recursively find the maximizing outcome if isMax is
 * true (either a win or a draw), otherwise it will find the minimizing score
 * (either a loss or a draw).
 */
export function minimax(
  boardState: BoardState,
  isMax: boolean,
  depth: number = 0
): number {
  const winner = checkWinner(boardState);

  if (winner !== null) {
    switch (winner) {
      case 'O':
        return 10 - depth;
      case 'X':
        return depth - 10;
      default:
        return 0;
    }
  }

  if (isMax) {
    const possibleMoves = possibleChildBoardStates(boardState, 'O');

    return possibleMoves.reduce((best, possibleMove) => {
      return Math.max(minimax(possibleMove, false, depth + 1), best);
    }, -Infinity);
  } else {
    const possibleMoves = possibleChildBoardStates(boardState, 'X');

    return possibleMoves.reduce((best, possibleMove) => {
      return Math.min(minimax(possibleMove, true, depth + 1), best);
    }, Infinity);
  }
}

/**
 * Use the minmax algorithm to find the best available move for the AI given a
 * board state, and then return that board state
 */
export function chooseMoveWithMinimax(boardState: BoardState): BoardState {
  let best = -Infinity;
  let chosenMove: BoardState = boardState;

  const possibleMoves = possibleChildBoardStates(boardState, 'O');

  possibleMoves.forEach((possibleMove) => {
    const score = minimax(possibleMove, false);

    if (score > best) {
      best = score;
      chosenMove = possibleMove;
    }
  });

  return chosenMove;
}
