export class InputListener {
    static isListening = true;

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
}
