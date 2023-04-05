export const NODE_STATE = {
    empty: 0,
    blocked: 1,
    visited: 2,
    start: 3,
    destination: 4,
    path: 5,
};

export const NODE_COLOR = {
    [NODE_STATE.empty]: "white",
    [NODE_STATE.blocked]: "black",
    [NODE_STATE.visited]: "blue",
    [NODE_STATE.start]: "red",
    [NODE_STATE.destination]: "green",
    [NODE_STATE.path]: "pink",
};

export const CANVAS_SIZE = {
    width: 400,
    height: 400,
};

export const GRID_SIZE = {
    rows: 20,
    cols: 20,
};

export const NODE_SIZE = {
    width: CANVAS_SIZE.width / GRID_SIZE.cols,
    height: CANVAS_SIZE.height / GRID_SIZE.rows,
};
