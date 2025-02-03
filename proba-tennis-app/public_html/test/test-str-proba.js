import { StrProba } from '../intools/str-proba.js';
import { StrProbaFormatException } from '../intools/str-proba-format-exception.js';

/**
 *
 * @author desharnc27
 */
export class TestStrProba {
    /**
     * Attempts to build a StrProba object from a string and logs the result.
     * @param {string} s 
     */
    static testSingleFP(s) {
        try {
            const fp = StrProba.attemptBuild(s);
            console.log(fp);
        } catch (e) {
            console.log(e.message);
        }
    }

    static main0() {
        const inputs = [
            "5/4",
            "22/44",
            "3.6",
            "3.6%",
            "0.7",
            "0 .7%",
            "0.u7%",
        ];
        for (const input of inputs) {
            this.testSingleFP(input);
        }
    }

    static main() {
        this.main0();
    }
}
