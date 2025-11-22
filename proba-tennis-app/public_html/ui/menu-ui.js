import { switchModal, populateDropdown, resetDropdown } from './ui-utils.js';
import { operationsToSwitchToRulesWindow } from './rules-ui.js';
import { operationsToSwitchToPrecisionWindow } from './precision-ui.js';
import { initBaseProbasUI } from './probas-ui.js';
import { StrProba } from '../intools/str-proba.js';
import { handleAboutRequest } from './about-ui.js';
import { ModalNames } from './modal-names.js';

/**
 * Class representing a menu item with associated information and behavior.
 */
class MenuItemInfo {
    #htmld;
    #name;
    #calledFct;
    #explanation;

    /**
     * Creates an instance of MenuItemInfo.
     * @param {string} htmld - The HTML ID associated with the menu item.
     * @param {string} name - The display name of the menu item.
     * @param {Function} calledFct - The function to execute when the menu item is clicked.
     * @param {string} explanation - A detailed explanation of the menu item.
     * 
     */
    constructor(htmld, name, calledFct, explanation = null) {
        this.#htmld = htmld;
        this.#name = name;
        this.#calledFct = calledFct;
        if (explanation === null) {
            this.#explanation = name;
        } else {
            this.#explanation = explanation;
    }
    }

    /**
     * Gets the HTML ID of the menu item.
     * @returns {string} The HTML ID.
     */
    getHtmlId() {
        return this.#htmld;
    }

    /**
     * Gets the name of the menu item.
     * @returns {string} The name.
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets the explanation of the menu item.
     * @returns {string} The explanation.
     */
    getExplanation() {
        return this.#explanation;
    }

    /**
     * Gets the function to be executed when the menu item is clicked.
     * @returns {Function} The function.
     */
    getCalledFct() {
        return this.#calledFct;
    }
}


let rules;
let strProbas;
let precision;
let asPercentage;

const AUTHOR = "author";

export function  operationsToSwitchToMenuWindow(
        borrowedRules,
        borrowedStrProbas,
        borrowedPrecision,
        borrowedAsPercentage) {
    console.log("operationsToSwitchToMenuWindow(...)");
    rules = borrowedRules;
    strProbas = borrowedStrProbas;
    precision = borrowedPrecision;
    asPercentage = borrowedAsPercentage;
    switchModal(ModalNames.getMain(), ModalNames.getOptions());
}

let tempStr = "There, you can change the probability of winning a single point. Both on serve and return. \n\
These values form the bases of all calculations in this app.";
let infoBaseProbas = new MenuItemInfo(
        "edit-probas-button",
        "Edit Base Probabilities",
        function () {
            initBaseProbasUI(StrProba.getAllStrings(strProbas));
            switchModal(ModalNames.getOptions(), ModalNames.getProbas());
        },
        tempStr,
        );

tempStr = "You can edit the match format there (number of sets to win a match, number of games to win a set, etc.)";
let infoRules = new MenuItemInfo(
        "edit-rules-button",
        "Edit Match Format",
        function () {
            operationsToSwitchToRulesWindow(rules);
            switchModal(ModalNames.getOptions(), ModalNames.getRules());
        },
        tempStr,
        );

let infoPrecision = new MenuItemInfo(
        "menu-precision-button",
        "Edit Displayed Precision",
        function () {
            operationsToSwitchToPrecisionWindow(asPercentage, precision);
            switchModal(ModalNames.getOptions(), ModalNames.getPrecision());
        },
        "Change the display type (percentage or /1) and the precision of the resulting probabilities"
        );
let infoTheme = new MenuItemInfo(
        "menu-theme-button",
        "Switch luminosity",
        function () {
            document.body.classList.toggle("dark-theme");
            switchModal(ModalNames.getOptions(), ModalNames.getMain());
        },
        "Switches froma light them to dark theme and vice-versa"
        );

let infoAbout = new MenuItemInfo(
        "menu-about-button",
        "About",
        function () {
            switchModal(ModalNames.getOptions(), ModalNames.getAboutOptions());
        },
        "Learn about the project"
        );

