import { Descriptor } from '../intools/descriptor.js';

/**
 *
 * @author desharnc27
 */
export class Csts {

    static GAME_PROBA_RAD = "P(p1 wins game)=";
    static SET_PROBA_RAD = "P(p1 wins set)=";
    static MATCH_PROBA_RAD = "P(p1 wins match)=";
    static IMPOR_PROBA_DIFF = "Next point importance =";

    static PRE_BUILT_FORMAT = new Descriptor(
            "Built-in format",
            "Choose a pre-built format that will automatically fill the parameters"
            );
    static GAME_TARGET = new Descriptor(
            "Number of points to win a game"
            );
    static ADVANTAGES = new Descriptor(
            "Play with advantages",
            "Require 2 points difference to win a game"
            );
    static REG_SET_TARGET = new Descriptor(
            "Number of games to win set",
            "The number of games a player must win to win a set"
            );
    static REG_TB_MOMENT = new Descriptor(
            "Score at which a tiebreaker is played",
            "Score at which a tiebreaker is played. Until then, a difference of two games is required to win a set."
            );
    static REG_TB_TARGET = new Descriptor(
            "Number of points to win the tiebreaker"
            );
    static FINAL_SET_TARGET = new Descriptor(
            "Number of games to win final set",
            "The number of games a player must win to win the final set"
            );
    static FINAL_TB_MOMENT = new Descriptor(
            "Score at which the final tiebreaker is played",
            "Score at which the final tiebreaker is played. Until then, a difference of two games is required to win the final set."
            );
    static FINAL_TB_TARGET = new Descriptor(
            "Number of points to win the final tiebreaker."
            );
    static MATCH_TARGET = new Descriptor(
            "Number of sets to win match."
            );

    static #ATTR = [
        Csts.GAME_TARGET,
        Csts.ADVANTAGES,
        Csts.REG_SET_TARGET,
        Csts.REG_TB_MOMENT,
        Csts.REG_TB_TARGET,
        Csts.FINAL_SET_TARGET,
        Csts.FINAL_TB_MOMENT,
        Csts.FINAL_TB_TARGET,
        Csts.MATCH_TARGET
    ];

    static getParameterDescriptor(idx) {
        return this.#ATTR[idx];
    }

    static getParameterShortDescription(idx) {
        return this.#ATTR[idx].getShortDesc();
    }

    static getParameterLongDescription(idx) {
        return this.#ATTR[idx].getLongDesc();
    }

    static #standardProbas = [
        "Hard women", "0.57", null,
        "Clay women", "0.56", null,
        "Grass women", "0.59", null,
        "Hard men", "0.66", null,
        "Clay men", "0.635", null,
        "Grass men", "0.69", null,
        "David vs Goliath", "0.55", "0.30"
    ];

    static #getNotoriusTwado(idx, mod) {
        return this.#standardProbas[3 * idx + mod];
    }

    /**
     * Retrieves the all names of notorius probabilities.
     * @returns {string[]}
     */
    static getNotoriusProbaNames() {
        const res = new Array(this.#standardProbas.length / 3);
        for (let i = 0; i < res.length; i++) {
            res[i] = this.#standardProbas[3 * i];
        }
        return res;
    }

    /**
     * Retrieves the name of a specific notorius probability.
     * @param {number} idx - The index of the probability.
     * @returns {string}
     */
    static getNotoriusProbaName(idx) {
        return this.#getNotoriusTwado(idx, 0);
    }

    /**
     * Retrieves the server value of a specific notorius probability.
     * @param {number} idx - The index of the probability.
     * @returns {string}
     */
    static getNotoriusProbaSrvValue(idx) {
        return this.#getNotoriusTwado(idx, 1);
    }

    /**
     * Retrieves the return value of a specific notorius probability.
     * @param {number} idx - The index of the probability.
     * @returns {string}
     */
    static getNotoriusProbaRetValue(idx) {
        const res = this.#getNotoriusTwado(idx, 2);
        if (res !== null) {
            return res;
        }
        return this.oppProba(this.#getNotoriusTwado(idx, 1));
    }

    /**
     * Calculates the opposite probability.
     * @param {string} probaString - The input string.
     * @returns {string}
     */
    static oppProba(probaString) {
        const firstVal = parseFloat(probaString);
        const secondVal = 1 - firstVal;

        // Determine input precision
        const precision = (probaString.split('.')[1] || '').length;

        // Format output to match input precision
        return secondVal.toFixed(precision);
    }

}
