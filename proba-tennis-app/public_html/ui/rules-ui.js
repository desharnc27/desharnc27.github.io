// rules-ui.js

// Import dependencies
import { IntervalParamGadget } from '../paramgadget/interval-param-gadget.js';
import { DescriptiveParamGadget } from '../paramgadget/descriptive-param-gadget.js';
import { TBTargetParamGadget } from '../paramgadget/tb-target-param-gadget.js';
import { ParamGadget } from '../paramgadget/param-gadget.js';
import { Csts } from '../central/csts.js';
import { Rules } from '../central/rules.js';
import { switchModal, populateDropdown, resetDropdown } from './ui-utils.js';
import { handleRulesInput} from './main-ui.js';
import { ModalNames } from './modal-names.js';

// Constants
const GAME_TARGET_IDNUM = 0;
const ADVANTAGES_IDNUM = 1;

const REG_SET_TARGET_IDNUM = 2;
const REG_TB_MOMENT_IDNUM = 3;
const REG_TB_TARGET_IDNUM = 4;

const FINAL_SET_TARGET_IDNUM = 5;
const FINAL_TB_MOMENT_IDNUM = 6;
const FINAL_TB_TARGET_IDNUM = 7;

const MATCH_TARGET_IDNUM = 8;
const NB_OPT = 9;

const RULES_DROPDOWN_ID = 'builtin-rules';

// Global Variables
//type(attributes) = ParamGadget []
let attributes = Array(NB_OPT).fill(null);



// Functions

function setDetails(text) {
    const detailElement = document.getElementById('rules-explanation');
    detailElement.textContent = text;
}
function setDetailsByIdx(descIdx) {
    setDetails(Csts.getParameterDescriptor(descIdx).getLongDesc());
}
function setDefaultDetails() {
    setDetails("Click any label for a more detailed explanation");
}

function injectRules(rules) {
    attributes[GAME_TARGET_IDNUM].set(rules.sizeOfJeu);
    attributes[ADVANTAGES_IDNUM].set(rules.advantages ? 1 : 0);

    attributes[REG_SET_TARGET_IDNUM].set(rules.sizeOfRegSet);
    attributes[REG_TB_MOMENT_IDNUM].set(rules.gapRegTB);
    attributes[REG_TB_TARGET_IDNUM].set(rules.sizeOfRegTB);

    attributes[FINAL_SET_TARGET_IDNUM].set(rules.sizeOfFinalSet);
    attributes[FINAL_TB_MOMENT_IDNUM].set(rules.gapFinalTB);
    attributes[FINAL_TB_TARGET_IDNUM].set(rules.sizeOfFinalTB);

    attributes[MATCH_TARGET_IDNUM].set(rules.sizeOfMatch);
}
function rulesUiSetup() {
    console.log("rulesInit(rules)  called");
    attributes[GAME_TARGET_IDNUM] = new IntervalParamGadget(Csts.GAME_TARGET, 2, 9);
    attributes[ADVANTAGES_IDNUM] = DescriptiveParamGadget.yesNoRUI(Csts.ADVANTAGES);

    attributes[REG_SET_TARGET_IDNUM] = new IntervalParamGadget(Csts.REG_SET_TARGET, 1, 13);
    attributes[REG_TB_MOMENT_IDNUM] = new TBTargetParamGadget(Csts.REG_TB_MOMENT, false, 15, 6);
    attributes[REG_TB_TARGET_IDNUM] = new IntervalParamGadget(Csts.REG_TB_TARGET, 5, 13);

    attributes[FINAL_SET_TARGET_IDNUM] = new IntervalParamGadget(Csts.FINAL_SET_TARGET, 1, 16);
    attributes[FINAL_TB_MOMENT_IDNUM] = new TBTargetParamGadget(Csts.FINAL_TB_MOMENT, true, 15, 6);
    attributes[FINAL_TB_TARGET_IDNUM] = new IntervalParamGadget(Csts.FINAL_TB_TARGET, 5, 16);

    attributes[MATCH_TARGET_IDNUM] = new IntervalParamGadget(Csts.REG_SET_TARGET, 1, 5);

    // Set up listeners for each arrow button
    for (let i = 0; i < NB_OPT; i++) {
        const upButton = document.querySelector(`button.up[data-attribute="${parameterIds[i]}"]`);
        const downButton = document.querySelector(`button.down[data-attribute="${parameterIds[i]}"]`);

        if (upButton && downButton) {
            upButton.addEventListener('click', () => iterate(i, true));
            downButton.addEventListener('click', () => iterate(i, false));

            // Add hover listeners for the details display
            const rowElement = upButton.closest('tr');
            /*rowElement.addEventListener('mouseover', () => {
             setDetailsByIdx(i);
             });
             
             rowElement.addEventListener('mouseleave', () => {
             setDefaultDetails();
             });*/
            rowElement.addEventListener('click', () => {
                setDetailsByIdx(i);
            });
        }
    }
    document.getElementById('rules-table').addEventListener('click', (e) => {
        if (!e.target.closest('tr')) {
            setDefaultDetails();
        }
    });
}