function getProjectInfos() {
    let projectInfos = [null, null];
    let langnames = ["English", "Français"];
    let langs = ["eng", "fra"];
    for (let i = 0; i < 2; i++) {
        projectInfos[i] = new MenuItemInfo(
                "menu-!-about-button".replace("!", langs[i]),
                "About the project (!)".replace("!", langnames[i]),
                function () {
                    handleAboutRequest(langs[i]);
                },
                "(in !)Read more about app. How does it work, how realistic is the theory \n\
behind the calculations, etc...".replace("!", langnames[i])
                );
    }
    return projectInfos;
}

function getBackInfos() {
    let backInfos = [null, null];
    let fromModal = [ModalNames.getOptions(), ModalNames.getAboutOptions()];
    let toModal = [ModalNames.getMain(), ModalNames.getOptions()];
    for (let i = 0; i < 2; i++) {
        backInfos[i] = new MenuItemInfo(
                "menu-!-back-button".replace("!", i),
                "Back",
                function () {
                    switchModal(fromModal[i], toModal[i]);
                },
                "Go back to the previous window"
                );
    }
    return backInfos;
}

let projectInfos = getProjectInfos();

let personalInfo = new MenuItemInfo(
        "menu-personal-button",
        "About the author",
        function () {
            handleAboutRequest(AUTHOR);
        },
        "Read more about the author of this website."
        );

let infoBacks = getBackInfos();

let centralItems = [
    infoBacks[0],
    infoBaseProbas,
    infoRules,
    infoPrecision,
    infoTheme,
    infoAbout,
    infoBacks[0]];

let aboutItems = [
    // infoBacks[1],
    projectInfos[0],
    projectInfos[1],
    personalInfo,
    infoBacks[1]];

// debug code for items hidden
/*
 let troloSize = 500;
 let debugAdder = [];
 debugAdder.length = troloSize; 
 for(let i = 0;i< troloSize;i++){
 let trololo =  new MenuItemInfo(
 "menu-troll-button-" + i,
 "trololo" + i,
 function () {
 switchModal(ModalNames.getOptions(), ModalNames.getMain());
 },
 "Mother fkin test"
 );
 debugAdder[i] = trololo;
 }
 
 
 items = [...debugAdder, ...items];
 */

function displayExplanations(boxName, infoItem) {
    document.getElementById(boxName).textContent = infoItem.getExplanation();
}
function displayCentralExplanations(infoItem) {
    displayExplanations("options-explanation", infoItem);
}
function displayAboutExplanations(infoItem) {
    displayExplanations("options-about-explanation", infoItem);
}



let buttonGroupsNames = ["menu-buttons", "menu-about-buttons"];
let boxExplaningNames = ["options-explanation", "options-about-explanation"];
let itemGroups = [centralItems, aboutItems];
for (let i = 0; i < 2; i++) {
    let buttonsContainer = document.getElementById(buttonGroupsNames[i]);
    let itemGroup = itemGroups[i];
    itemGroup.forEach((infoItem, index) => {
        // Create a button element
        const button = document.createElement('button');

        // Set the button's id and text
        button.id = infoItem.getHtmlId();
        button.textContent = infoItem.getName();

        // Add a click event listener to trigger the calledFct
        button.addEventListener('click', () => {
            console.log("button.addEventListener");
            const action = infoItem.getCalledFct();
            if (typeof action === 'function') {
                action();
            } else {
                console.error(`calledFct for ${infoItem.getName()} is not a valid function.`);
            }
        });

        button.addEventListener('pointerenter', () => {
            displayExplanations(boxExplaningNames[i], infoItem);
        });

        // Append the button to the DOM (e.g., to a container element)
        buttonsContainer.appendChild(button); // Replace `document.body` with your specific container
    });

    buttonsContainer.scrollTop = 0; // Reset scroll position
    buttonsContainer.scrollHeight; // Trigger reflow

}

