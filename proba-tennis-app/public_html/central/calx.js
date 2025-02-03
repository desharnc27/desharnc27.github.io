
import {Utils} from '../intools/utils.js'
import {UtilsOther} from '../intools/utils-other.js'

export class Calx {
    // Could be either 0 or 1. Used when both 0 or 1 leads to same result because server doesn't change proba
    static #ANY = 0;
    // Value indicating the absence of something (ex: tieBreakDiff = WOOL --> no tie-break in final set)
    static #NOT_APPLICABLE = -1 << 24;
    // This is put in addresses that will never be read. So the value of UNREAD doesn't mind
    static #UNREAD = 0.125; // Never read

    #p;
    #jeuTarget;
    #advantages;
    #bigTBTarget;
    #diffTB;
    #regSetTarget;
    #gapRegTB;
    #finalSetTarget;
    #gapFinalTB;
    #matchTarget;

    constructor(r, p0SingleProbs) {
        this.#jeuTarget = r.sizeOfJeu;
        this.#advantages = r.advantages;
        this.#bigTBTarget = Math.max(r.sizeOfFinalTB, r.sizeOfRegTB);
        this.#diffTB = r.sizeOfFinalTB >= 0 ? r.sizeOfFinalTB - r.sizeOfRegTB : Calx.#NOT_APPLICABLE;
        this.#regSetTarget = r.sizeOfRegSet;
        this.#gapRegTB = r.gapRegTB;
        this.#matchTarget = r.sizeOfMatch;
        this.#finalSetTarget = r.sizeOfFinalSet;
        this.#gapFinalTB = r.gapFinalTB;

        this.#p = p0SingleProbs.slice(0, 2);
        this.#initializeArrays();
        this.#fillAllArrays();
    }

    getP() {
        return this.#p;
    }

    getJeuTarget() {
        return this.#jeuTarget;
    }

    hasAdvantages() {
        return this.#advantages;
    }

    getGapRegTB() {
        return this.#gapRegTB;
    }

    getGapFinalTB() {
        return this.#gapFinalTB;
    }

    getGapTB(finalSet) {
        return finalSet ? this.#gapFinalTB : this.#gapRegTB;
    }

    getSetTarget(finalSet) {
        return finalSet ? this.#finalSetTarget : this.#regSetTarget;
    }

    getRegSetTarget() {
        return this.#regSetTarget;
    }

    getFinalSetTarget() {
        return this.#finalSetTarget;
    }

    getMatchTarget() {
        return this.#matchTarget;
    }

    hasLastSetTieBreak() {
        return this.#gapFinalTB >= -1;
    }

