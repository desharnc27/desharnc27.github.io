import {Descriptor} from '../intools/descriptor.js';
import {IntervalParamGadget} from './interval-param-gadget.js';

/**
 *
 * @author desharnc27
 */
export class TBTargetParamGadget extends IntervalParamGadget {

    #setTarget;

    constructor(descriptor, allowNoTB, roof, setTarget) {
        super(descriptor, allowNoTB ? -2 : -1, roof);
        this.setSetTarget(setTarget);
    }

    setSetTarget(setTarget) {
        this.#setTarget = setTarget;
    }

    /**
     * @override
     */
    getCurrentValue() {
        if (this.val < -1) {
            return "No TB";
        }
        let score = this.#setTarget + this.val;
        return score + "-" + score;
    }
}
