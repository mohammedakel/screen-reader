"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var set = Reflect.set;
let VOICE_SYNTH = window.speechSynthesis;
// The current speaking rate of the screen reader
let VOICE_RATE = 1;
// Stores elements and their handler functions
let ELEMENT_HANDLERS;
// Stores element ids
let ELEMENT_IDS;
// Indicates the current element that the user is on
let current = 0;
let ID_COUNT = 0;
const supportedTags = ["TITLE", "P", "H1", "H2", "H3", "H4", "H5", "H6", "IMG", "A", "INPUT", "BUTTON",
    "TABLE", "CAPTION", "TD", "TFOOT", "TH", "TR"];
/**
 * Speaks out text.
 * @param text the text to speak
 */
function speak(text) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(text);
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = VOICE_RATE;
        VOICE_SYNTH.cancel();
        VOICE_SYNTH.speak(utterance);
        return new Promise(resolve => {
            utterance.onend = () => {
                resolve();
            };
        });
    });
}
// On window load, we can generateHandlers and add an even listener for keystrokes.
window.onload = () => {
    generateHandlers();
    document.body.innerHTML = `
        <div id="screenReader">
            <button>Start [Space]</button>
            <button>Pause/Resume [P]</button>
            <button onclick="changeVoiceRate(1.1);">Speed Up [Right Arrow]</button>
            <button onclick="changeVoiceRate(0.9);">Slow Down [Left Arrow]</button>
        </div>
    ` + document.body.innerHTML;
    document.addEventListener("keydown", globalKeystrokes);
};
/**
 * This function is responsible for retrieving all supported HTML elements and their Handler functions
 */
function generateHandlers() {
    const elements = document.getElementsByTagName("*");
    ELEMENT_HANDLERS = new Map();
    for (const element of elements) {
        //reset id if needed
        if (element.id === "") {
            element.id = ID_COUNT.toString();
            ID_COUNT++;
        }
        const currentID = element.id;
        const currentTag = element.tagName;
        // If the element is of type text
        if (currentTag === "TITLE" || currentTag === "H1" || currentTag === "H2" ||
            currentTag === "H3" || currentTag === "H4" || currentTag === "H5" || currentTag === "H6"
            || currentTag === "P") {
            ELEMENT_HANDLERS.set(currentID, textHandler(element));
        }
        else if (currentTag === "IMG") {
            const elementHTML = element;
            ELEMENT_HANDLERS.set(currentID, imgHandler(element));
        }
        else if (element.tagName === "A") {
            ELEMENT_HANDLERS.set(currentID, linkHandler(element));
        }
        else if (currentTag === "BUTTON") {
            ELEMENT_HANDLERS.set(currentID, buttonHandler(element));
        }
        else if (currentTag === "INPUT") {
            ELEMENT_HANDLERS.set(currentID, inputHandler(element));
        }
        else if (currentTag === "TABLE") {
            ELEMENT_HANDLERS.set(currentID, tableHandler(element));
        }
        else if (currentTag === "CAPTION") {
            ELEMENT_HANDLERS.set(currentID, captionHandler(element));
        }
        else if (currentTag === "TD") {
            ELEMENT_HANDLERS.set(currentID, tdHandler(element));
        }
        else if (currentTag === "TR") {
            ELEMENT_HANDLERS.set(currentID, trHandler(element));
        }
        else if (currentTag === "TH") {
            ELEMENT_HANDLERS.set(currentID, thHandler(element));
        }
        else if (currentTag === "TFOOT") {
            ELEMENT_HANDLERS.set(currentID, tfootHandler(element));
        }
        // Store element IDS for future reference
        ELEMENT_IDS = Array.from(ELEMENT_HANDLERS.keys());
    }
}
/**
 * This function is responsible for reading HTML Elements text contains text
 * @param  element
 */
function textHandler(element) {
    const currentID = element.id;
    const currentTag = element.tagName;
    const toRead = `${currentTag}: ${element.textContent}`;
    return toRead;
}
/**
 *
 * This function is responsible for reading an image alternative description or a generic statement otherwise
 * @param  element
 *
 */
function imgHandler(element) {
    const currentID = element.id;
    const altText = element.alt;
    let toRead = "image with no description";
    if (altText != "") {
        toRead = `image of ${altText}`;
    }
    return toRead;
}
/**
 *
 * This function is responsible for reading embeded hyperlinks
 * allows user to pause, manually click on the link and resume reading
 * or press enter to click
 *
 * @param  element
 *
 */
function linkHandler(element) {
    const currentID = element.id;
    const link = element.href;
    const title = element.text;
    let toRead = '';
    if (title === '' && !(link === '')) {
        toRead = `a link to ${link}-Press P to pause and interact manually or Press Enter  to click on the link`;
    }
    else if (link === '') {
        toRead = `an invalid link`;
    }
    else {
        toRead = `a link to ${link}-titled ${title}-Press P to pause and interact manually or 
        Press Enter  to click on the link`;
    }
    return toRead;
}
/**
 * This function is responsible for reading buttons. It guides users on how to navigate the three types of buttons
 * users can pause, manually click and resume or Press Enter to click
 * @param  element
 */