function copyRegToFinal() {
    const srcStart = REG_SET_TARGET_IDNUM;
    const destStart = FINAL_SET_TARGET_IDNUM;

    for (let i = 0; i < 3; i++) {
        const val = attributes[srcStart + i].getCurrentIdx();
        attributes[destStart + i].set(val);
    }
    for (let i = 0; i < 3; i++) {
        refreshAttributeDisplay(destStart + i);
    }
}

function extractNewRules() {
    return new Rules(
            attributes[GAME_TARGET_IDNUM].getCurrentIdx(),
            attributes[ADVANTAGES_IDNUM].getCurrentIdx() === 1,
            attributes[REG_SET_TARGET_IDNUM].getCurrentIdx(),
            attributes[REG_TB_MOMENT_IDNUM].getCurrentIdx(),
            attributes[REG_TB_TARGET_IDNUM].getCurrentIdx(),
            attributes[FINAL_SET_TARGET_IDNUM].getCurrentIdx(),
            attributes[FINAL_TB_MOMENT_IDNUM].getCurrentIdx(),
            attributes[FINAL_TB_TARGET_IDNUM].getCurrentIdx(),
            attributes[MATCH_TARGET_IDNUM].getCurrentIdx()
            );
}

function iterate(attr, up) {
    const change = up ? attributes[attr].inc() : attributes[attr].dec();
    if (change) {
        resetDropdown(RULES_DROPDOWN_ID);
        refreshAttributeDisplay(attr);
    }
}

function refreshAttributeDisplay(attr) {
    const valueSpan = document.getElementById(parameterIds[attr]); // Access the corresponding DOM element
    if (valueSpan) {
        valueSpan.textContent = attributes[attr].getCurrentValue(); // Update the displayed value
    }
    if (attr === REG_SET_TARGET_IDNUM || attr === FINAL_SET_TARGET_IDNUM) {
        const newTarget = attributes[attr].getCurrentIdx();
        const tbTarget = attributes[attr + 1];
        tbTarget.setSetTarget(newTarget);
        refreshAttributeDisplay(attr + 1);
    }
}

function refreshAllAttributesDisplays() {
    for (let i = 0; i < NB_OPT; i++) {
        refreshAttributeDisplay(i);
    }
}

function selectBuiltinFormat() {
    // Placeholder for future functionality
}

// Add listener for "Copy Regular to Final" button
const copyRegToFinalButton = document.getElementById('copy-regular-to-final');
if (copyRegToFinalButton) {
    copyRegToFinalButton.addEventListener('click', copyRegToFinal);
}

// Add listener for "Close and Apply" button
const applyRulesButton = document.getElementById('apply-rules');
if (applyRulesButton) {
    applyRulesButton.addEventListener('click', () => {
        const newRules = extractNewRules();
        handleRulesInput(newRules);
        switchModal(ModalNames.getRules(), ModalNames.getMain());
    });
}

// Add listener for "Cancel" button
const cancelRulesButton = document.getElementById('cancel-rules');
if (cancelRulesButton) {
    cancelRulesButton.addEventListener('click', () => {
        switchModal(ModalNames.getRules(), ModalNames.getMain());
    });
}



//All below code rolls only once


const parameterIds = [
    "game-target",
    "advantages",
    "reg-set-target",
    "reg-tb-moment",
    "reg-tb-target",
    "final-set-target",
    "final-tb-moment",
    "final-tb-target",
    "match-target"
];

function setupRulesHTML() {
    console.log("setupRulesTable()  called");
    const rulesTable = document.getElementById('rules-table');
    if (!rulesTable) {
        console.error('Rules table element not found.');
        return;
    }

    // Clear existing rows (if any)
    rulesTable.innerHTML = '';
    //setTimeout(() => {
    // Loop through parameters by index
    for (let i = 0; i < parameterIds.length; i++) {
        const row = document.createElement('tr');

        // Label cell (from descriptor index)
        const labelCell = document.createElement('td');
        labelCell.textContent = Csts.getParameterShortDescription(i);
        row.appendChild(labelCell);

        // Value cell (placeholder for dynamic updates)
        const valueCell = document.createElement('td');
        const valueSpan = document.createElement('span');
        valueSpan.id = parameterIds[i];
        valueSpan.textContent = ''; // Will be filled dynamically
        valueCell.appendChild(valueSpan);
        row.appendChild(valueCell);

        // Buttons cell
        const buttonsCell = document.createElement('td');
        buttonsCell.innerHTML = `
            <button class="down" data-attribute="${parameterIds[i]}">↓</button>
            <button class="up" data-attribute="${parameterIds[i]}">↑</button>
        `;
        row.appendChild(buttonsCell);

        rulesTable.appendChild(row);
    }
    //}, 0);
}

export function operationsToSwitchToRulesWindow(rules) {
    injectRules(rules);
    refreshAllAttributesDisplays();
    setDefaultDetails();
}

function actionWhenBuiltinFormatChosen(chosenIndex) {
    const newRules = Rules.createRuleById(chosenIndex);
    injectRules(newRules);
    refreshAllAttributesDisplays();
}
setupRulesHTML();
rulesUiSetup();
populateDropdown(RULES_DROPDOWN_ID, Rules.getAllRuleNames(), actionWhenBuiltinFormatChosen);
