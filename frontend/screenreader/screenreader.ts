// Look up the Web Speech API (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
// Initialize this variable when the window first loads
let VOICE_SYNTH: SpeechSynthesis = window.speechSynthesis;

// The current speaking rate of the screen reader
let VOICE_RATE: number = 0.7;

// Stores elements and their handler functions
// Think of an appropriate data structure to do this
// Assign this variable in mapPage()
let ELEMENT_HANDLERS = new Map();
// Indicates the current element that the user is on
// You can decide the type of this variable
let current: HTMLElement;

let numID: number = 0;

// Indicates the order of the element
let currentOrder: number = 0;

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
 *
 */
function speak(text: string, id: string) {
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
        const element: HTMLElement | null = document.getElementById(id);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            element!.style.backgroundColor = "green";
        };
        utterance.onend = () => {
            element!.style.removeProperty("background-color");
        };
        utterance.rate = VOICE_RATE;
        console.log(text);
        VOICE_SYNTH.speak(utterance);

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
}

/**
 *
 * This function is responsible for retriving all supported HTML elements and their Handler functions
 *
 */
function generateHandlers(): void {
    // get all the HTML elements in the DOM
    const elements = document.getElementsByTagName("*");
    let counter = 0;

    // for each element: check if it is supported, push ID, add element and its handler function
    for(const elt of elements) {
        // check this is a supported element
        const currentTag = elt.tagName;
        if (!(currentTag in supportedTags)) {
            console.log("Error: Unsupported HTML Element")
            console.log(currentTag);}

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
        elementsIDs.push(currentID)

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
        else if (currentTag === "CAPTION") {
            ELEMENT_HANDLERS.set(currentID, captionHandler);
        }
        else if (currentTag === "TD") {
            ELEMENT_HANDLERS.set(currentID, tdHandler);
        }
        else if (currentTag === "TFOOT") {
            ELEMENT_HANDLERS.set(currentID, tfootHandler);
        }
        else if (currentTag === "TH") {
            ELEMENT_HANDLERS.set(currentID, thHandler);
        }
        else if (currentTag === "TR") {
            ELEMENT_HANDLERS.set(currentID, trHandler);
        }
        else if (currentTag === "TABLE"){
            ELEMENT_HANDLERS.set(currentID, tableHandler);
        }
    }
}


/**
 * This function is responsible for reading HTML Elements that contains text
 * @param  element
 */
