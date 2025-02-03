import {StrProbaFormatException} from './str-proba-format-exception.js';
import {UtilsOnlyjs} from './utils-onlyjs.js';

/**
 *
 * @author desharnc27
 *
 * An instance of this class contains a probability, both as double value and as the user
 * tried to entered it.
 */
export class StrProba {

    #value;
    #str;

    // Should not be called from outside. Plz use static functions instead. 
    constructor(value, str) {
        this.#value = value;
        this.#str = str;
    }

    /**
     * Gets the value.
     * @returns {number}
     */
    getValue() {
        return this.#value;
    }

    /**
     * Gets the string representation.
     * @returns {string}
     */
    getStr() {
        return this.#str;
    }

    /**
     * @override
     * @returns {string}
     */
    toString() {
        return `StrProba{value=${this.#value}, str=${this.#str}}`;
    }

    // Static functions
    /**
     * Returns the value if it is a probability (range [0-1]), throws an
     * exception otherwise
     *
     * @param {number} value
     * @param {boolean} percentageNumber true if the number is /100, false if /1
     * @returns {number} returns the value unless a StrProbaFormatException is thrown
     */
    static checkedAsProbaValue(value, percentageNumber) {
        const upperLimit = percentageNumber ? 100 : 1;
        if (value < 0) {
            throw new StrProbaFormatException(`${value} must be positive`);
        } else if (value > upperLimit) {
            const strLimit = percentageNumber ? "100%" : "1";
            throw new StrProbaFormatException(`${value} must not exceed ${strLimit}`);
        }
        return value;
    }

    // Note that the function below is the only way to create a StrProba instance,
    // since no public constructor exists
    /**
     * Parses string and tries to interpret it as a probability. Throws a
     * StrProbaFormatException if it fails.
     *
     * @param {string} s the input string, which can be decimal, percentage or fraction
     * @returns {StrProba} a StrProba instance, containing the user input (with minor
     * corrections if needed) and the value
     *
     */
    static attemptBuild(s) {
        s = s.replace(/ /g, "");
        s = s.replace(/,/g, ".");
        const slashIdx = s.indexOf("/");
        if (slashIdx >= 0) {
            try {
                const num = parseInt(s.substring(0, slashIdx), 10);
                const denom = parseInt(s.substring(slashIdx + 1), 10);
                const res = StrProba.checkedAsProbaValue(num / (denom + 0.0), false);
                return new StrProba(res, s);
            } catch (e) {
                if (e instanceof StrProbaFormatException) {
                    throw new StrProbaFormatException(`${s}=${e.message}`);
                } else if (e instanceof NumberFormatException) { // Note: NumberFormatException doesn't exist in JS
                    throw new StrProbaFormatException(`${s}: Both members of fraction must be integers`);
                } else {
                    throw e;
                }
            }
        }
        const detectPercent = s.endsWith("%");
        if (detectPercent) {
            s = s.substring(0, s.length - 1);
        }
        let val;
        try {
            //Changed from java due to permissivity
            val = UtilsOnlyjs.strictParseFloat(s);
        } catch (e) {
            throw new StrProbaFormatException(`${s} contains invalid characters`);
        }
        if (detectPercent || val > 1) {
            return new StrProba(StrProba.checkedAsProbaValue(val, true) / 100.0, `${s}%`);
        }
        return new StrProba(StrProba.checkedAsProbaValue(val, false), s);
    }

    static getAllValues(spArr) {
        let res = new Array(spArr.length);
        for (let i = 0; i < spArr.length; i++) {
            res[i] = spArr[i].getValue();
        }
        return res;
    }

    static getAllStrings(spArr) {
        let res = new Array(spArr.length);
        for (let i = 0; i < spArr.length; i++) {
            res[i] = spArr[i].getStr();
        }
        return res;
    }

}
