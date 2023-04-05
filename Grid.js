import { Drawer } from "./Drawer.js";
import { InputListener } from "./InputListener.js";
import { NODE_SIZE, NODE_STATE } from "./constants.js";

export class Grid {
    constructor(numRows, numCols) {
        this._grid = this._buildGrid(numRows, numCols);
        this._drawer = new Drawer(this._grid);
        this._canvas = document.querySelector("canvas");
        InputListener.listenToClicksOnCanvas(this._onClick.bind(this));
        InputListener.listenToKeyboard();
    }

    _buildGrid(numRows, numCols) {
        return Array(numRows)
            .fill(0)
            .map(() => Array(numCols).fill(NODE_STATE.empty));
    }

    _onClick(event) {
        const [row, col] = this._getClickPosition(event);
        if (this._grid[row][col] === NODE_STATE.empty) {
            this._setToBlocked(row, col);
        } else if (this._grid[row][col] === NODE_STATE.blocked) {
            this._setToEmpty(row, col);
        }

        this._drawer.draw();
    }

    _getClickPosition(event) {
        const [x, y] = this._getClickCoordinates(event);
        const [row, col] = this._toRowCol(x, y);
        return [row, col];
    }

    _getClickCoordinates(event) {
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x < 0) x = 0;
        if (x > this._canvas.width) x = this._canvas.width;
        if (y < 0) y = 0;
        if (y > this._canvas.height) y = this._canvas.height;
        return [x, y];
    }

    _toRowCol(x, y) {
        const row = Math.floor(y / NODE_SIZE.height);
        const col = Math.floor(x / NODE_SIZE.width);
        return [row, col];
    }

    _setToEmpty(row, col) {
        this._grid[row][col] = NODE_STATE.empty;
    }

    _setToBlocked(row, col) {
        this._grid[row][col] = NODE_STATE.blocked;
    }

    _setToVisited(row, col) {
        this._grid[row][col] = NODE_STATE.visited;
    }

    _setToStart(row, col) {
        this._grid[row][col] = NODE_STATE.start;
    }

    _setToDestination(row, col) {
        this._grid[row][col] = NODE_STATE.destination;
    }

    _setToPath(row, col) {
        this._grid[row][col] = NODE_STATE.path;
    }
}
