import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import App, {getGameStatus, isGameEnded} from './App';

let wrapper;
const render = element => mount(
    element, {attachTo: document.createElement('div')}
);
const clickACellAt = index => wrapper.find('[data-hook="cell"]')
    .at(index).simulate('click');
const getCellTextAt = index => wrapper.find('[data-hook="cell"]')
    .at(index).text();
const getWinnerMessage = () => wrapper.find('[data-hook="winner-message"]').text();
const getTieMessage = () => wrapper.find('[data-hook="tie-message"]').text();
const getNextPlayer = () => wrapper.find('[data-hook="next-player"]').text();

describe('App', () => {

    afterEach(() => wrapper.detach());

    it('should have "O" after second user plays', () => {
        wrapper = render(<App/>);

        clickACellAt(0);
        clickACellAt(1);
        expect(getCellTextAt(1)).to.equal('O');
    });

    it('player "O" should win the game', () => {
        wrapper = render(<App/>);
        clickACellAt(4);
        clickACellAt(0);
        clickACellAt(5);
        clickACellAt(1);
        clickACellAt(7);
        clickACellAt(2);
        expect(getWinnerMessage()).to.equal('O Wins!');
    });

    it('Game should end in tie', () => {
        wrapper = render(<App/>);

    });

    it('player cannot press not empty cell', () => {
        wrapper = render(<App/>);
        clickACellAt(0);
        clickACellAt(0);
        expect(getCellTextAt(0)).to.equal('X');
    });

    it('Game should end after player win', () => {
        wrapper = render(<App/>);
        clickACellAt(4);
        clickACellAt(0);
        clickACellAt(5);
        clickACellAt(1);
        clickACellAt(7);
        clickACellAt(2);
        expect(getWinnerMessage()).to.equal('O Wins!');

        clickACellAt(2);
        expect(getWinnerMessage()).to.equal('O Wins!');
    });

    it('Board should not change after game end', () => {
        wrapper = render(<App/>);
        clickACellAt(4);
        clickACellAt(0);
        clickACellAt(5);
        clickACellAt(1);
        clickACellAt(7);
        clickACellAt(2);

        clickACellAt(3);
        expect(getCellTextAt(3)).to.equal('');
    });
});

const board1 = [['X', 'X', ''], ['', 'X', '0'], ['', 'X', 'X']];
describe('getGameStatus', () => {
    it('X should win the game', () => {
        const board = [
            ['X', 'X', 'X'],
            ['', '', ''],
            ['', '', '']
        ];
        expect(getGameStatus(board)).to.equal(true);
    });

    it('Should win for any row', () => {
        const board1 = [['X', 'X', 'X'], ['', '', ''], ['', '', '']];
        expect(getGameStatus(board1)).to.equal(true);
        const board2 = [['', '', ''], ['X', 'X', 'X'], ['', '', '']];
        expect(getGameStatus(board2)).to.equal(true);
        const board3 = [['', '', ''], ['', '', ''], ['X', 'X', 'X']];
        expect(getGameStatus(board3)).to.equal(true);
    });

    it('Should win for any column', () => {
        const board1 = [['X', '', ''], ['X', '', ''], ['X', '', '']];
        expect(getGameStatus(board1)).to.equal(true);
        const board2 = [['', 'X', ''], ['', 'X', ''], ['', 'X', '']];
        expect(getGameStatus(board2)).to.equal(true);
        const board3 = [['', '', 'X'], ['', '', 'X'], ['', '', 'X']];
        expect(getGameStatus(board3)).to.equal(true);
    });

    it('Should win for diagonals', () => {
        const board1 = [['X', 'X', ''], ['', 'X', '0'], ['', 'X', 'X']];
        expect(getGameStatus(board1)).to.equal(true);
        const board2 = [['', '', 'X'], ['', 'X', ''], ['X', '', '']];
        expect(getGameStatus(board2)).to.equal(true);
    });

    it('Should game ended should return true for when board filled', () => {
        const board = [['X', 'X', 'O'], ['O', 'X', 'O'], ['X', 'X', 'X']];
        expect(isGameEnded(board)).to.equal(true);
    });


    it('Game should end when there is winner', () => {
        const board = [['X', 'X', 'X'], ['', '', ''], ['', '', '']];
        expect(isGameEnded(board)).to.equal(true);
    });

});
