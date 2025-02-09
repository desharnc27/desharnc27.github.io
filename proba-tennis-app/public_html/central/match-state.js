import { Utils } from '../intools/utils.js'

export class MatchState {
    #calx;

    #inJeuCurrentScore;
    #inSetCurrentScore;
    #inMatchCurrentScore;
    #srv;
    #srvTB;
    // private int winner;

    constructor(calx, ms) {
        if (calx == null) {
            throw new Error("You can't create match state with empty calx");
        }
        this.#calx = calx;
        if (ms == null) {
            this.#inJeuCurrentScore = [0, 0];
            this.#inSetCurrentScore = [0, 0];
            this.#inMatchCurrentScore = [0, 0];
            this.#srv = 0;
            this.#srvTB = 0;
        } else {
            this.#inJeuCurrentScore = ms.#inJeuCurrentScore.slice(0, 2);
            this.#inSetCurrentScore = ms.#inSetCurrentScore.slice(0, 2);
            this.#inMatchCurrentScore = ms.#inMatchCurrentScore.slice(0, 2);
            this.#srv = ms.#srv;
            this.#srvTB = ms.#srvTB;
        }
    }

    copy() {
        return new MatchState(this.#calx, this);
    }

    successor(nextPointWinner) {
        const ms = this.copy();
        ms.scorePoint(nextPointWinner);
        return ms;
    }

    static fromStart(calx) {
        return new MatchState(calx, null);
    }

    actualSet() {
        return this.#inMatchCurrentScore[0] + this.#inMatchCurrentScore[1];
    }

    inLastSet() {
        return this.actualSet() === this.#calx.getMatchTarget() * 2 - 2;
    }

    setHasTieBreak() {
        return (!this.inLastSet() || this.#calx.hasLastSetTieBreak());
    }

    inTieBreak() {
        return this.#calx.inTieBreak(this.#inSetCurrentScore[0], this.#inSetCurrentScore[1], this.inLastSet());
    }

    scorePoint(player) {
        this.#inJeuCurrentScore[player]++;
        if (this.inTieBreak()) {
            if ((this.#inJeuCurrentScore[0] + this.#inJeuCurrentScore[1]) % 2 === 1) {
                this.#srvTB = 1 - this.#srvTB;
            }
        } else if (this.#calx.hasAdvantages()) {
            const target = this.#calx.getJeuTarget();
            if (this.#inJeuCurrentScore[player] === target && this.#inJeuCurrentScore[1 - player] === target - 1) {
                this.#inJeuCurrentScore[player]--;
                this.#inJeuCurrentScore[1 - player]--;
            }
        }

        if (this.jeuIsDone()) {
            this.scoreJeu(player);
        }
    }

    jeuIsDone() {
        for (let p = 0; p < 2; p++) {
            const inTieBreak = this.inTieBreak();
            const targetScore = inTieBreak ? this.#calx.getTBTarget(this.inLastSet()) : this.#calx.getJeuTarget();
            const requiredDiff = this.#calx.hasAdvantages() || inTieBreak ? 2 : 1;
            if (this.#inJeuCurrentScore[p] >= targetScore && (this.#inJeuCurrentScore[p] - this.#inJeuCurrentScore[1 - p]) >= requiredDiff) {
                return true;
            }
        }
        return false;
    }

    scoreJeu(player) {
        this.#inSetCurrentScore[player]++;
        Utils.initialize(this.#inJeuCurrentScore);
        this.#srv = 1 - this.#srv;
        if (this.inTieBreak()) {
            this.#srvTB = this.#srv;
        }

        if (this.setIsDone()) {
            this.scoreSet(player);
        }
    }

    setIsDone() {
        let diff = this.#inSetCurrentScore[0] - this.#inSetCurrentScore[1];
        if (diff === 0) {
            return false;
        }

        let leader = 0;

        if (diff < 0) {
            leader = 1;
            diff = -diff;
        }
        const leadScore = this.#inSetCurrentScore[leader];
        const finalSet = this.inLastSet();
        const setTarget = this.#calx.getSetTarget(finalSet);
        if (this.#inSetCurrentScore[leader] < setTarget) {
            return false;
        }

        return diff > 1 || (this.setHasTieBreak() && leadScore > this.#calx.getMomentOfTB(finalSet));
    }

    scoreSet(player) {
        this.#inMatchCurrentScore[player]++;
        Utils.initialize(this.#inJeuCurrentScore);
        Utils.initialize(this.#inSetCurrentScore);
        //updateGameTermination();
    }

    matchIsOver() {
        return this.winner() != -1;
    }

    winner() {
        for (let i = 0; i < 2; i++) {
            if (this.#inMatchCurrentScore[i] === this.#calx.getMatchTarget()) {
                return i;
            }
        }
        return -1;
    }

    getSrv() {
        return this.#srv;
    }

    getSrvTB() {
        return this.#srvTB;
    }

    getRealSrv() {
        return this.inTieBreak() ? this.#srvTB : this.#srv;
    }

    probWinPoint() {
        return this.#calx.getP()[this.getRealSrv()];
    }

    probWinJeuOrTB() {
        if (this.inTieBreak()) {
            return this.#calx.probWinTB(this.#inJeuCurrentScore[0], this.#inJeuCurrentScore[1], this.inLastSet(), this.#srvTB);
        }
        return this.#calx.probWinJeusPP(this.#srv, this.#inJeuCurrentScore[0], this.#inJeuCurrentScore[1]);
    }

    probWinSet() {
        return this.#calx.probWinSetJJfsPP(
                this.#inSetCurrentScore[0],
                this.#inSetCurrentScore[1],
                this.inLastSet(),
                this.getRealSrv(),
                this.#inJeuCurrentScore[0],
                this.#inJeuCurrentScore[1]);
    }

    probWinMatch() {
        return this.#calx.probWinMatchSSsJJPP(
                this.#inMatchCurrentScore[0],
                this.#inMatchCurrentScore[1],
                this.getRealSrv(),
                this.#inSetCurrentScore[0],
                this.#inSetCurrentScore[1],
                this.#inJeuCurrentScore[0],
                this.#inJeuCurrentScore[1]
                );
    }

    getInJeuOrTBCurrentScore() {
        return this.#inJeuCurrentScore.slice(0, 2);
    }

    //
    getInJeuOrTBCurrentScoreOf(player) {
        return this.#inJeuCurrentScore[player];
    }

    getInSetCurrentScore() {
        return this.#inSetCurrentScore.slice(0, 2);
    }

    //
    getInSetCurrentScoreOf(player) {
        return this.#inSetCurrentScore[player];
    }

    //
    getInMatchCurrentScore() {
        return this.#inMatchCurrentScore.slice(0, 2);
    }

    getInMatchCurrentScoreOf(player) {
        return this.#inMatchCurrentScore[player];
    }

    toString() {
        const serv = ['S', 'r'];
        if (this.getRealSrv() === 1) {
            [serv[0], serv[1]] = [serv[1], serv[0]];
        }
        const inTieBreak = this.inTieBreak();

        let jeuScore = this.getInJeuOrTBCurrentScore();
        if (!inTieBreak) {
            jeuScore = MatchState.convertBiJeuDisplay(jeuScore);
        }

        const lines = [
            "Current:",
            JSON.stringify(serv),
            JSON.stringify(jeuScore),
            JSON.stringify(this.getInSetCurrentScore()),
            JSON.stringify(this.getInMatchCurrentScore())
        ];
        return lines.join("\n");
    }

    //
    static convertBiJeuDisplay(inArr) {
        return inArr.map(value => MatchState.convertJeuDisplay(value));
    }

    static convertJeuDisplay(inVal) {
        if (inVal < 2) {
            return inVal === 1 ? 15 : 0;
        }
        return (inVal + 1) * 10;
    }

    //These methods are for editing ms, not simulating a game!
    detectError() {
        let target = this.#calx.getMatchTarget();
        if (!MatchState.generalValid(this.#inMatchCurrentScore, target, target - 1)) {
            return "Invalid number of sets";
        }
        const finalSet = this.inLastSet();
        target = this.#calx.getSetTarget(finalSet);
        if (!MatchState.generalValid(this.#inSetCurrentScore, target, this.#calx.getMomentOfTB(finalSet))) {
            return "Invalid in-set score";
        }
        let message;
        let highestUnfinish;
        if (this.inTieBreak()) {
            target = this.#calx.getTBTarget(finalSet);
            highestUnfinish = -1;
            message = "Invalid tiebreaker score";
        } else {
            target = this.#calx.getJeuTarget();
            highestUnfinish = target - 1;
            message = "Invalid in-game score";
        }

        if (!MatchState.generalValid(this.#inJeuCurrentScore, target, highestUnfinish)) {
            return message;
        }
        return null;
    }

    static generalValid(arr, target, highestUnfinish) {
        let leader = arr[0] < arr[1] ? 1 : 0;
        let behinder = 1 - leader;

        if (arr[behinder] < 0) {
            return false;
        }
        if (arr[leader] < target) {
            return true;
        }
        if (highestUnfinish >= 0 && arr[leader] > highestUnfinish) {
            return false;
        }
        return (arr[leader] - arr[behinder]) < 2;
    }

    static generalEdit(arr, player, change) {
        arr[player] += change;
        if (arr[player] < 0) {
            arr[player] = 0;
        }
    }

    editMatch(player, change) {
        MatchState.generalEdit(this.#inMatchCurrentScore, player, change);
    }

    editSet(player, change) {
        MatchState.generalEdit(this.#inSetCurrentScore, player, change);
    }

    editJeuOrTB(player, change) {
        MatchState.generalEdit(this.#inJeuCurrentScore, player, change);
    }

    editSrv(srv) {
        this.#srv = srv;
    }

    editSwitchSrv() {
        this.editSrv(1 - this.#srv);
    }

    editSrvTB(srvTB) {
        this.#srvTB = srvTB;
    }

    editSwitchSrvTB() {
        this.editSrvTB(1 - this.#srvTB);
    }
}
