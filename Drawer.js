import { NODE_COLOR, NODE_SIZE } from "./constants.js";

export class Drawer {
    constructor(grid) {
        this._grid = grid;
        this._canvas = document.querySelector("canvas");
        this._context = this._canvas.getContext("2d");
        this.draw();
    }

    draw() {
        this._drawNodes();
        this._drawGrid();
    }

    _drawNodes() {
        for (let row = 0; row < this._grid.length; row++) {
            for (let col = 0; col < this._grid[0].length; col++) {
                this._drawNode(row, col);
            }
        }
    }

    _drawNode(row, col) {
        const x = col * NODE_SIZE.width;
        const y = row * NODE_SIZE.height;
        this._context.fillStyle = NODE_COLOR[this._grid[row][col]];
        this._context.fillRect(x, y, NODE_SIZE.width, NODE_SIZE.height);
    }

    _drawGrid() {
        for (let row = 0; row < this._grid.length; row++) {
            const y = row * NODE_SIZE.height;
            this._drawGridLine(0, y, this._grid.length * NODE_SIZE.width, y);
        }

        for (let col = 0; col < this._grid[0].length; col++) {
            const x = col * NODE_SIZE.width;
            this._drawGridLine(
                x,
                0,
                x,
                this._grid[0].length * NODE_SIZE.height
            );
        }
    }

    _drawGridLine(xi, yi, xf, yf) {
        this._context.fillStyle = "black";
        this._context.beginPath();
        this._context.moveTo(xi, yi);
        this._context.lineTo(xf, yf);
        this._context.stroke();
    }
}
