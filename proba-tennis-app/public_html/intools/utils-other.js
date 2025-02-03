export class UtilsOther {
    static EPSILON = Math.pow(2, -24);

    static formatNumber(value, nbPlacesMin, nbPlacesMax) {
        if (Math.abs(value) < Math.pow(10, -nbPlacesMin) && value !== 0) {
            let s = value.toExponential(nbPlacesMin);
            return s.replace('e', 'E');
        }
        return parseFloat(value.toFixed(nbPlacesMax)).toString();
    }

    static isRoughlyZero(value) {
        return Math.abs(value) < this.EPSILON;
    }
}

