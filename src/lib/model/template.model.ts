

export class Tuple {

    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ) {
    }

    equals(t: Tuple): boolean {
        return (
            this.numberEquals(t.x, this.x) &&
            this.numberEquals(t.y, this.y) &&
            this.numberEquals(t.z, this.z) &&
            this.numberEquals(t.w, this.w)
        );
    }

    numberEquals(x: number, x2: number) {
        return Math.abs(x - x2) < 0.00001;
    }
}

