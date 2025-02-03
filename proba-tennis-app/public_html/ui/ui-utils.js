export function switchModal(fromModalId, toModalId) {
    document.getElementById(fromModalId).classList.add('hidden');
    document.getElementById(toModalId).classList.remove('hidden');
}

export function populateDropdown(dropdownId, choices, fctOnceChosen) {
    const dropdown = document.getElementById(dropdownId);

    // Populate the dropdown with choices
    choices.forEach((choice, index) => {
        const option = document.createElement('option');
        option.value = index; // Store the index for reference
        option.textContent = choice;
        dropdown.appendChild(option);
    });

    dropdown.onchange = function (event) {
        const selectedIndex = parseInt(event.target.value, 10); // Value of the selected option
        if (!isNaN(selectedIndex)) {
            fctOnceChosen(selectedIndex);
        }
    };

    /*// Define the listener
     const listener = (e) => {
     const selectedIndex = parseInt(e.target.value, 10);
     if (!isNaN(selectedIndex)) {
     fctOnceChosen(selectedIndex);
     }
     };
     
     // Attach the listener
     dropdown.addEventListener('change', listener);
     
     // Return the listener function
     return listener;*/
}

export function resetDropdown(dropDownId) {
    const dropdown = document.getElementById(dropDownId);

    // Temporarily disable event listeners
    const originalHandler = dropdown.onchange;
    dropdown.onchange = null;

    // Reset the dropdown to its default option
    dropdown.selectedIndex = 0;

    // Re-enable event listeners
    dropdown.onchange = originalHandler;
}
