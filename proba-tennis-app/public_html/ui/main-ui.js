// main-ui.js

// Import required custom classes
import { Rules } from '../central/rules.js';
import { MatchState } from '../central/match-state.js';
import { Calx } from '../central/calx.js';
import { Csts } from '../central/csts.js';
import { SaveUnit } from '../central/save-unit.js';
import { UtilsOther } from '../intools/utils-other.js';
import { Utils } from '../intools/utils.js';
import { StrProba } from '../intools/str-proba.js';
import { switchModal } from './ui-utils.js';
import { initBaseProbasUI } from './probas-ui.js';
// import { operationsToSwitchToRulesWindow } from './rules-ui.js';
import { operationsToSwitchToMenuWindow } from './menu-ui.js';
import { ModalNames } from './modal-names.js';
// import { initPrecisionUI } from './precision-ui.js';

// Constants for indexing
const KOL_TB_POINTS = 2;
const EDITABLE = 0;
const GAME_ON = 1;

// Global variables
let ms;
let rules;
let strProbas;
let calx;

let resPrecision;
let resAsPercentage;

// Utility function

function getRefreshButton() {
    return document.getElementById('refresh-button');
}

const REFRESH_BUTTON_EXISTS = getRefreshButton() != null;

function setText(element, value) {
    element.textContent = value;
}

function getEditableRadio() {
    return document.querySelector("input[value='editable']");
}
function getGameFlowRadio() {
    return document.querySelector("input[value='game-on']");
}

function currentlyEditable() {
    return getEditableRadio().checked;
}
function currentlyGameFlow() {
    return getGameFlowRadio().checked;
}
function setEditabilityButton(editable) {
    getEditableRadio().checked = editable;
    getGameFlowRadio().checked = !editable;
}

function getScoreArrows() {
    const container = document.getElementById('score-body');
    return container.querySelectorAll('.up, .down');
}

function getServeRadios() {
    return document.querySelectorAll('input[name="serve"]');
}
function getTBServeRadios() {
    return document.querySelectorAll('input[name="tb-serve"]');
}

function displayMessage(lines) {
    const labels = document.querySelectorAll("#results span");
    for (let i = 0; i < lines.length; i++) {
        labels[i].textContent = lines[i];
    }
    for (let i = lines.length; i < labels.length; i++) {
        labels[i].textContent = "-";
    }
}

function displayLine(line) {
    displayMessage([line]);
}

function displayScoreError(error) {
    displayMessage(["Error on scoreboard", error]);
}

export function getRules() {
    return rules;
}

function maybeRefreshPostMod() {
    if (!REFRESH_BUTTON_EXISTS || currentlyGameFlow()) {
        attemptCalculationsRefresh();
    } else {
        displayResultingProbas(null);
    }
}

//Note: parameters differ from java verison
function handleArrowClick(r, c, clickValue) {
    if (currentlyEditable()) {
        adjustValue(r, c, clickValue);
        maybeRefreshPostMod();
    } else if (currentlyGameFlow()) {
        if (c !== 2 || ms.matchIsOver()) {
            return;
        }
        updateMatch(r);
    }
}

function toggleModeEditableWithoutButton() {
    setEditabilityButton(true);
    toggleMode(EDITABLE);
}

function toggleMode(mode) {
    const editable = mode === EDITABLE;

    if (!editable) {
        const doable = attemptCalculationsRefresh();
        if (!doable) {
            setEditabilityButton(true);
            return;
        }
    }

    if (REFRESH_BUTTON_EXISTS) {
        getRefreshButton().disabled = !editable;
    }
    const scoreButtons = getScoreArrows();
    scoreButtons.forEach((button, index) => {
        button.disabled = !editable && !(index % 6 === 4);
    });

    updateServeEnablingDisplay();
}

function updateMatch(player) {
    if (player >= 0) {
        ms.scorePoint(player);
    }
    computeAndDisplayProbas();
    updateScoreDisplay();
}

