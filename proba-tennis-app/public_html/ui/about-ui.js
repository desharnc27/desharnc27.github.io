import { switchModal } from './ui-utils.js';
import { ModalNames } from './modal-names.js';

const AUTHOR = "author";
const aboutCache = {};

function loadAboutText(lang) {
    if (aboutCache[lang]) {
        document.getElementById('about-modal-body').innerHTML = DOMPurify.sanitize(aboutCache[lang]); // Safe rendering
        switchModal(ModalNames.getOptions(), ModalNames.getAbout());
        return;
    }
    
    let filename = lang === AUTHOR ? "personal.txt" : `${lang}-about.txt`;    
    let filePath = "../" + filename;

    fetch(filePath)
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


let closeId = document.getElementById('about-close');
closeId.addEventListener('click', () => {
    switchModal(ModalNames.getAbout(), ModalNames.getMain());
});