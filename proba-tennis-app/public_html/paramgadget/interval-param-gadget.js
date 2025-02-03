import { Descriptor } from '../intools/descriptor.js'
import { ParamGadget } from '../paramgadget/param-gadget.js'
        /**
         *
         * @author desharnc27
         */
export class IntervalParamGadget extends ParamGadget {

    val; // protected before translation
    start; // protected before translation
    roof; // protected before translation

    constructor(descriptor, start, roof) {
        super(descriptor);
        this.start = start;
        this.roof = roof;
        this.val = start;
    }

    /**
     * @override
     */
    inc() {
        if (this.val >= this.roof - 1) {
            return false;
        }
        this.val++;
        return true;
    }

    /**
     * @override
     */
    dec() {
        if (this.val <= this.start) {
            return false;
        }
        this.val--;
        return true;
    }

    /**
     * @override
     */
    getCurrentValue() {
        return String(this.val);
    }

    /**
     * @override
     */
    getCurrentIdx() {
        return this.val;
    }

    /**
     * @override
     * @param {valOrIdx} number
     */
    set(valOrIdx) {
        this.val = valOrIdx;
    }

    getRoof() {
        return this.roof;
    }
}
