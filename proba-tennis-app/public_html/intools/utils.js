export class Utils {
    static addInto(arr, toAdd) {
        for (let i = 0; i < toAdd.length; i++) {
            for (let j = 0; j < toAdd[i].length; j++) {
                arr[i][j] += toAdd[i][j];
            }
        }
    }

    static divdeInto(arr, div) {
        for (let subArr of arr) {
            for (let j = 0; j < subArr.length; j++) {
                subArr[j] /= div;
            }
        }
    }

    static double1DArrayWithValue(size, value) {
        const array = new Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = value;
        }
        return array;
    }

    static double2DArrayWithValue(rows, columns, value) {
        const array = new Array(rows);
        for (let i = 0; i < rows; i++) {
            array[i] = Utils.double1DArrayWithValue(columns, value);
        }
        return array;
    }

    static double3DArrayWithValue(depth, rows, columns, value) {
        const array = new Array(depth);
        for (let i = 0; i < depth; i++) {
            array[i] = Utils.double2DArrayWithValue(rows, columns, value);
        }
        return array;
    }

    static async readFileTo2DArray(filename, innerSep) {
        const fs = require('fs').promises;
        const lines = [];

        const fileContent = await fs.readFile(filename, 'utf8');
        const fileLines = fileContent.split('\n');

        for (let line of fileLines) {
            if (line) {
                const splitLine = line.split(innerSep);
                lines.push(splitLine);
            }
        }

        const array = new Array(lines.length);
        for (let i = 0; i < lines.length; i++) {
            array[i] = lines[i];
        }

        return array;
    }

    /* static async readFileTo2DArray(filename) {
     return await Utils.readFileTo2DArray(filename, ',');
     }*/

    static initialize(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = 0;
        }
    }

    static binomialZScore(n, p, x) {
        return (x - p * n) / Math.sqrt(n * p * (1 - p));
    }

    /**
     * Formats a numerical value into a string representation with the specified precision.
     * The format can be either as a percentage or as a normal decimal.
     *
     * @param {number} value - The numerical value to format.
     * @param {number} precision - The number of digits after the decimal point (or two less if asPercentage is true).
     * @param {boolean} asPercentage - If true, the value is formatted as a percentage; if false, it is formatted as a normal decimal.
     * @returns {string} A string representation of the formatted value with the intended precision.
     * @throws {Error} If the precision is negative or insufficient for percentage formatting.
     */
    static probaFormat(value, precision, asPercentage) {
        if (precision < 0) {
            throw new Error("Precision must be non-negative.");
        }

        const scaledValue = asPercentage ? value * 100 : value;
        const actualPrecision = asPercentage ? precision - 2 : precision;

        if (actualPrecision < 0) {
            throw new Error("Precision is too small for percentage format.");
        }

        return scaledValue.toFixed(actualPrecision) + (asPercentage ? "%" : "");
    }

}
