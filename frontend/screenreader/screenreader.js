"use strict";
// Look up the Web Speech API (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
// Initialize this variable when the window first loads
let VOICE_SYNTH = window.speechSynthesis;
// The current speaking rate of the screen reader
let VOICE_RATE = 1;
// Stores elements and their handler functions
// Think of an appropriate data structure to do this
// Assign this variable in mapPage()
let ELEMENT_HANDLERS = new Map();
// Indicates the current element that the user is on
// You can decide the type of this variable
let current;
let paused = false;
// a stack used to read a given web page linearly
let elementsIDs = [];
// keeps a list of HTML elements supported by this screen reader
// returned DOM HTML element tag is always capitalized
const supportedTags = ["TITLE", "P", "H1", "H2", "H3", "H4", "H5", "H6", "IMG", "A", "INPUT", "BUTTON",
    "TABLE", "CAPTION", "TD", "TFOOT", "TH", "TR"];
/**
 * Speaks out text.
 * @param text the text to speak
 * @param id of the element being read
 * Method adapted from: cs0320-s2022/project-2-cbaumga1-jbarlas1-jpark236
 */
function speak(text, id) {
    /**
    const element: HTMLElement | null = document.getElementById(id);
    return new Promise<void>((resolve, reject) => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = VOICE_RATE;
        utter.onstart = () => {
            element!.style.backgroundColor = "green";
        };
        utter.onend = () => {
            element!.style.removeProperty("background-color");
            resolve();
        };
        console.log(text)
        VOICE_SYNTH.speak(utter);
    });
     */
    if (VOICE_SYNTH) {
        const element = document.getElementById(id);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            element.style.backgroundColor = "green";
        };
        utterance.onend = () => {
            element.style.removeProperty("background-color");
        };
        utterance.rate = VOICE_RATE;
        while (!paused) {
            VOICE_SYNTH.speak(utterance);
        }
    }
}
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
 *
 * This function is responsible for retriving all supported HTML elements and their Handler functions
 *
 */
function generateHandlers() {
    // get all the HTML elements in the DOM
    const elements = document.getElementsByTagName("*");
    let counter = 0;
    // for each element: check if it is supported, push ID, add element and its handler function
    for (const elt of elements) {
        // check this is a supported element
        const currentTag = elt.tagName;
        if (!(currentTag in supportedTags)) {
            console.log("Error: Unsupported HTML Element");
            console.log(currentTag);
        }
        // assign ids if applicable
        let currentID = '';
        if (elt.id != '') {
            currentID = elt.id;
        }
        else {
            currentID = counter.toString();
            elt.setAttribute("id", currentID);
            counter++;
        }
        elementsIDs.push(currentID);
        // add each element to ELEMENT_HANDLERS, along with its handler
        if (currentTag === "TITLE" || currentTag === "H1" || currentTag === "H2" ||
            currentTag === "H3" || currentTag === "H4" || currentTag === "H5" || currentTag === "H6"
            || currentTag === "P") {
            ELEMENT_HANDLERS.set(currentID, textHandler);
        }
        else if (currentTag === "IMG") {
            ELEMENT_HANDLERS.set(currentID, imgHandler);
        }
        else if (currentTag === "A") {
            ELEMENT_HANDLERS.set(currentID, linkHandler);
        }
        else if (currentTag === "INPUT") {
            ELEMENT_HANDLERS.set(currentID, inputHandler);
        }
        else if (currentTag === "BUTTON") {
            ELEMENT_HANDLERS.set(currentID, buttonHandler);
        }
        else {
            // read table; may change later depending on functionality
            ELEMENT_HANDLERS.set(currentID, tableHandler);
        }
    }
}
/**
 * This function is responsible for reading HTML Elements that contains text
 * @param  element
 */
// is there a more specific tag for HTML text elements?
function textHandler(element) {
    const currentID = element.id;
    const currentTag = element.tagName;
    const toRead = `${currentTag}: ${element.textContent}`;
    return speak(toRead, currentID);
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
    return speak(toRead, currentID);
}
/**
 *
 * This function is responsible for reading embeded hyperlinks
 * @param  element
 *
 */
function linkHandler(element) {
    console.log(element.toString());
    const currentID = element.id;
    const link = element.href;
    const title = element.text;
    const toRead = `link to: ${link} titled: ${title}`;
    return speak(toRead, currentID);
}
/**
 * This function is responsible for reading input elements
 * @param  element
 */
function inputHandler(element) {
    const currentID = element.id;
    const type = element.type;
    const label = document.querySelector(`label[for='${element.id}']`);
    let toRead = `${type}-typed input with no label`;
    if (label != null) {
        const labelText = label.innerHTML;
        toRead = `${labelText} input of type: ${type}`;
    }
    else if (element.ariaLabel != null) {
        toRead = `${element.ariaLabel} input of type: ${type}`;
    }
    else if (element.name != '') {
        toRead = `${element.name} input of type: ${type}`;
    }
    else if (element.value != '') {
        toRead = `${type}-typed input with value ${element.value}`;
    }
    return speak(toRead, currentID);
}
/**
 * This function is responsible for reading buttons
 * @param  element
 */
function buttonHandler(element) {
    const currentID = element.id;
    let toRead = '';
    return speak(toRead, currentID);
}
/**
 * This function is responsible for reading tables
 * @param  element
 */
function tableHandler(element) {
    const currentID = element.id;
    let toRead = '';
    return speak(toRead, currentID);
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
function next() { }
/**
 * Moves to the previous HTML element in the DOM.
 */
function previous() { }
/**
 * Starts reading the page continuously.
 */
function start() {
    for (let [key, value] of ELEMENT_HANDLERS) {
        //console.log(key + " = " + value);
        const currentID = key;
        const currentHandler = value;
        let element = document.getElementById(currentID);
        value(element);
    }
}
/**
 * Pauses the reading of the page.
 */
function pause() {
    console.log("pausing");
    paused = true;
}
/**
 /**
 * Resumes the reading of the page.
 */
function resume() {
    console.log("resuming");
    paused = false;
}
/**
 * Listens for keydown events.
 * @param event keydown event
 */
function globalKeystrokes(event) {
    // can change and add key mappings as needed
    if (event.key === " ") {
        event.preventDefault();
        //TODO: start reading the entire page
        start();
        resume();
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
        pause();
    }
}