function displayResultingProbas(values) {
    const titles = [
        Csts.GAME_PROBA_RAD,
        Csts.SET_PROBA_RAD,
        Csts.MATCH_PROBA_RAD,
        Csts.IMPOR_PROBA_DIFF
    ];
    let message = [];
    for (let i = 0; i < 4; i++) {
        const value = values === null ? " ? " : Utils.probaFormat(values[i], resPrecision, resAsPercentage);
        message.push(`${titles[i]} ${value}`);
    }
    displayMessage(message);
}

function computeAndDisplayProbas() {
    if (ms.matchIsOver()) {
        displayMessage([
            "Match is done",
            "And your winner is...",
            "Player " + (ms.winner() + 1) + " !!"
        ]);
        return;
    }

    const msPostW = ms.successor(0);
    const msPostL = ms.successor(1);

    const values = [
        ms.probWinJeuOrTB(),
        ms.probWinSet(),
        ms.probWinMatch(),
        msPostW.probWinMatch() - msPostL.probWinMatch()
    ];
    displayResultingProbas(values);
}

function adjustValue(player, category, delta) {
    switch (category) {
        case 0:
            ms.editMatch(player, delta);
            break;
        case 1:
            ms.editSet(player, delta);
            break;
        case 2:
            ms.editJeuOrTB(player, delta);
            break;
        default:
            console.error('Invalid category');
    }
    updateScoreDisplay();
}

function updateServeEnablingDisplay() {
    const inTieBreak = ms.inTieBreak();

    getServeRadios().forEach((radio, index) => {
        radio.disabled = !currentlyEditable();
        radio.checked = ms.getSrv() === index;
    });

    getTBServeRadios().forEach((radio, index) => {
        radio.disabled = !inTieBreak || !currentlyEditable();
        radio.checked = ms.getSrvTB() === index;
    });
}

function updateScoreDisplay() {
    const inTieBreak = ms.inTieBreak();
    const scoreSpans = document.querySelectorAll("#score-body span");

    for (let py = 0; py < 2; py++) {
        setText(scoreSpans[py * 3], ms.getInMatchCurrentScoreOf(py)); // Match Score
        setText(scoreSpans[py * 3 + 1], ms.getInSetCurrentScoreOf(py)); // Set Score

        let val = ms.getInJeuOrTBCurrentScoreOf(py);
        if (!inTieBreak) {
            val = MatchState.convertJeuDisplay(val);
        }
        setText(scoreSpans[py * 3 + 2], val); // Game/Tiebreak Score
    }
    updateServeEnablingDisplay();
}


function attemptCalculationsRefresh() {
    const message = ms.detectError();
    if (message) {
        displayScoreError(message);
        return false;
    }
    computeAndDisplayProbas();
    return true;
}

/*function attemptOrDispNull(){
 if ()
 }*/

export function handleRulesInput(newRules) {
    setRPM(newRules, strProbas[0], strProbas[1], ms);
    toggleModeEditableWithoutButton();
    maybeRefreshPostMod();
    // updateScoreDisplay();
}

export function handleBaseProbasInput(serveProb, returnProb) {
    setRPM(rules, serveProb, returnProb, ms);
    maybeRefreshPostMod();
    /*if (currentlyEditable()) {
     const message = ms.detectError();
     if (message) {
     displayResultingProbas(null);
     return;
     }
     }
     updateMatch(-1);*/
    refreshBaseProbaDisplay();//TODO notify edit

}

export function updatePrecisionValues(asPercentageX, precisionX) {

    resAsPercentage = asPercentageX;
    resPrecision = precisionX;
    maybeRefreshPostMod();
    // displayResultingProbas(null);
}

function refreshBaseProbaDisplay() {//TODO notify edit
    // This method is left as empty placeholder
    // This function is meant to show the current base probas on ui.
    // But I'm not sure I want it, so the fct is empty for now  
}

function setRPM(newRules, serveProb, returnProb, protoMS = null) {
    rules = newRules;
    strProbas = [serveProb, returnProb];
    calx = new Calx(rules, StrProba.getAllValues(strProbas));
    ms = protoMS ? new MatchState(calx, protoMS) : MatchState.fromStart(calx);
}