    #getTbStarter(finalSet) {
        return finalSet === this.#diffTB < 0 ? Math.abs(this.#diffTB) : 0;
    }

    getRegTBTarget() {
        return this.getTBTarget(false);
    }

    getFinalTBTarget() {
        return this.getTBTarget(true);
    }

    getTBTarget(finalSet) {
        return this.#bigTBTarget - this.#getTbStarter(finalSet);
    }

    getMomentOfTB(finalSet) {
        if (!finalSet) {
            return this.#regSetTarget + this.#gapRegTB;
        } else if (this.hasLastSetTieBreak()) {
            return this.#finalSetTarget + this.#gapFinalTB;
        }
        return -1;
    }

    #winJeu;
    #winBigTB;
    #winRegSet;
    #winFinalSet;
    #winMatch;

    #initializeArrays() {
        this.#winJeu = Utils.double3DArrayWithValue(2, this.#jeuTarget + 1, this.#jeuTarget + 1, -1);
        this.#winBigTB = Utils.double3DArrayWithValue(2, this.#bigTBTarget + 1, this.#bigTBTarget + 1, -1);
        this.#winRegSet = Utils.double3DArrayWithValue(2, this.#regSetTarget, this.#regSetTarget, -1);
        this.#winFinalSet = Utils.double3DArrayWithValue(2, this.#finalSetTarget, this.#finalSetTarget, -1);
        this.#winMatch = Utils.double2DArrayWithValue(this.#matchTarget + 1, this.#matchTarget + 1, -1);
    }

    #fillAllArrays() {
        this.#fillInJeu();
        this.#fillInTieBreak();
        this.#fillInSet(true);
        this.#fillInSet(false);
        this.#fillInMatch();
    }

    #fillInJeu() {
        for (let srv = 0; srv < 2; srv++) {
            if (this.#advantages) {
                const stationnaryValues = Calx.#getStationnaryValues(this.#p[srv], this.#p[srv]);
                this.#winJeu[srv][this.#jeuTarget][this.#jeuTarget] = stationnaryValues[0];
                this.#winJeu[srv][this.#jeuTarget - 1][this.#jeuTarget] = stationnaryValues[1];
                this.#winJeu[srv][this.#jeuTarget][this.#jeuTarget - 1] = stationnaryValues[2];
            } else {
                this.#winJeu[srv][this.#jeuTarget][this.#jeuTarget] = this.#p[srv]; // not used
            }
            for (let np0 = this.#jeuTarget; np0 >= 0; np0--) {
                for (let np1 = this.#jeuTarget; np1 >= 0; np1--) {
                    if (this.#winJeu[srv][np0][np1] >= 0) {
                        continue;
                    }
                    if (np0 === this.#jeuTarget) {
                        this.#winJeu[srv][np0][np1] = 1.0;
                    } else if (np1 === this.#jeuTarget) {
                        this.#winJeu[srv][np0][np1] = 0.0;
                    } else {
                        this.#winJeu[srv][np0][np1] = this.#p[srv] * this.#winJeu[srv][np0 + 1][np1]
                                + (1 - this.#p[srv]) * this.#winJeu[srv][np0][np1 + 1];
                    }
                }
            }
        }
    }

    #fillInTieBreak() {
        for (let srv = 0; srv < 2; srv++) {
            const stationnaryValues = Calx.#getStationnaryValues(this.#p[srv], this.#p[1 - srv]);
            this.#winBigTB[srv][this.#bigTBTarget][this.#bigTBTarget] = stationnaryValues[0];
            this.#winBigTB[srv][this.#bigTBTarget - 1][this.#bigTBTarget] = stationnaryValues[1];
            this.#winBigTB[srv][this.#bigTBTarget][this.#bigTBTarget - 1] = stationnaryValues[2];
        }

        for (let np0 = this.#bigTBTarget; np0 >= 0; np0--) {
            for (let np1 = this.#bigTBTarget; np1 >= 0; np1--) {
                for (let srv = 0; srv < 2; srv++) {
                    if (this.#winBigTB[srv][np0][np1] >= 0) {
                        continue;
                    }
                    if (np0 === this.#bigTBTarget) {
                        this.#winBigTB[srv][np0][np1] = 1.0;
                    } else if (np1 === this.#bigTBTarget) {
                        this.#winBigTB[srv][np0][np1] = 0.0;
                    } else {
                        // Here, server is always switched, which is not the case for real tie break (only odd)
                        // However probs remain the same for even score, so calculations still work
                        this.#winBigTB[srv][np0][np1] = this.#p[srv] * this.#winBigTB[1 - srv][np0 + 1][np1]
                                + (1 - this.#p[srv]) * this.#winBigTB[1 - srv][np0][np1 + 1];
                    }
                }
            }
        }
    }

    #fillInSet(finalSet) {
        const winSet = finalSet ? this.#winFinalSet : this.#winRegSet;
        const sizeOfSet = this.getSetTarget(finalSet);
        const q = [this.#winJeu[0][0][0], this.#winJeu[1][0][0]];

        for (let nj0 = sizeOfSet - 1; nj0 >= 0; nj0--) {
            for (let nj1 = sizeOfSet - 1; nj1 >= 0; nj1--) {
                for (let srv = 0; srv < 2; srv++) {
                    if (nj0 === sizeOfSet - 1 && nj0 === nj1) {
                        winSet[srv][nj0][nj1] = this.#probWinSetWhenOnceEqualAndDiff2Wins(nj0, finalSet);
                    } else if (nj1 === sizeOfSet - 1) {
                        winSet[srv][nj0][nj1] = q[srv] * winSet[1 - srv][nj0 + 1][nj1];
                    } else if (nj0 === sizeOfSet - 1) {
                        winSet[srv][nj0][nj1] = q[srv] + (1 - q[srv]) * winSet[1 - srv][nj0][nj1 + 1];
                    } else {
                        winSet[srv][nj0][nj1] = q[srv] * winSet[1 - srv][nj0 + 1][nj1] + (1 - q[srv]) * winSet[1 - srv][nj0][nj1 + 1];
                    }
                }
            }
        }
    }

    #fillInMatch() {
        this.#winMatch[this.#matchTarget][this.#matchTarget] = Calx.#UNREAD;
        const ws = this.#winRegSet[Calx.#ANY][0][0];
        for (let ns0 = this.#matchTarget; ns0 >= 0; ns0--) {
            for (let ns1 = this.#matchTarget; ns1 >= 0; ns1--) {
                if (this.#winMatch[ns0][ns1] >= 0) {
                    continue;
                }
                if (ns0 === this.#matchTarget) {
                    this.#winMatch[ns0][ns1] = 1.0;
                } else if (ns1 === this.#matchTarget) {
                    this.#winMatch[ns0][ns1] = 0.0;
                } else if (ns0 + ns1 === 2 * this.#matchTarget - 2) {
                    this.#winMatch[ns0][ns1] = this.#winFinalSet[Calx.#ANY][0][0];
                } else {
                    this.#winMatch[ns0][ns1] = ws * this.#winMatch[ns0 + 1][ns1] + (1 - ws) * this.#winMatch[ns0][ns1 + 1];
                }
            }
        }
    }

    probWinTB(np0, np1, finalSet, srv) {
        const tbStarter = this.#getTbStarter(finalSet);
        np0 += tbStarter;
        np1 += tbStarter;
        const len = this.#winBigTB[srv].length;
        const min = Math.min(np0, np1);
        if (min > len - 2) {
            const adj = min - len + 2;
            np0 -= adj;
            np1 -= adj;
        }
        if (np0 >= len) {
            return 1.0;
        }
        if (np1 >= len) {
            return 0.0;
        }

        return this.#winBigTB[srv][np0][np1];
    }

    probWinJeu(srv) {
        return this.#winJeu[srv][0][0];
    }

    probWinJeusPP(srv, np0, np1) {
        return this.#winJeu[srv][np0][np1];
    }

    probWinSet(nj0, nj1, finalSet, srv) {
        const winSet = finalSet ? this.#winFinalSet : this.#winRegSet;
        const setTarget = this.getSetTarget(finalSet);

        let leader, min, max;
        if (nj0 < nj1) {
            leader = 1;
            min = nj0;
            max = nj1;
        } else {
            leader = 0;
            max = nj0;
            min = nj1;
        }
        const diff = max - min;
        const momentTB = this.getMomentOfTB(finalSet);

        if (momentTB < 0) {
            if (min > setTarget - 1) {
                const adj = min - setTarget + 1;
                nj0 -= adj;
                nj1 -= adj;
                max -= adj;
            }
            if (max < setTarget) {
                return winSet[srv][nj0][nj1];
            }
            if (diff > 1) {
                return Calx.finishedWinProba(leader);
            }
            nj0--;
            nj1--;
            return winSet[srv][nj0][nj1];
        }

        if (max < setTarget) {
            return winSet[srv][nj0][nj1];
        }
        if (diff > 1 || max > momentTB) {
            return Calx.finishedWinProba(leader);
        }

        const pEqual = this.#probWinSetWhenOnceEqualAndDiff2Wins(max, finalSet);
        if (max === min) {
            return pEqual;
        }
        const sp = this.probWinJeu(0);
        const rp = this.probWinJeu(1);
        if (nj0 < nj1) {
            if (srv === 0) {
                return sp * pEqual;
            }
            return rp * pEqual;
        }
        if (srv === 0) {
            return sp + (1 - sp) * pEqual;
        }
        return rp + (1 - rp) * pEqual;
    }

    probWinSetJJfsPP(nj0, nj1, finalSet, srv, np0, np1) {
        if (np0 === 0 && np1 === 0) {
            return this.probWinSet(nj0, nj1, finalSet, srv);
        }
        if (this.inTieBreak(nj0, nj1, finalSet)) {
            return this.probWinTB(np0, np1, finalSet, srv);
        }

        const preProb = this.probWinJeusPP(srv, np0, np1);
        return preProb * this.probWinSet(nj0 + 1, nj1, finalSet, 1 - srv)
                + (1 - preProb) * this.probWinSet(nj0, nj1 + 1, finalSet, 1 - srv);
    }

    probWinMatch() {
        return this.#winMatch[0][0];
    }

    probWinMatchSS(ns0, ns1) {
        if (ns0 >= this.#matchTarget) {
            return 1.0;
        }
        if (ns1 >= this.#matchTarget) {
            return 0.0;
        }
        return this.#winMatch[ns0][ns1];
    }

    probWinMatchSSsJJ(ns0, ns1, srv, nj0, nj1) {
        if (nj0 === 0 && nj1 === 0) {
            return this.probWinMatchSS(ns0, ns1);
        }
        if (ns0 >= this.#matchTarget) {
            return 1.0;
        }
        if (ns1 >= this.#matchTarget) {
            return 0.0;
        }
        const preProb = this.probWinSet(nj0, nj1, ns0 + ns1 === 2 * this.#matchTarget - 2, srv);
        const thenProb0 = this.probWinMatchSS(ns0 + 1, ns1);
        const thenProb1 = this.probWinMatchSS(ns0, ns1 + 1);
        return preProb * thenProb0 + (1 - preProb) * thenProb1;
    }

    probWinMatchSSsJJPP(ns0, ns1, srv, nj0, nj1, np0, np1) {
        if (ns0 >= this.#matchTarget) {
            return 1.0;
        }
        if (ns1 >= this.#matchTarget) {
            return 0.0;
        }
        const finalSet = ns0 + ns1 === 2 * this.#matchTarget - 2;

        const preProb = this.probWinSetJJfsPP(nj0, nj1, finalSet, srv, np0, np1);
        const thenProb0 = this.probWinMatchSS(ns0 + 1, ns1);
        const thenProb1 = this.probWinMatchSS(ns0, ns1 + 1);
        return preProb * thenProb0 + (1 - preProb) * thenProb1;
    }

    inTieBreak(nj0, nj1, finalSet) {
        if (nj0 !== nj1 || (finalSet && !this.hasLastSetTieBreak())) {
            return false;
        }
        return nj0 >= this.getMomentOfTB(finalSet);
    }

    #probWinSetWhenOnceEqualAndDiff2Wins(currentScore, finalSet) {
        const sp = this.probWinJeu(0);
        const rp = this.probWinJeu(1);
        const tau = sp + rp - 2 * sp * rp;
        const momentTB = this.getMomentOfTB(finalSet);

        if (!UtilsOther.isRoughlyZero(1 - tau)) {
            if (momentTB < 0) {
                return sp * rp / (1 - tau);
            }
            const d = momentTB - currentScore;
            const tauXPd = Math.pow(tau, d);

            const pWinByTB = tauXPd * this.probWinTB(0, 0, finalSet, Calx.#ANY);
            const pWinBeforeTB = (1 - tauXPd) / (1 - tau) * sp * rp;
            return pWinBeforeTB + pWinByTB;
        }

        if (momentTB >= 0) {
            return this.probWinTB(0, 0, finalSet, Calx.#ANY);
        }

        let a = this.#p[0];
        let b = this.#p[1];
        let sg = 1;
        if (a > 0.5) {
            a = 1.0 - a;
        } else {
            b = 1.0 - b;
            sg = -1;
        }
        const ratio = a / b;
        return 1 / (1 + Math.pow(ratio, sg * this.#jeuTarget));
    }

    static #getStationnaryValues(p0, p1) {
        const a = p0 * p1;
        const b = (1 - p0) * (1 - p1);
        const c = a / (a + b);
        return Calx.#getTrimagicalValues(p0, c);
    }

    static #getTrimagicalValues(p, c) {
        return [c, p * c, p + c - p * c];
    }

    static finishedWinProba(leader) {
        return leader === 1 ? 0.0 : 1.0;
    }
}
