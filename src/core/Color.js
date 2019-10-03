class Color {

    constructor(r, g, b, a) {
        
        if (a === undefined) {
            a = 1;
        }

        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
    }

    interpolate(color, percent) {

        let r = this.r + ((color.r - this.r) * percent);
        let g = this.g + ((color.g - this.g) * percent);
        let b = this.b + ((color.b - this.b) * percent);
        let a = this.a + ((color.a - this.a) * percent);

        return new Color(r, g, b, a);
    }

    toString() {
        
        if (this.a == 1) {
            return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        }

        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
    }
};

export default Color;