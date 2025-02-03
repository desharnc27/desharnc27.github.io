export class Rules {
    // --- static ---

    static MASTERS = 0;
    static GRAND_SLAM_2019 = 1;
    static OLD_WIMBY = 2;
    static MASTERS_DOUBLE = 3;
    static FIRST_NEXT_GEN = 4;
    static OLYMPICS = 5;
    static OLYMPICS_DOUBLE = 6;
    static DEBUG = 7;

    static #NB_FORMATS = 8;

    static #RULE_NAMES = Rules.#makeRuleNames();

    static #makeRuleNames() {
        const res = new Array(Rules.#NB_FORMATS);
        res[Rules.MASTERS] = "Masters (default)";
        res[Rules.GRAND_SLAM_2019] = "Grand Slam 2019";
        res[Rules.OLD_WIMBY] = "Old Wimbledon";
        res[Rules.MASTERS_DOUBLE] = "Masters doubles";
        res[Rules.FIRST_NEXT_GEN] = "First next gen";
        res[Rules.OLYMPICS] = "Old Olympics";
        res[Rules.OLYMPICS_DOUBLE] = "Olympics doubles";
        res[Rules.DEBUG] = "Debug";
        return res;
    }

    static getRuleName(id) {
        return Rules.#RULE_NAMES[id];
    }

    static getAllRuleNames() {
        return [...Rules.#RULE_NAMES];
    }

    static createRuleById(id) {
        switch (id) {
            case Rules.MASTERS:
                return Rules.masters();
            case Rules.GRAND_SLAM_2019:
                return Rules.modernGrandSlam();
            case Rules.OLD_WIMBY:
                return Rules.oldWimbledon();
            case Rules.MASTERS_DOUBLE:
                return Rules.doubleMaster();
            case Rules.FIRST_NEXT_GEN:
                return Rules.firstNextGen();
            case Rules.OLYMPICS:
                return Rules.olympics();
            case Rules.OLYMPICS_DOUBLE:
                return Rules.doubleOlympic();
            default:
                return Rules.debugSmallCombo();
        }
    }

    static defaultRules() {
        return new Rules();
    }

    static masters() {
        return new Rules();
    }

    static oldWimbledon() {
        const pp = new Rules();
        pp.sizeOfMatch = 3;
        pp.gapFinalTB = -2;
        return pp;
    }

    static modernGrandSlam() {
        const pp = new Rules();
        pp.sizeOfMatch = 3;
        pp.sizeOfFinalTB = 10;
        return pp;
    }

    static firstNextGen() {
        const pp = new Rules();
        pp.sizeOfMatch = 3;
        pp.sizeOfRegSet = 4;
        pp.gapRegTB = 0;
        pp.advantages = false;
        pp.makeFinalSetSameFormat();
        return pp;
    }

    static olympics() {
        const pp = new Rules();
        pp.gapFinalTB = -2;
        return pp;
    }

    static doubleMaster() {
        const pp = Rules.doubleOlympic();
        pp.advantages = false;
        return pp;
    }

    static doubleOlympic() {
        const pp = new Rules();
        pp.sizeOfFinalSet = 1;
        pp.gapFinalTB = -1;
        pp.sizeOfFinalTB = 11;
        return pp;
    }

    static debugSingleTB() {
        const pp = Rules.doubleMaster();
        pp.sizeOfMatch = 1;
        pp.sizeOfFinalTB = 2;
        return pp;
    }

    static debugFakeTB() {
        const pp = new Rules();
        pp.sizeOfMatch = 1;
        pp.advantages = false;
        pp.sizeOfJeu = 1;
        pp.gapFinalTB = -2;
        return pp;
    }

    static debugSmallCombo() {
        const pp = new Rules();
        pp.advantages = false;
        pp.sizeOfJeu = 2;
        pp.sizeOfRegTB = 3;
        pp.sizeOfRegSet = 2;
        pp.makeFinalSetSameFormat();
        return pp;
    }

    static debugSmallCombo2() {
        const pp = new Rules();
        pp.advantages = false;
        pp.sizeOfJeu = 5;
        pp.sizeOfRegTB = 7;
        pp.sizeOfRegSet = 4;
        pp.gapRegTB = 4;
        pp.makeFinalSetSameFormat();
        pp.gapFinalTB = -2;
        return pp;
    }

    // --- End of static ---
    constructor(sizeOfJeu, advantages, sizeOfRegSet, gapRegTB, sizeOfRegTB,
            sizeOfFinalSet, gapFinalTB, sizeOfFinalTB, sizeOfMatch) {
        if (arguments.length === 0) {
            this.setDefault();
        } else {
            this.sizeOfJeu = sizeOfJeu;
            this.advantages = advantages;
            this.sizeOfRegSet = sizeOfRegSet;
            this.gapRegTB = gapRegTB;
            this.sizeOfRegTB = sizeOfRegTB;
            this.sizeOfFinalSet = sizeOfFinalSet;
            this.gapFinalTB = gapFinalTB;
            this.sizeOfFinalTB = sizeOfFinalTB;
            this.sizeOfMatch = sizeOfMatch;
        }
    }

    makeFinalSetSameFormat() {
        this.sizeOfFinalSet = this.sizeOfRegSet;
        this.gapFinalTB = this.gapRegTB;
        this.sizeOfFinalTB = this.sizeOfRegTB;
    }

    setDefault() {
        this.sizeOfJeu = 4;
        this.advantages = true;
        this.sizeOfRegTB = 7;
        this.sizeOfRegSet = 6;
        this.gapRegTB = 0;
        this.makeFinalSetSameFormat();
        this.sizeOfMatch = 2;
    }

    inTieBreak(nj0, nj1, finalSet) {
        if (nj0 !== nj1 || (finalSet && !this.finalSetHasTieBreak())) {
            return false;
        }
        const tbSeuil = finalSet ? this.sizeOfFinalSet + this.gapFinalTB : this.sizeOfRegSet + this.gapRegTB;
        return nj0 >= tbSeuil;
    }

    finalSetHasTieBreak() {
        return this.sizeOfFinalTB >= 0;
    }
}
