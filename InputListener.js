export class InputListener {
    static listenToKeyboard(onKeyPress, onKeyRelease) {
        document.body.addEventListener("keydown", onKeyPress);
        document.body.addEventListener(
            "keyup",
            onKeyRelease ?? this._emptyFunction
        );
    }

    static listenToClicksOnCanvas(onClick) {
        const canvas = document.querySelector("canvas");
        canvas.addEventListener("click", onClick);
    }

    _emptyFunction() {}

    _onClickOnCanvas(event) {
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x < 0) x = 0;
        if (x > this._canvas.width) x = this._canvas.width;
        if (y < 0) y = 0;
        if (y > this._canvas.height) y = this._canvas.height;

        console.log(x, y);
    }
}
