import { switchModal } from './ui-utils.js';
import { ModalNames } from './modal-names.js';
import { updatePrecisionValues } from './main-ui.js';
import { Utils } from '../intools/utils.js';


const DENOM_GROUP_ID = "denominator-buttons-container";
const PRECISION_GROUP_ID = "precision-buttons-container";
//const PERCENTAGE_VALUE = "percentage";
//const PROPORTION_VALUE = "precision";

let precision = 3;
let asPercentage = true;

const LOW_PREC = 2;

function leaveModal() {
    switchModal(ModalNames.getPrecision(), ModalNames.getMain());
}
function handleApplyClicked() {
    updatePrecisionValues(asPercentage, precision);
    leaveModal();
}

function updateExample() {
    const number = 3 / 7;
    const numberStr = "3\u00F77";
    const line = numberStr + " = " + Utils.probaFormat(number, precision, asPercentage);
    const example = document.getElementById("precision-example-display");
    example.textContent = line;
}

export function operationsToSwitchToPrecisionWindow(asPercentageX, precisionX) {

    asPercentage = asPercentageX;
    precision = precisionX;
    updateExample();
}




//Everything next is only executed once


function setGroupSelection(containerId, button) {

}
function createButtonGroup(containerId, options, groupName, defaultIndex) {
    const container = document.getElementById(containerId);

    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option.label;
        button.dataset.value = option.value;
        button.classList.add("toggle-button");

        // Mark default selection
        if (index === defaultIndex) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {

            if (containerId === DENOM_GROUP_ID) {
                asPercentage = option.value;
            } else {
                precision = option.value;
            }
            container.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            updateExample();
        });

        container.appendChild(button);
    });

}



function initPrecisionUI() {

    // Options for Type Selection
    createButtonGroup(DENOM_GROUP_ID, [
        {label: "Use Percentage", value: true},
        {label: "Use Proportions", value: false}
    ], "denominator", asPercentage ? 0 : 1);

    // Options for Precision Selection (Numbers from 2 to 6)
    const arr = Array.from({length: 5}, (_, i) => ({label: (i + LOW_PREC).toString(), value: (i + LOW_PREC)}));
    createButtonGroup(PRECISION_GROUP_ID, arr, "precision", precision - LOW_PREC);


    // Event listeners
    document.getElementById('apply-precision').addEventListener('click', handleApplyClicked);
    document.getElementById('cancel-precision').addEventListener('click', leaveModal);


}

precision = 3;
asPercentage = true;
initPrecisionUI();