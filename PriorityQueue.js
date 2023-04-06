export class PriorityQueue {
    constructor(comparator, printer) {
        this._arr = [];
        this._comparator = comparator;
        this._printer = printer ?? ((val) => val);
    }

    print() {
        const lines = [];

        for (let i in this._arr) {
            const lineIdx = Math.ceil(Math.log(i / 2 + 1) / Math.log(2));
            if (!lines[lineIdx]) {
                lines[lineIdx] = [this._arr[i]];
            } else {
                lines[lineIdx].push(this._arr[i]);
            }
        }

        console.log("-----------------");
        for (let line of lines) {
            const vals = [];
            for (let el of line) {
                vals.push(this._printer(el));
            }
            console.log(vals.join(" "));
        }
        console.log("-----------------");
    }

    get length() {
        return this._arr.length;
    }

    peek(i = 0) {
        return this._arr[i];
    }

    push(val) {
        this._arr.push(val);
        this._siftUp();
    }

    pop() {
        this._swap(0, this._arr.length - 1);
        const val = this._arr.pop();
        this._siftDown();
        return val;
    }

    _siftUp() {
        let i = this._arr.length - 1;
        let iParent = this._getParentIndex(i);
        while (this._compare(i, iParent)) {
            this._swap(i, iParent);
            i = iParent;
            iParent = this._getParentIndex(i);
        }
    }

    _siftDown() {
        let i = 0;
        let iLeftChild = this._getLeftChildIndex(i);
        let iRightChild = this._getRightChildIndex(i);
        while (this._compare(iLeftChild, i) || this._compare(iRightChild, i)) {
            const leftHasPriority = !this._arr[iRightChild]
                ? true
                : this._compare(iLeftChild, iRightChild);
            if (leftHasPriority) {
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

    _compare(i, j) {
        if (!this._arr[i] || !this._arr[j]) return false;
        return this._comparator(this._arr[i], this._arr[j]);
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

// const comparator = (a, b) => a.f > b.f;
// const printer = (el) => el.f;
// const q = new PriorityQueue(comparator, printer);
