import { useEffect, useState } from 'react';
import {
  emptyBoardState,
  CellIdentifier,
  updatedBoardState,
  isValidMove,
  checkWinner,
  chooseMoveWithMinimax,
} from './game';
import GameCell from './GameCell';

export default function GameBoard() {
  const [currentBoardState, setCurrentBoardState] = useState(emptyBoardState());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [timesDrawn, setTimesDrawn] = useState(0);

  function makeAiMove() {
    const newBoardState = chooseMoveWithMinimax(currentBoardState);

    setCurrentBoardState(newBoardState);

    const winner = checkWinner(newBoardState);

    if (winner) {
      if (winner === 'DRAW') {
        setTimesDrawn(timesDrawn + 1);
      }

      setWinner(winner);
    } else {
      setCurrentPlayer('X');
    }
  }

  useEffect(() => {
    if (currentPlayer === 'O' && !winner) makeAiMove();
  });

  function handleCellClick(cellId: CellIdentifier) {
    if (
      currentPlayer === 'X' &&
      !winner &&
      isValidMove(currentBoardState, cellId)
    ) {
      const newBoardState = updatedBoardState(currentBoardState, cellId, 'X');

      setCurrentBoardState(newBoardState);
      const winner = checkWinner(newBoardState);

      if (winner) {
        if (winner === 'DRAW') {
          setTimesDrawn(timesDrawn + 1);
        }

        setWinner(winner);
      } else {
        setCurrentPlayer('O');
      }
    }
  }

  function handleReset() {
    setCurrentBoardState(emptyBoardState());
    setCurrentPlayer('X');
    setWinner(null);
  }

  return (
    <div className="GameTable">
      <h1>Unbeatable Tic-Tac-Toe</h1>
      <div className="GameBoard">
        <GameCell
          cellId={[0, 0]}
          player={currentBoardState[0][0]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[0, 1]}
          player={currentBoardState[0][1]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[0, 2]}
          player={currentBoardState[0][2]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[1, 0]}
          player={currentBoardState[1][0]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[1, 1]}
          player={currentBoardState[1][1]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[1, 2]}
          player={currentBoardState[1][2]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[2, 0]}
          player={currentBoardState[2][0]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[2, 1]}
          player={currentBoardState[2][1]}
          onClick={handleCellClick}
        />
        <GameCell
          cellId={[2, 2]}
          player={currentBoardState[2][2]}
          onClick={handleCellClick}
        />
      </div>
      {winner && (
        <>
          <h2>
            {winner === 'DRAW'
              ? timesDrawn >= 3
                ? 'A strange game. The only winning move is not to play.'
                : 'Draw!'
              : `The winner is ${winner}!`}
          </h2>
          <button onClick={handleReset}>Reset Game</button>
        </>
      )}
    </div>
  );
}
