import { Descriptor } from '../intools/descriptor.js';

/**
 *
 * @author desharnc27
 * 
 * Abstract class
 */
export class ParamGadget {

    #descriptor;

    constructor(descriptor) {
        this.#descriptor = descriptor;
    }

    getShortDesc() {
        return this.#descriptor.getShortDesc();
    }

    getLongDesc() {
        return this.#descriptor.getLongDesc();
    }

    inc() {
        throw new Error('Method "inc" must be implemented.');
    }

    dec() {
        throw new Error('Method "dec" must be implemented.');
    }

    getCurrentValue() {
        throw new Error('Method "getCurrentValue" must be implemented.');
    }

    set(valOrIdx) {
        throw new Error('Method "set" must be implemented.');
    }

    getCurrentIdx() {
        throw new Error('Method "getCurrentIdx" must be implemented.');
    }

}
