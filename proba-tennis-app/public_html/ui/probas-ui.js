// Import dependencies
import { switchModal, populateDropdown, resetDropdown } from './ui-utils.js';
import { handleBaseProbasInput } from './main-ui.js';
import { StrProba } from '../intools/str-proba.js';
import { Csts } from '../central/csts.js';
import { ModalNames } from './modal-names.js';

const PROBAS_DROPDOWN_ID = 'builtin-probas';

// Initialize the modal with default base probabilities
export function initBaseProbasUI(baseProbaStrings) {
    document.getElementById('serve-prob').value = baseProbaStrings[0];
    document.getElementById('return-prob').value = baseProbaStrings[1];
}

// Handlers
function handleCancelClicked() {
    switchModal(ModalNames.getProbas(), ModalNames.getMain());
}

function handleApplyClicked() {
    try {
        const serveProbaField = document.getElementById('serve-prob').value;
        const returnProbaField = document.getElementById('return-prob').value;

        // Parse user input
        const serveProba = StrProba.attemptBuild(serveProbaField);
        const returnProba = StrProba.attemptBuild(returnProbaField);

        // Send parsed probabilities back to main
        handleBaseProbasInput(serveProba, returnProba);

        // Close the modal
        switchModal('probas-modal', 'main-modal');
    } catch (error) {
        // Display the error message in a placeholder
        const errorPlaceholder = document.getElementById('probas-error');
        if (errorPlaceholder) {
            errorPlaceholder.textContent = error.message;
        } else {
            alert(error.message); // Fallback if no placeholder exists
        }
    }
}

function actionWhenBuiltinProbasChosen(selectedIndex) {
    const servTxt = Csts.getNotoriusProbaSrvValue(selectedIndex);
    const retTxt = Csts.getNotoriusProbaRetValue(selectedIndex);
    document.getElementById('serve-prob').value = servTxt;
    document.getElementById('return-prob').value = retTxt;
}

// Call this during initialization of ProbasUI
// populateBuiltInProbas();

// Event listeners
document.getElementById('apply-probas').addEventListener('click', handleApplyClicked);
document.getElementById('cancel-probas').addEventListener('click', handleCancelClicked);

//dropdown

function resetProbasDropDown() {
    resetDropdown(PROBAS_DROPDOWN_ID);
}
document.getElementById('serve-prob').addEventListener('blur', resetProbasDropDown);
document.getElementById('return-prob').addEventListener('blur', resetProbasDropDown);


populateDropdown(PROBAS_DROPDOWN_ID, Csts.getNotoriusProbaNames(), actionWhenBuiltinProbasChosen);
