import {Rules} from '../central/rules.js'
import {Calx} from '../central/calx.js'
import {MatchState} from '../central/match-state.js'

export class TestCentral {
    static main0() {
        let rulesId = Rules.MASTERS;
        let rules = Rules.createRuleById(rulesId);
        let calx = new Calx(rules, [0.7, 0.3]);
        for (let match = 0; match < 10; match++) {
            let ms = MatchState.fromStart(calx);
            for (let i = 0; i < 20; i++) {
                ms.scorePoint(Math.random() < 0.5 ? 0 : 1);
            }
            console.log(Rules.getRuleName(rulesId));
            console.log(ms.toString());
            console.log(ms.probWinMatch());
            console.log("---------");
        }
    }

    static main1() {
        let r = Rules.modernGrandSlam();
        let calx = new Calx(r, [0.65, 0.3]);
        for (let srv = 0; srv < 2; srv++) {
            console.log(calx.probWinSetJJfsPP(2, 3, false, srv, 0, 2));
        }
    }

    static main() {
        this.main0();
    }
}
