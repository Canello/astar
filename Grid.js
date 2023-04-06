import { Drawer } from "./Drawer.js";
import { InputListener } from "./InputListener.js";
import { PriorityQueue } from "./PriorityQueue.js";
import { NODE_SIZE, NODE_STATE } from "./constants.js";

class Node {
    constructor({ key, row, col, f, g, h, cameFrom }) {
        this.key = key;
        this.row = row;
        this.col = col;
        this.f = f;
        this.g = g;
        this.h = h;
        this.cameFrom = cameFrom;
        this.count = 0;
    }
}

class Nodes {
    constructor(numRows, numCols) {
        this._nodes = {};
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this._nodes[this._key(row, col)] = new Node({
                    key: this._key(row, col),
                    row,
                    col,
                    f: Infinity,
                    g: Infinity,
                    h: Infinity,
                    cameFrom: null,
                });
            }
        }
    }

    get(row, col) {
        return this._nodes[this._key(row, col)];
    }

    _key(row, col) {
        return `${row}, ${col}`;
    }
}

export class Grid {
    constructor(numRows, numCols) {
        this._canvas = document.querySelector("canvas");

        this._grid = this._buildGrid(numRows, numCols);
        this._drawer = new Drawer(this._grid);

        this._start;
        this._destination;
        this._setStart(0, 0);
        this._setDestination(numRows - 3, numCols - 4);

        InputListener.listenToClicksOnCanvas(this._onClick.bind(this));
        InputListener.listenToKeyboard(this._onKeyPress.bind(this));
        this._areChangesAllowed = true;

        this._drawer.draw();
    }

    _comparator(a, b) {
        if (a.f === b.f) {
            // if (a.g === b.g) {
            return a.count > b.count;
            // }
            // return a.g < b.g;
        }
        return a.f < b.f;
    }

    // A*
    async _findPath() {
        this._areChangesAllowed = false;

        let hasReachedDestination = false;
        let count = { current: 0 };
        const nodes = new Nodes(this._grid.length, this._grid[0].length);
        const open = new PriorityQueue(this._comparator);
        this._processFirstNode(nodes, open, count);

        while (open.length > 0) {
            const node = open.pop();
            if (this._isDestination(node.row, node.col)) {
                hasReachedDestination = true;
                break;
            }
            this._tryToSet(node.row, node.col, this._setToVisited.bind(this));
            this._exploreNeighbors(node, nodes, open, count);
            this._drawer.draw();
            await this._delay(50);
        }

        if (hasReachedDestination) this._reconstructPath(nodes);
        this._areChangesAllowed = true;
    }

    _processFirstNode(nodes, open, count) {
        const [startRow, startCol] = this._start;
        const startNode = nodes.get(startRow, startCol);
        startNode.g = 0;
        startNode.h = this._h(startRow, startCol);
        startNode.f = startNode.g + startNode.h;
        startNode.count = count.current++;
        open.push(startNode);
    }

    _exploreNeighbors(node, nodes, open, count) {
        const neighbors = this._getNeighbors(node.row, node.col, nodes);
        for (let neighbor of neighbors) {
            // console.log(neighbor.row, neighbor.col, count);
            this._exploreNeighbor(node, neighbor, open, count);
        }
    }

    _exploreNeighbor(node, neighbor, open, count) {
        const g = node.g + 1;
        const h = this._h(neighbor.row, neighbor.col);
        const f = g + h;
        if (f < neighbor.f) {
            this._updateNeighbor(node, neighbor, f, g, h, count);
            open.push(neighbor);
        }
    }

    _updateNeighbor(node, neighbor, f, g, h, count) {
        neighbor.f = f;
        neighbor.g = g;
        neighbor.h = h;
        neighbor.cameFrom = node;
        neighbor.count = count.current++;
        this._tryToSet(neighbor.row, neighbor.col, this._setToOpen.bind(this));
    }

    _getNeighbors(row, col, nodes) {
        const neighbors = [];
        this._pushNeighbor(row - 1, col, nodes, neighbors);
        this._pushNeighbor(row, col + 1, nodes, neighbors);
        this._pushNeighbor(row + 1, col, nodes, neighbors);
        this._pushNeighbor(row, col - 1, nodes, neighbors);
        return neighbors;
    }

    _pushNeighbor(row, col, nodes, neighbors) {
        if (nodes.get(row, col) && !this._isBlocked(row, col))
            neighbors.push(nodes.get(row, col));
    }

    async _reconstructPath(nodes) {
        const destination = nodes.get(
            this._destination[0],
            this._destination[1]
        );
        let node = destination;

        while (node) {
            this._tryToSet(node.row, node.col, this._setToPath.bind(this));
            node = node.cameFrom;
            this._drawer.draw();
            await this._delay(20);
        }
    }

    async _delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Manhattan distance
    _h(row, col) {
        const deltaRow = Math.abs(this._destination[0] - row);
        const deltaCol = Math.abs(this._destination[1] - col);
        return deltaRow + deltaCol;
    }

    _setStart(row, col) {
        this._setToStart(row, col);
        this._start = [row, col];
    }

    _setDestination(row, col) {
        this._setToDestination(row, col);
        this._destination = [row, col];
    }

    _isStart(row, col) {
        return row === this._start[0] && col === this._start[1];
    }

    _isDestination(row, col) {
        return row === this._destination[0] && col === this._destination[1];
    }

    _isBlocked(row, col) {
        return this._grid[row][col] === NODE_STATE.blocked;
    }

    _buildGrid(numRows, numCols, fill = NODE_STATE.empty) {
        return Array(numRows)
            .fill(0)
            .map(() => Array(numCols).fill(fill));
    }

    _onKeyPress(event) {
        if (event.key === " ") this._findPath();
    }

    _onClick(event) {
        if (!this._areChangesAllowed) return;

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

    _setToOpen(row, col) {
        this._grid[row][col] = NODE_STATE.open;
    }

    _tryToSet(row, col, set) {
        if (!this._isStart(row, col) && !this._isDestination(row, col))
            set(row, col);
    }
}
