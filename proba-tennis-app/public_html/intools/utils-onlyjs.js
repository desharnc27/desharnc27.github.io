export class UtilsOnlyjs {
    static strictParseFloat(str) {
        // Basic floating regex (handles optional sign, decimal point, exponent)
        const floatPattern = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
        if (!floatPattern.test(str)) {
            throw new Error(`NumberFormatException: Invalid float format '${str}'`);
        }
        return parseFloat(str);
    }
}

// These functions do not exists in java version

