export class ModalNames {

    static #ABOUT = "about-modal";
    static #MAIN = "main-modal";
    static #OPTIONS = "options-modal";
    static #RULES = "rules-modal";
    static #PROBAS = "probas-modal";
    static #PRECISION = "precision-modal";

    static getAbout() {
        return this.#ABOUT;
    }
    static getMain() {
        return this.#MAIN;
    }
    static getOptions() {
        return this.#OPTIONS;
    }
    static getRules() {
        return this.#RULES;
    }
    static getProbas() {
        return this.#PROBAS;
    }
    static getPrecision() {
        return this.#PRECISION;
    }
}