function buttonHandler(element) {
    const currentID = element.id;
    const type = element.type;
    const name = element.name;
    const textContent = element.textContent;
    let toRead = ``;
    if (type === "submit") {
        toRead = `A submit button. Press P to pause and interact manually or Enter to submit`;
        if (element.textContent != '') {
            const label = element.textContent;
            toRead = `A submit button labeled ${label}-Press P to pause and interact manually or Enter to submit`;
        }
    }
    else if (type === "reset") {
        toRead = `A reset button. Press P to pause and interact manually or Enter to reset`;
        if (element.textContent != '') {
            const label = element.textContent;
            toRead = `A reset button labeled ${label}-Press P to pause and interact manually or Enter to reset`;
        }
    }
    else {
        if (element.name != '' && element.textContent != '') {
            toRead = `${type}-typed button with name ${element.name}-and label ${element.textContent}-Press
           P to pause and interact manually or Enter to click`;
        }
        else if (element.textContent != '' && element.name == '') {
            toRead = `${type}-typed button labeled ${element.textContent}-Press
           P to pause and interact manually or Enter to click`;
        }
        else if (element.textContent == '' && element.name != '') {
            toRead = `${type}-typed button names ${element.name}-Press
           P to pause and interact manually or Enter to click`;
        }
    }
    return toRead;
}
/**
 * This function is responsible for reading input elements. Guides users to pause, manually type their inputs
 * and resume reading.
 *
 * @param  element
 */
function inputHandler(element) {
    const type = element.type;
    const label = document.querySelector(`label[for='${element.id}']`);
    let toRead = `${type}-typed input with no label`;
    if (label != null) {
        const labelText = label.innerHTML;
        toRead = `${labelText} input of type: ${type}-Press P to pause and interact manually or Press right shift to interact`;
    }
    else if (element.ariaLabel != '') {
        toRead = `${element.ariaLabel}-input of type: ${type}-Press P to pause and interact manually or Press right shift to interact`;
    }
    else if (element.name != '') {
        toRead = `${element.name}-input of type: ${type}-Press P to pause and interact manually or Press right shift to interact`;
    }
    else if (element.value != '') {
        toRead = `${type}-typed input with value ${element.value} Press enter to interact`;
    }
    return toRead;
}
/**
 * This function is responsible for reading table captions
 * @param  element
 */
function captionHandler(element) {
    const currentID = element.id;
    let toRead = `Table Caption ${element.textContent}`;
    return toRead;
}
/**
 * This function is responsible for reading  data cells
 * @param  element
 */
function tdHandler(element) {
    return element.textContent;
}
/**
 * This function is responsible for reading header cells
 * @param  element
 */
function thHandler(element) {
    return element.textContent;
}
/**
 * This function is responsible for reading tables rows
 * @param  element
 */
function trHandler(element) {
    return "New Row";
}
/**
 * This function is responsible for reading tables footers
 * @param  element
 */
function tfootHandler(element) {
    return element.textContent;
}
/**
 * This function is responsible for announcing tables
 * @param  element
 */
function tableHandler(element) {
    return "Begin Table";
}
/**
 * Changes the speaking rate of the screen reader.
 * @param factor multiplier on the speaking rate
 */
function changeVoiceRate(factor) {
    VOICE_RATE *= factor;
    if (VOICE_RATE > 4) {
        VOICE_RATE = 4;
    }
    else if (VOICE_RATE < 0.25) {
        VOICE_RATE = 0.25;
    }
}
/**
 * Moves to the next HTML element in the DOM.
 */
function next() {
    VOICE_SYNTH.cancel();
}
/**
 * Moves to the previous HTML element in the DOM.
 */
function previous() {
    return __awaiter(this, void 0, void 0, function* () {
        current -= 2;
        // boundary check
        if (current < 0) {
            current = -1;
        }
        VOICE_SYNTH.cancel();
    });
}
/**
 * Starts reading the page. This is called when the user presses Space.
 */
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        while (current < ELEMENT_HANDLERS.size) {
            const currentId = ELEMENT_IDS[current];
            const element = document.getElementById(currentId);
            // Highlight
            const originalColor = element.style.backgroundColor;
            element.style.backgroundColor = "yellow";
            // Speak and wait for the utterance to finish
            const value = ELEMENT_HANDLERS.get(currentId);
            yield speak(value);
            // Restore original background color
            element.style.backgroundColor = originalColor;
            current += 1;
        }
        // Reset so that the page can be read again on Space
        current = 0;
    });
}
/**
 * Pauses the speaking
 */
function pause() {
    VOICE_SYNTH.pause();
}
/**
 * Resumes the speaking
 */
function resume() {
    VOICE_SYNTH.resume();
}
/**
 * for keydown events.
 * @param event keydown event
 */
function globalKeystrokes(event) {
    if (event.key === " ") {
        event.preventDefault();
        start();
    }
    else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeVoiceRate(1.1);
    }
    else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeVoiceRate(0.9);
    }
    else if (event.key === "p") {
        event.preventDefault();
        if (VOICE_SYNTH.paused) {
            resume();
        }
        else {
            pause();
        }
    }
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        previous();
    }
    else if (event.key === "ArrowDown") {
        event.preventDefault();
        next();
    }
    else if (event.code === "RightShift") {
        event.preventDefault();
        const currentId = ELEMENT_IDS[current];
        const element = document.getElementById(currentId);
        element.focus();
    }
    else if (event.key === "Enter") {
        event.preventDefault();
        const currentId = ELEMENT_IDS[current];
        const element = document.getElementById(currentId);
        element.click();
    }
}
