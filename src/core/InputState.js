class InputState {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    startTracking() {
        window.addEventListener('mousemove', this.move.bind(this));
    }

    move(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }
};

export default new InputState();