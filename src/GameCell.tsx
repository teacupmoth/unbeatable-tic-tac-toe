import { CellIdentifier } from './game';

export default function GameCell({
  cellId,
  player,
  onClick = (cellId: CellIdentifier) => {},
}: {
  cellId: CellIdentifier;
  player: string;
  onClick?: (cellId: CellIdentifier) => void;
}) {
  return (
    <div className="GameCell" onClick={() => onClick(cellId)}>
      <span>{player}</span>
    </div>
  );
}