function openRulesUI() {
    operationsToSwitchToRulesWindow(rules);
}

function openBaseProbasUI() {
    switchModal(ModalNames.getMain(), ModalNames.getProbas());
    initBaseProbasUI(StrProba.getAllStrings(strProbas));
}

function openMenuUI() {
    operationsToSwitchToMenuWindow(rules, strProbas, resPrecision, resAsPercentage);
}

export function getBaseProbaStrings() {
    return StrProba.getAllStrings(strProbas);
}


// Initialization logic
setRPM(Rules.createRuleById(0),
        StrProba.attemptBuild("0.6"),
        StrProba.attemptBuild("0.4")
        , null);
updateScoreDisplay();
refreshBaseProbaDisplay();
toggleMode(EDITABLE);

// Adding event listeners

// Mode Selection
getEditableRadio().addEventListener('change', () => toggleMode(EDITABLE));
getGameFlowRadio().addEventListener('change', () => toggleMode(GAME_ON));

// Refresh Button
if (REFRESH_BUTTON_EXISTS) {
    getRefreshButton().addEventListener('click', attemptCalculationsRefresh);
}

// Match State Buttons
// In comments show a remove featured of wheighting click initiative
// let lastClickIdx = -1;
// let lastClickTime = Date.now();
// let powerClick = 0;
getScoreArrows().forEach((button, index) => {
    const preSg = index % 2;
    let rest = (index - preSg) / 2;
    const category = rest % 3;
    const player = (rest - category) / 3;
    const sg = 1 - 2 * preSg;

    button.addEventListener('click', (e) => {
        /*let time = Date.now();
         if (index !== lastClickIdx) {
         powerClick = 0;
         } else {
         powerClick += 1 - (time - lastClickTime) / 750;
         if (powerClick < 0) {
         powerClick = 0;
         }
         }
         lastClickIdx = index;
         lastClickTime = time;
         handleArrowClick(player, category, sg * Math.floor(1 + powerClick));*/
        handleArrowClick(player, category, sg);
    });
});

function srvRadioTriggered(forTB, index) {
    if (forTB) {
        ms.editSrvTB(index);
    } else {
        ms.editSrv(index);
    }
    if (ms.inTieBreak() === forTB) {
        maybeRefreshPostMod();
    }
}



// Serve Selection
getServeRadios().forEach((radio, index) => {
    radio.addEventListener('change', () => srvRadioTriggered(false, index));
});

getTBServeRadios().forEach((radio, index) => {
    radio.addEventListener('change', () => srvRadioTriggered(true, index));
});

document.getElementById('menu').addEventListener('click', openMenuUI);

function closeSaveOps() {
    // debugger;
    try {
        const su = new SaveUnit(strProbas, rules, ms, resAsPercentage, resPrecision);
        let jsonStr = JSON.stringify(su);
        localStorage.setItem("saveUnit", jsonStr);
        // alert('closeSaveOps() performed');
    } catch (e) {
        console.error("closeSaveOps():", e);
    }

}

function loadSaveOps() {
    // debugger;
    const jsonSU = localStorage.getItem("saveUnit");

    if (!jsonSU) {
        setRPM(Rules.createRuleById(0),
                StrProba.attemptBuild("0.6"),
                StrProba.attemptBuild("0.4"),
                null);
        resAsPercentage = true;
        resPrecision = 3;
    } else {
        const su = JSON.parse(jsonSU);

        let tempMs = su.matchState;
        let tempRules = su.rules;
        setRPM(tempRules,
                StrProba.attemptBuild(su.strProbas[0].str),
                StrProba.attemptBuild(su.strProbas[1].str),
                tempMs);
        resAsPercentage = su.resAsPercentage;
        resPrecision = su.resPrecision;
    }
    updateScoreDisplay();
    maybeRefreshPostMod();


}


window.addEventListener('beforeunload', () => {
    closeSaveOps();
});

// Load it back when page opens again
window.addEventListener('DOMContentLoaded', () => {
    loadSaveOps();
});