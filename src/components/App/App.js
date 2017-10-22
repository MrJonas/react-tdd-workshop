import React from 'react';
import Board from '../Board';
import './App.scss';

export const getGameStatus = board => {
    const isGameWon = player =>
    board[0].every(cell => cell === player) ||
    board[1].every(cell => cell === player) ||
    board[2].every(cell => cell === player) ||
    board.every(row => row[0] === player) ||
    board.every(row => row[1] === player) ||
    board.every(row => row[2] === player) ||
    board.every((row, i) => row[i] === player) ||
    board.every((row, i) => row[2 - i] === player);

    return isGameWon('X') || isGameWon('O');
};


export const isGameEnded = board => {
    return getGameStatus(board) || board.every(cell => cell.every(square => square !== ''));
};


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            board: [['', '', ''], ['', '', ''], ['', '', '']],
            gameEnded: false,
            winner: '',
            nextPlayer: 'X'
        };
    }

    save() {
        fetch('/api/game', {
            method: 'POST',
            body: JSON.stringify({board: this.state.board}),
            headers: {'Content-Type': 'application/json'}
        });
    }

    async load() {
        const response = await fetch('/api/game');
        const {board} = await response.json();
        this.setState({board});
    }

    handleGameChange(rowI, cellI) {
        if (this.state.gameEnded) return;
        const board = [...this.state.board];
        const nextPlayer = this.state.nextPlayer;
        if (!board[rowI][cellI]) {
            board[rowI][cellI] = nextPlayer;
            const newNextPlayer = nextPlayer === 'X' ? 'O' : 'X';
            this.setState({board, nextPlayer: newNextPlayer});
        }
        if (isGameEnded(board)) {
            this.setState({gameEnded: true});
        }
        if (getGameStatus(board) && !this.state.gameEnded) {
            this.setState({winner: nextPlayer});
        }
        this.setState({board});
    }

    render() {
        return (
            <div data-hook="app" className="root">
                <div data-hook="next-player">{`${this.state.nextPlayer} goes next!`}</div>
                <Board
                    board={this.state.board}
                    onGameChanged={(rowIndex, cellIndex) => this.handleGameChange(rowIndex, cellIndex)}
                />
                {this.state.winner &&
                <div data-hook="winner-message" className="winner-message">{`${this.state.winner} Wins!`}</div>}
                {this.state.gameEnded && !this.state.winner &&
                <div data-hook="tie-message" className="winner-message">{`It's a tie!`}</div>}
                <div>
                    <button onClick={() => this.save()} data-hook="save">Save</button>
                    <button onClick={() => this.load()} data-hook="load">Load</button>
                </div>
            </div>
        );
    }
}

export default App;
