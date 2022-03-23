import set = Reflect.set;
let VOICE_SYNTH: SpeechSynthesis = window.speechSynthesis;

// The current speaking rate of the screen reader
let VOICE_RATE: number = 1;

// Stores elements and their handler functions
let ELEMENT_HANDLERS: Map<string, string>;
// Stores element ids
let ELEMENT_IDS: Array<string>;

// Indicates the current element that the user is on
let current: number = 0;
let ID_COUNT: number = 0;

const supportedTags = ["TITLE", "P", "H1", "H2", "H3", "H4", "H5", "H6", "IMG", "A", "INPUT", "BUTTON",
    "TABLE", "CAPTION", "TD", "TFOOT", "TH", "TR"];

/**
 * Speaks out text.
 * @param text the text to speak
 */
async function speak(text: string) {
    console.log(text);
    let utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    utterance.rate = VOICE_RATE;
    VOICE_SYNTH.cancel();
    VOICE_SYNTH.speak(utterance);
    return new Promise<void>(resolve => {
        utterance.onend = () => {
            resolve();
        };
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
}

/**
 * This function is responsible for retrieving all supported HTML elements and their Handler functions
 */
function generateHandlers(): void {
    const elements: HTMLCollection = document.getElementsByTagName("*") as HTMLCollection;
    ELEMENT_HANDLERS = new Map<string, string>();
    let count: string = "a";
    for (const element of elements) {
        //reset id if needed
        if (element.id === "") {
            element.id = ID_COUNT.toString();
            ID_COUNT ++;
        }
        const currentID = element.id;
        const currentTag = element.tagName;
        // If the element is of type text
        if (currentTag === "TITLE" || currentTag === "H1" || currentTag === "H2" ||
            currentTag === "H3" || currentTag === "H4" || currentTag === "H5" || currentTag === "H6"
            || currentTag === "P") {
            ELEMENT_HANDLERS.set(currentID, textHandler(<HTMLElement>element));
        } else if (currentTag === "IMG") {
            const elementHTML = element as HTMLImageElement;
            ELEMENT_HANDLERS.set(currentID, imgHandler(<HTMLImageElement>element));
        } else if (element.tagName === "A") {
            ELEMENT_HANDLERS.set(currentID, linkHandler(<HTMLAnchorElement>element));
        } else if (currentTag === "BUTTON") {
            ELEMENT_HANDLERS.set(currentID, buttonHandler(<HTMLButtonElement>element));
        } else if (currentTag === "INPUT") {
            ELEMENT_HANDLERS.set(currentID, inputHandler(<HTMLInputElement>element));
        } else if (currentTag === "TABLE") {
            ELEMENT_HANDLERS.set(currentID, tableHandler(<HTMLTableElement>element));
        } else if (currentTag === "CAPTION") {
            ELEMENT_HANDLERS.set(currentID, captionHandler(<HTMLTableCaptionElement>element));
        } else if (currentTag === "TD") {
            ELEMENT_HANDLERS.set(currentID, tdHandler(<HTMLElement>element));
        } else if (currentTag === "TR") {
            ELEMENT_HANDLERS.set(currentID, trHandler(<HTMLTableRowElement>element));
        } else if (currentTag === "TH") {
            ELEMENT_HANDLERS.set(currentID, thHandler(<HTMLElement>element));
        }
        else if (currentTag === "TFOOT") {
            ELEMENT_HANDLERS.set(currentID, tfootHandler(<HTMLElement>element));
        }
        // Store element IDS for future reference
        ELEMENT_IDS = Array.from(ELEMENT_HANDLERS.keys());
    }
}

/**
 * This function is responsible for reading HTML Elements text contains text
 * @param  element
 */
function textHandler(element: HTMLElement) {
    const currentID: string = element.id;
    const currentTag: string = element.tagName;
    const toRead: string = `${currentTag}: ${element.textContent}`;
    return toRead;
}

/**
 *
 * This function is responsible for reading an image alternative description or a generic statement otherwise
 * @param  element
 *
 */
function imgHandler(element: HTMLImageElement) {
    const currentID: string = element.id;
    const altText: string = element.alt;
    let toRead: string = "image with no description";
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
function linkHandler(element: HTMLAnchorElement) {
    const currentID: string = element.id;
    const link: string = element.href;
    const title: string = element.text;
    let toRead: string = '';
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
function buttonHandler(element: HTMLButtonElement) {
    const currentID: string = element.id;
    const type = element.type;
    const name = element.name;
    const textContent = element.textContent;
    let toRead: string = ``;
    if (type === "submit") {
        toRead = `A submit button. Press P to pause and interact manually or Enter to submit`
        if (element.textContent != '') {
            const label = element.textContent;
            toRead = `A submit button labeled ${label}-Press P to pause and interact manually or Enter to submit`;
        }
    }
    else if (type === "reset") {
        toRead = `A reset button. Press P to pause and interact manually or Enter to reset`
        if (element.textContent != '') {
            const label = element.textContent;
            toRead = `A reset button labeled ${label}-Press P to pause and interact manually or Enter to reset`;
        }
    }
    else {
        if (element.name != '' && element.textContent != '' ) {
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
function inputHandler(element: HTMLInputElement) {
    const type = element.type;
    const label = document.querySelector(`label[for='${element.id}']`);
    let toRead: string = `${type}-typed input with no label`;
    if (label != null) {
        const labelText = label.innerHTML;
        toRead = `${labelText} input of type: ${type}-Press C to interact`;
    }
    else if (element.ariaLabel != '') {
        toRead = `${element.ariaLabel}-input of type: ${type}-Press C to interact`;
    }
    else if (element.name != '') {
        toRead = `${element.name}-input of type: ${type}-Press C to interact`;
    }
    else if (element.value != '') {
        toRead = `${type}-typed input with value ${element.value} Press C to interact`;
    }
    return toRead;
}

/**
 * This function is responsible for reading table captions
 * @param  element
 */
function captionHandler(element: HTMLTableCaptionElement) {
    const currentID: string = element.id;
    let toRead: string =  `Table Caption ${element.textContent as string}`;
    return toRead;
}
/**
 * This function is responsible for reading  data cells
 * @param  element
 */
function tdHandler(element: HTMLElement) {
    return element.textContent as string;
}

/**
 * This function is responsible for reading header cells
 * @param  element
 */
function thHandler(element: HTMLElement) {
    return element.textContent as string;
}

/**
 * This function is responsible for reading tables rows
 * @param  element
 */
function trHandler(element: HTMLElement) {
    return "New Row";
}

/**
 * This function is responsible for reading tables footers
 * @param  element
 */
function tfootHandler(element: HTMLElement) {
    return element.textContent as string;
}


/**
 * This function is responsible for announcing tables
 * @param  element
 */
function tableHandler(element: HTMLTableElement) {
    return "Begin Table";
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
function next() {
    VOICE_SYNTH.cancel();
}

/**
 * Moves to the previous HTML element in the DOM.
 */
async function previous() {
    current -= 2;
    // Makes sure that the up arrow never crashes the screen reader
    if (current < 0) {
        current = -1;
    }
    VOICE_SYNTH.cancel();
}

/**
 * Starts reading the page. This is called when the user presses Space.
 */
async function start() {
    while (current < ELEMENT_HANDLERS.size) {
        const currentId: string = ELEMENT_IDS[current];
        const element: HTMLElement = document.getElementById(currentId) as HTMLElement;
        // Highlight
        const originalColor = element.style.backgroundColor;
        element.style.backgroundColor = "yellow";

        // Speak and wait for the utterance to finish
        const value: string = ELEMENT_HANDLERS.get(currentId) as string;
        await speak(value);
        // Restore original background color
        element.style.backgroundColor = originalColor;
        current += 1;
    }
    // Reset so that the page can be read again on Space
    current = 0;
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
function globalKeystrokes(event: KeyboardEvent): void {
    if (event.key === " ") {
        event.preventDefault();
        start();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeVoiceRate(1.1);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeVoiceRate(0.9);
    } else if (event.key === "p") {
        event.preventDefault();
        if (VOICE_SYNTH.paused) {
            resume();
        } else {
            pause();
            }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        previous();
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        next();
    } else if (event.code === "c") {
        event.preventDefault();
        const currentId: string = ELEMENT_IDS[current];
        const element: HTMLInputElement = document.getElementById(currentId) as HTMLInputElement;
        element.focus();
    } else if (event.key === "Enter") {
        event.preventDefault();
        const currentId: string = ELEMENT_IDS[current];
        const element = document.getElementById(currentId) as HTMLElement;
        element.click();
    }
}

