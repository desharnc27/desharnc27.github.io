import { Descriptor } from '../intools/descriptor.js';
import { ParamGadget } from './param-gadget.js';

/**
 *
 * @author desharnc27
 */
export class DescriptiveParamGadget extends ParamGadget {
    idx;
    choices;

    static yesNoRUI(descriptor) {
        return new DescriptiveParamGadget(descriptor, ["No", "Yes"]);
    }

    constructor(descriptor, choices) {
        super(descriptor);
        this.choices = choices;
        this.idx = 0;
    }

    /**
     * @override
     */
    inc() {
        this.idx++;
        if (this.idx >= this.choices.length) {
            this.idx--;
            return false;
        }
        return true;
    }

    /**
     * @override
     */
    dec() {
        this.idx--;
        if (this.idx < 0) {
            this.idx++;
            return false;
        }
        return true;
    }

    /**
     * @override
     */
    getCurrentValue() {
        return this.choices[this.idx];
    }

    /**
     * @override
     */
    set(valOrIdx) {
        this.idx = valOrIdx;
    }

    /**
     * @override
     */
    getCurrentIdx() {
        return this.idx;
    }
}

