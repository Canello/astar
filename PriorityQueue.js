class PriorityQueue {
    constructor() {
        this._arr = [];
    }

    // print() {
    //     const lines = [];

    //     for (let i in this._arr) {
    //         const lineIdx = Math.ceil(Math.log(i / 2 + 1) / Math.log(2));
    //         if (!lines[lineIdx]) {
    //             lines[lineIdx] = [this._arr[i]];
    //         } else {
    //             lines[lineIdx].push(this._arr[i]);
    //         }
    //     }

    //     console.log("-----------------");
    //     for (let line of lines) {
    //         console.log(line.join(" "));
    //     }
    //     console.log("-----------------");
    // }

    put(val) {
        this._arr.push(val);
        this._siftUp();
    }

    get() {
        this._swap(0, this._arr.length - 1);
        const val = this._arr.pop();
        this._siftDown();
        return val;
    }

    _siftUp() {
        let i = this._arr.length - 1;
        let iParent = this._getParentIndex(i);
        while (this._arr[i] > this._arr[iParent]) {
            this._swap(i, iParent);
            i = iParent;
            iParent = this._getParentIndex(i);
        }
    }

    _siftDown() {
        let i = 0;
        let iLeftChild = this._getLeftChildIndex(i);
        let iRightChild = this._getRightChildIndex(i);
        while (
            this._arr[i] < this._arr[iLeftChild] ||
            this._arr[i] < this._arr[iRightChild]
        ) {
            const isLeftGreater =
                this._arr[iLeftChild] > this._arr[iRightChild];
            if (isLeftGreater) {
                this._swap(i, iLeftChild);
                i = iLeftChild;
            } else {
                this._swap(i, iRightChild);
                i = iRightChild;
            }
            iLeftChild = this._getLeftChildIndex(i);
            iRightChild = this._getRightChildIndex(i);
        }
    }

    _swap(i, j) {
        const temp = this._arr[i];
        this._arr[i] = this._arr[j];
        this._arr[j] = temp;
    }

    _getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    _getLeftChildIndex(index) {
        return index * 2 + 1;
    }

    _getRightChildIndex(index) {
        return index * 2 + 2;
    }
}
