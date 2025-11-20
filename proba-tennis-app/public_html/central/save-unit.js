export class SaveUnit {
    strProbas;
    rules;
    matchState;
    resAsPercentage;
    resPrecision;

    constructor(strProbas, rules, matchState, resAsPercentage, resPrecision) {
        this.strProbas = strProbas;
        this.rules = rules;
        this.matchState = matchState;
        this.resAsPercentage = resAsPercentage;
        this.resPrecision = resPrecision;
    }

    getStrProbas(player) {
        return this.strProbas[player];
    }

    getRules() {
        return this.rules;
    }

    getMatchState() {
        return this.matchState;
    }

    isResAsPercentage() {
        return this.resAsPercentage;
    }

    getResPrecision() {
        return this.resPrecision;
    }
}