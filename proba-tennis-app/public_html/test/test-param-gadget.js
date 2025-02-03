import { Descriptor } from '../intools/descriptor.js'
import { DescriptiveParamGadget } from '../paramgadget/descriptive-param-gadget.js'
import { IntervalParamGadget } from '../paramgadget/interval-param-gadget.js'
import { ParamGadget } from '../paramgadget/param-gadget.js'
import { TBTargetParamGadget } from '../paramgadget/tb-target-param-gadget.js'

        /**
         *
         * @author desharnc27
         */
export class TestParamGadget {

    static main0() {
        const dsc = new Descriptor("Totocriptor");
        const start = 2;
        const roof = 5;
        const ipg = new IntervalParamGadget(dsc, start, roof);
        for (let i = 0; i < 40; i++) {
            if (Math.random() < 0.5) {
                ipg.dec();
            } else {
                ipg.inc();
            }
            console.log(ipg.getCurrentValue());
        }
    }

    static main1() {
        let dsc = new Descriptor("descicirptor");
        const allowNoTB = true;
        const roof = 5;
        const setTarget = 18;
        let pg = new TBTargetParamGadget(dsc, allowNoTB, roof, setTarget);
        this.wobbleParamGadget(pg);

        dsc = new Descriptor("tbcriptor");
        const choices = ["stone", "secrets", "prison",
            "fire", "phenix", "bloodrince", "hallows"];
        pg = new DescriptiveParamGadget(dsc, choices);
        this.wobbleParamGadget(pg);
    }

    static wobbleParamGadget(pg) {
        console.log("wobbling starts for " + pg.getShortDesc());
        let seuil = 0.3;
        const nbIter = 30;
        for (let i = 0; i < nbIter; i++) {
            let change;
            if (Math.random() < seuil) {
                change = pg.dec();
            } else {
                change = pg.inc();
            }
            if (!change) {
                seuil = 1.0 - seuil;
            }
            console.log(pg.getCurrentValue());
        }
        console.log("wobbling ends for " + pg.getShortDesc());
    }

    static main(args) {
        this.main1();
    }
}
