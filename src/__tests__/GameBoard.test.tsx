import { render, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';

describe('GameBoard', () => {
  it('renders player token when a cell clicked', () => {
    const { container } = render(<GameBoard />);
    const cell = container.querySelector('.GameCell')!;
    fireEvent.click(cell);
    expect(cell.textContent).toBe('X');
  });
});
