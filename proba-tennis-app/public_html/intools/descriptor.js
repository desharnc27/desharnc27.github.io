/**
 *
 * @author desharnc27
 */
export class Descriptor {
    static SPLITTER = "%%";

    #longDesc;
    #shortDesc;

    constructor(shortDesc, longDesc = null) {
        this.#shortDesc = shortDesc;
        this.#longDesc = longDesc;
    }

    static buildBySplitter(input) {
        const idx = input.indexOf(Descriptor.SPLITTER);
        if (idx < 0) {
            return new Descriptor(input);
        }
        const left = input.substring(0, idx);
        const right = input.substring(idx + Descriptor.SPLITTER.length);
        return new Descriptor(left, right);
    }

    getShortDesc() {
        return this.#shortDesc;
    }

    getLongDesc() {
        if (this.#longDesc === null) {
            return this.#shortDesc;
        }
        return this.#longDesc;
    }

    getCopy() {
        return new Descriptor(this.#shortDesc, this.#longDesc);
    }

    toString() {
        return this.#shortDesc;
    }
}
