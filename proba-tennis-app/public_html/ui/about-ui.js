import { switchModal } from './ui-utils.js';
import { ModalNames } from './modal-names.js';

const AUTHOR = "author";
const aboutCache = {};

let prefix;

async function fileExists(filePath) {
    try {
        const response = await fetch(filePath, {method: 'HEAD'}); // Only request headers
        return response.ok; // Returns true if file exists, false if 404
    } catch (error) {
        return false; // Network issues or other errors
    }
}

function addPrefix(str) {
    return prefix + str;
}

function getFilename(lang) {
    let filename = lang === AUTHOR ? "personal.txt" : `${lang}-about.txt`;
    return addPrefix(filename);
}

function loadAboutText(lang) {
    if (aboutCache[lang]) {
        document.getElementById('about-modal-body').innerHTML = DOMPurify.sanitize(aboutCache[lang]); // Safe rendering
        switchModal(ModalNames.getOptions(), ModalNames.getAbout());
        return;
    }

    let filename = getFilename(lang);

    console.log("attempt to open: " + filename);
    fetch(filename)
            .then(response => response.text())
            .then(text => {
                const htmlContent = marked.parse(text); // Convert Markdown to HTML
                aboutCache[lang] = htmlContent; // Cache the sanitized version
                document.getElementById('about-modal-body').innerHTML = DOMPurify.sanitize(htmlContent); // Secure insert
                switchModal(ModalNames.getOptions(), ModalNames.getAbout());
            })
            .catch(error => {
                document.getElementById('about-modal-body').textContent = "Error loading content.";
                console.error(`Error loading file ${filename}`, error);
            });
}


export function handleAboutRequest(lang) {
    loadAboutText(lang);
}

//Down below run only once

function init() {
    let closeId = document.getElementById('about-close');
    closeId.addEventListener('click', () => {
        switchModal(ModalNames.getAbout(), ModalNames.getMain());
    });

    //Get about src;


    prefix = "./";
    const path = getFilename(AUTHOR);

    fileExists(path).then(exists => {
        if (!exists) {
            prefix = "../";

        }
        console.log("prefix set to:" + prefix);
    });


}

init();