// is there a more specific tag for HTML text elements?
function textHandler(element: HTMLElement) {
    const currentID: string = element.id;
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
function imgHandler(element: HTMLImageElement) {
    const currentID: string = element.id;
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
 * allows user to pause, manually click on the link and resume reading
 * currently working on automatic link handling
 *
 * @param  element
 *
 */
function linkHandler(element: HTMLAnchorElement) {
    const currentID: string = element.id;
    const link: string = element.href;
    const title: string = element.text;
    let toRead: string = '';
    if (title === '' && !(link === '')) {
        toRead = "This is a link to: " + link +  "  Press enter to pause and interact manually. " +
            "Press Escape to resume. Press C to click on the link";
    }
    else if (link === '') {
        toRead = "Invalid Link. Press enter to interact and Pause. Press Escape to resume. Press C to " +
            "click on the link";
    }
    else {
        toRead = "This is a link to: " + link +  "titled: " + title + "  Press enter to interact and Pause. " +
            "Press Escape to resume. Press C to click on the link";
    }
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading input elements. Guides users to pause, manually type their inputs
 * and resume reading.
 *
 * @param  element
 */
function inputHandler(element: HTMLInputElement) {
    const type = element.type;
    const label = document.querySelector(`label[for='${element.id}']`);
    let toRead = `${type}-typed input with no label`;
    if (label != null) {
        const labelText = label.innerHTML;
        toRead = `${labelText} input of type: ${type}-Press enter to pause and type your response. 
        Press Escape to resume`;
    }
    else if (element.ariaLabel != null) {
        toRead = `${element.ariaLabel}-input of type: ${type}-Press enter to pause and type your response. 
        Press Escape to resume`;
    }
    else if (element.name != '') {
        toRead = `${element.name}-input of type: ${type}-Press enter to pause and type your response. 
        Press Escape to resume`;
    }
    else if (element.value != '') {
        toRead = `${type}-typed input with value ${element.value} Press enter to pause and type your response. 
        Press Escape to resume`;
    }
     return speak(toRead, element.id);
}

/**
 * This function is responsible for reading buttons. It guides users on how to navigate the three types of buttons
 * users can pause, manually click and resume or Press C to automatically click the button
 * @param  element
 */
function buttonHandler(element: HTMLButtonElement) {
    const currentID: string = element.id;
    const type = element.type;
    const name = element.name;
    const textContent = element.textContent;
    let toRead = `${type}-typed button`;
    if (type === "submit") {
        toRead = 'This is a submit button. Press enter to pause. Press Escape to resume or Press C to submit'
        if (element.textContent != null) {
            const label = element.textContent;
            toRead = "This is a submit button tittled" + label + "Press enter to pause. Press Escape to resume " +
                " or Press C to submit";
        }
    }
    else if (type === "reset") {
        toRead = 'This is a reset button. Press enter to pause. Press Escape to resume or Press C to reset'
        if (element.textContent != null) {
            const label = element.textContent;
            toRead = "This is a reset button tittled" + label + "Press enter to pause. Press Escape to resume " +
                " or Press C to submit";
        }
    }
    else {
        if (element.name != '' && element.textContent != '' ) {
            toRead = `${type}-typed button with name ${element.name}-and label ${element.textContent}-Press 
            enter to pause. Press Escape to resume or Press C to click`;
        }
        else if (element.textContent != '' && element.name == '') {
            toRead = `${type}-typed button with label ${element.textContent}-Press 
            enter to pause. Press Escape to resume or Press C to click`;
        }
        else if (element.textContent == '' && element.name != '') {
            toRead = `${type}-typed button with name ${element.name}-Press 
            enter to pause. Press Escape to resume or Press C to click`;
        }

    }
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading tables
 * @param  element
 */
function tableHandler(element: HTMLTableElement) {
    const currentID: string = element.id;
    let toRead = 'Table starts Here';
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading table captions
 * @param  element
 */
function captionHandler(element: HTMLTableCaptionElement) {
    const currentID: string = element.id;
    let toRead = "Table Caption: " + element.textContent as string;
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading  data cells
 * @param  element
 */
function tdHandler(element: HTMLElement) {
    const currentID: string = element.id;
    let toRead: string = element.textContent as string;
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading header cells
 * @param  element
 */function thHandler(element: HTMLElement) {
    const currentID: string = element.id;
    let toRead: string = element.textContent as string;
    return speak(toRead, currentID);

}
/**
 * This function is responsible for reading tables rows
 * @param  element
 */
function trHandler(element: HTMLTableRowElement) {
    const currentID: string = element.id;
    let toRead: string = "New Row"
    return speak(toRead, currentID);
}

/**
 * This function is responsible for reading tables footers
 * @param  element
 */
function tfootHandler(element: HTMLTableRowElement) {
    const currentID: string = element.id;
    let toRead: string = element.textContent as string
    return speak(toRead, currentID);
}

/**
 * Changes the speaking rate of the screen reader.
 * @param factor multiplier on the speaking rate
 */
function changeVoiceRate(factor: number): void {
    VOICE_RATE *= factor
    if (VOICE_RATE > 4) {
        VOICE_RATE = 4;
    } else if (VOICE_RATE < 0.25){
        VOICE_RATE = 0.25;
    }
}


/**
 * Moves to the next HTML element in the DOM.
 */
function next() {}

/**
 * Moves to the previous HTML element in the DOM.
 */
function previous() {
    currentOrder -= 2;
    // Makes sure that the up arrow never crashes the screen reader
    if (currentOrder < 0) {
        currentOrder = -1;
    }
    VOICE_SYNTH.cancel()
}

/**
 * Starts reading the page continuously.
 */
function start() {
    paused = false;
    while (currentOrder < ELEMENT_HANDLERS.size) {
        for (let [key, value] of ELEMENT_HANDLERS) {
            //console.log(key + " = " + value);
            let element = document.getElementById(key) as HTMLElement;
            console.log(element);
            current = element;
            value(element);
            //console.log(current);
            currentOrder += 1;
        }
    }
    currentOrder = 0;
}


/**
 * Pauses the reading of the page.
 */
 function pause() {
    console.log("pausing");
    paused = true;
    VOICE_SYNTH.pause();
}


/**
 /**
 * Resumes the reading of the page.
 */
  function resume() {
    console.log("resuming");
    paused = false;
    VOICE_SYNTH.resume();
}

/**
 * Listens for keydown events.
 * @param event keydown event
 */
function globalKeystrokes(event: KeyboardEvent): void {
    // can change and add key mappings as needed
    if (event.key === " ") {
        event.preventDefault();
        start();
        resume();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeVoiceRate(1.1);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeVoiceRate(0.9);
    } else if (event.key === "p") {
        event.preventDefault();
        pause();
    } else if (event.key === "Enter") {
        // For button input elements and links
        event.preventDefault();
        pause();
    }
    else if (event.key === "Escape") {
        // For button input elements and links
        resume();
    }
    else if (event.key === "c") {
        //check why this is not working for links. it does work for buttons
        console.log(current);
        current.click();
        console.log("clicked!");
    }
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        previous();
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        next();
    }

}
