
export class Rules {

    // --- static ---

    static STANDARD = 0;
    static GS_2024 = 1;
    static DOUBLES_2024 = 2;
    static DOUBLES_GS_2024 = 3;
    static WIMBY_2021 = 4;
    static FIRST_NEXT_GEN = 5;
    static DOUBLES_2009 = 6;
    static OLD_GS = 7;
    static OLD_US = 8;
    static OLD_OLYMPICS = 9;
    static DEBUG = 10;

    static #NB_FORMATS = 11;

    static #RULE_NAMES = Rules.#makeRuleNames();

    static #RULE_DETAILS = Rules.#makeRuleDetails();

    static #makeRuleNames() {
        const res = new Array(Rules.#NB_FORMATS);
        res[Rules.STANDARD] = "Standard";
        res[Rules.GS_2024] = "Grand Slam 2024";
        res[Rules.DOUBLES_2024] = "Doubles 2024";
        res[Rules.DOUBLES_GS_2024] = "Doubles GS 2024";
        res[Rules.WIMBY_2021] = "Wimbledon 2021";
        res[Rules.FIRST_NEXT_GEN] = "proto-next-gen";
        res[Rules.DOUBLES_2009] = "doubles 2009";
        res[Rules.OLD_GS] = "Old Grand Slam";
        res[Rules.OLD_US] = "Old US Open";
        res[Rules.OLD_OLYMPICS] = "Old Olympics";
        res[Rules.DEBUG] = "debug format";
        return res;
    }

    static #makeRuleDetails() {
        const res = new Array(Rules.#NB_FORMATS);
        res[Rules.STANDARD] = "Standard format for singles";
        res[Rules.GS_2024] = "Current format for all Grand Slams, men singles";
        res[Rules.DOUBLES_2024] = "Standard format for doubles";
        res[Rules.DOUBLES_GS_2024] = "Current format for all Grand Slams, men doubles";
        res[Rules.WIMBY_2021] = "Short-lived format of Wimbledon, final tiebraker played at 12-12";
        res[Rules.FIRST_NEXT_GEN] = "Format of the first Next Gen Tournament";
        res[Rules.DOUBLES_2009] = "Short-lived double format, no advantages";
        res[Rules.OLD_GS] = "Older Grand Slam format (except USO), doubles & singles, no tiebreaker in final set";
        res[Rules.OLD_US] = "Older US Open format, doubles & singles, last set is identical to others";
        res[Rules.OLD_OLYMPICS] = "Older Olympic format, no final tiebreaker";
        res[Rules.DEBUG] = "Format used for debugging";
        return res;
    }

    static getRuleName(id) {
        return Rules.#RULE_NAMES[id];
    }

    static getAllRuleNames() {
        return Rules.#RULE_NAMES.slice();
    }

    static getRulesDetail(id) {
        return Rules.#RULE_DETAILS[id];
    }

    static getAllRulesDetails() {
        return Rules.#RULE_DETAILS.slice();
    }

    static createRuleById(id) {
        switch (id) {
            case Rules.STANDARD:
                return Rules.defaultRules();
            case Rules.GS_2024:
                return Rules.grandSlam2024();
            case Rules.DOUBLES_2024:
                return Rules.doubles2024();
            case Rules.DOUBLES_GS_2024:
                return Rules.doublesGS2024();
            case Rules.WIMBY_2021:
                return Rules.wimby2021();
            case Rules.FIRST_NEXT_GEN:
                return Rules.firstNextGen();
            case Rules.DOUBLES_2009:
                return Rules.doubles2009();
            case Rules.OLD_GS:
                return Rules.oldGS();
            case Rules.OLD_US:
                return Rules.oldUSOpen();
            case Rules.OLD_OLYMPICS:
                return Rules.oldOlympics();
            default:
                return Rules.debugSmallCombo();
        }
    }

    static defaultRules() {
        return new Rules();
    }
    static grandSlam2024() {
        const pp = Rules.oldUSOpen();
        pp.sizeOfFinalTB = 10;
        return pp;
    }
    static doubles2024() {
        const pp = Rules.doublesGS2024();
        pp.gapFinalTB = -1;
        pp.sizeOfFinalSet = 1;
        return pp;
    }
    static doublesGS2024() {
        const pp = new Rules();
        pp.sizeOfFinalTB = 10;
        return pp;
    }

    static wimby2021() {
        const pp = Rules.oldUSOpen();
        pp.gapFinalTB = 6;
        return pp;
    }
    static firstNextGen() {
        const pp = new Rules();
        pp.sizeOfMatch = 3;
        pp.sizeOfRegSet = 4;
        pp.gapRegTB = -1;
        pp.advantages = false;
        pp.makeFinalSetSameFormat();
        return pp;
    }
    static doubles2009() {
        const pp = Rules.doubles2024();
        pp.advantages = false;
        return pp;
    }
    static oldGS() {
        const pp = Rules.oldUSOpen();
        pp.gapFinalTB = -2;
        return pp;
    }
    static oldUSOpen() {
        const pp = new Rules();
        pp.sizeOfMatch = 3;
        return pp;
    }
    static oldOlympics() {
        const pp = new Rules();
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
    sizeOfJeu;
    advantages;

    sizeOfRegSet;
    gapRegTB;
    sizeOfRegTB;

    sizeOfFinalSet;
    gapFinalTB;
    sizeOfFinalTB;

    sizeOfMatch;

    makeFinalSetSameFormat() {
        this.sizeOfFinalSet = this.sizeOfRegSet;
        this.gapFinalTB = this.gapRegTB;
        this.sizeOfFinalTB = this.sizeOfRegTB;
    }

    /**
     * Sets the default values for the rules.
     */
    setDefault() {
        this.sizeOfJeu = 4;
        this.advantages = true;
        this.sizeOfRegTB = 7;
        this.sizeOfRegSet = 6;
        this.gapRegTB = 0;
        this.makeFinalSetSameFormat();
        this.sizeOfMatch = 2;
    }

    constructor(sizeOfJeu, advantages, sizeOfRegSet, gapRegTB, sizeOfRegTB, sizeOfFinalSet, gapFinalTB, sizeOfFinalTB, sizeOfMatch) {
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

    /**
     * Checks whether the current score is in a tie-break.
     * @param {number} nj0 - Score of first player.
     * @param {number} nj1 - Score of second player.
     * @param {boolean} finalSet - Indicates if it's the final set.
     * @returns {boolean} True if in tie-break, otherwise false.
     */
    inTieBreak(nj0, nj1, finalSet) {
        if (nj0 !== nj1 || (finalSet && !this.finalSetHasTieBreak())) {
            return false;
        }
        const tbSeuil = finalSet ? this.sizeOfFinalSet + this.gapFinalTB : this.sizeOfRegSet + this.gapRegTB;
        //Note: > case should not happen
        return nj0 >= tbSeuil;
    }

    /**
     * Determines if the final set has a tie-break.
     * @returns {boolean} True if final set has a tie-break, otherwise false.
     */
    finalSetHasTieBreak() {
        return this.gapFinalTB > -2;
    }
}
