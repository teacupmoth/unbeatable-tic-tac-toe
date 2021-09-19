import {
  emptyBoardState,
  numPossibleMoves,
  isValidMove,
  updatedBoardState,
  checkWinner,
  possibleChildBoardStates,
  minimax,
  chooseMoveWithMinimax,
} from '../game';

describe('game', () => {
  describe('emptyBoardState()', () => {
    it('returns an empty board state', () => {
      expect(emptyBoardState()).toMatchInlineSnapshot(`
        Array [
          Array [
            "",
            "",
            "",
          ],
          Array [
            "",
            "",
            "",
          ],
          Array [
            "",
            "",
            "",
          ],
        ]
      `);
    });
  });

  describe('updatedBoardState()', () => {
    it('returns a new board state with passed token at the passed cell id', () => {
      const givenEmptyBoardState = emptyBoardState();

      const result = updatedBoardState(givenEmptyBoardState, [0, 0], 'X');

      expect(result).toMatchInlineSnapshot(`
        Array [
          Array [
            "X",
            "",
            "",
          ],
          Array [
            "",
            "",
            "",
          ],
          Array [
            "",
            "",
            "",
          ],
        ]
      `);
    });
  });

  describe('isValidMove()', () => {
    const givenBoardState = [
      ['X', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    it('returns true if move is valid', () => {
      expect(isValidMove(givenBoardState, [0, 1])).toBe(true);
    });

    it('returns false if move is invalid', () => {
      expect(isValidMove(givenBoardState, [0, 0])).toBe(false);
    });
  });

  describe('getNumPossibleMoves()', () => {
    it('returns the amount of moves remaining', () => {
      const givenBoardState = [
        ['X', 'O', ''],
        ['O', 'X', ''],
        ['X', '', ''],
      ];

      expect(numPossibleMoves(givenBoardState)).toBe(4);
    });
  });

  describe('checkWinner()', () => {
    it('properly validates board states', () => {
      const givenHorizontalWinBoardState = [
        ['O', 'O', 'O'],
        ['X', 'X', ''],
        ['', '', ''],
      ];

      const givenVeritcalWinBoardState = [
        ['X', 'O', ''],
        ['X', 'O', ''],
        ['X', '', ''],
      ];

      const givenDiagonalWinBoardState = [
        ['X', 'O', 'X'],
        ['O', 'X', ''],
        ['O', '', 'X'],
      ];

      const givenReverseDiagonalWinBoardState = [
        ['X', 'O', 'O'],
        ['X', 'O', ''],
        ['O', 'X', ''],
      ];

      const givenDrawnBoardState = [
        ['X', 'O', 'X'],
        ['O', 'X', 'X'],
        ['O', 'X', 'O'],
      ];

      const givenUnfinishedBoardState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];

      expect(checkWinner(givenHorizontalWinBoardState)).toBe('O');
      expect(checkWinner(givenVeritcalWinBoardState)).toBe('X');
      expect(checkWinner(givenDiagonalWinBoardState)).toBe('X');
      expect(checkWinner(givenReverseDiagonalWinBoardState)).toBe('O');
      expect(checkWinner(givenDrawnBoardState)).toBe('DRAW');
      expect(checkWinner(givenUnfinishedBoardState)).toBe(null);
    });
  });

  describe('possibleChildBoardStates()', () => {
    it('returns expected states from a known state', () => {
      const givenBoardState = [
        ['O', 'O', 'X'],
        ['X', 'X', 'O'],
        ['', 'X', ''],
      ];

      const expected = [
        [
          ['O', 'O', 'X'],
          ['X', 'X', 'O'],
          ['O', 'X', ''],
        ],
        [
          ['O', 'O', 'X'],
          ['X', 'X', 'O'],
          ['', 'X', 'O'],
        ],
      ];

      expect(possibleChildBoardStates(givenBoardState, 'O')).toStrictEqual(
        expected
      );
    });
  });

  describe('minimax()', () => {
    it('returns the correct score given a finished game state', () => {
      const givenXWinsBoardState = [
        ['X', '', ''],
        ['O', 'X', ''],
        ['O', '', 'X'],
      ];

      const givenOWinsBoardState = [
        ['O', 'X', ''],
        ['O', 'X', ''],
        ['O', '', ''],
      ];

      const givenDrawnBoardState = [
        ['O', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'X', 'X'],
      ];

      expect(minimax(givenXWinsBoardState, true)).toBe(-10);
      expect(minimax(givenOWinsBoardState, true)).toBe(10);
      expect(minimax(givenDrawnBoardState, true)).toBe(0);
    });

    it('returns winning score when board not in end state, but O will win this turn', () => {
      const givenBoardState = [
        ['', '', ''],
        ['O', '', 'X'],
        ['O', 'X', 'X'],
      ];

      expect(minimax(givenBoardState, true)).toBeGreaterThan(0);
    });

    it('returns losing score when board not in end state, but X will win this turn', () => {
      const givenBoardState = [
        ['', '', ''],
        ['X', '', 'O'],
        ['X', 'O', 'O'],
      ];

      expect(minimax(givenBoardState, false)).toBeLessThan(0);
    });

    it('returns draw score when board not in end state, but the only available move is a draw', () => {
      const givenBoardState = [
        ['O', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'X', ''],
      ];

      expect(minimax(givenBoardState, true)).toBe(0);
    });
  });

  describe('chooseMoveWithMinimax()', () => {
    it('chooses the optimal move by blocking X', () => {
      const givenBoardState = [
        ['', '', 'X'],
        ['', 'X', 'O'],
        ['', '', ''],
      ];

      expect(chooseMoveWithMinimax(givenBoardState)[2][0]).toEqual('O');
    });
  });
});
