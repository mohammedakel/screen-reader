// Look up the Web Speech API (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
// Initialize this variable when the window first loads
let VOICE_SYNTH: SpeechSynthesis;

// The current speaking rate of the screen reader
let VOICE_RATE: number = 1;

// Stores elements and their handler functions
// Think of an appropriate data structure to do this
// Assign this variable in mapPage()
let ELEMENT_HANDLERS;

// Indicates the current element that the user is on
// You can decide the type of this variable
let current;

/**
 * Speaks out text.
 * @param text the text to speak
 */
function speak(text: string): void {
    if (VOICE_SYNTH) {
        // initialize a speech request using SpeechSynthesisUtterance
        // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance

        // check out the onstart and onend attributes of SpeechSynthesisUtterance
        
        // consider what might happen if this function is called several times
        // HINT: use Promises and async/await!
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

function generateHandlers(): void {
    //TODO: get all the HTML elements in the DOM using document.getElementsByTagName("*")

    //TODO: assign every element an id (you can use the id to locate an element when you implement highlighting)

    //TODO: generate handler functions for all elements based on their tag name

    //TODO: add each element to ELEMENT_HANDLERS, along with its handler
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
function previous() {}

/**
 * Starts reading the page continuously.
 */
function start() {}

/**
 * Pauses the reading of the page.
 */
 function pause() {}

 /**
 * Resumes the reading of the page.
 */
  function resume() {}

/**
 * Listens for keydown events.
 * @param event keydown event
 */
function globalKeystrokes(event: KeyboardEvent): void {
    // can change and add key mappings as needed
    if (event.key === " ") {
        event.preventDefault();
        //TODO: start reading the entire page
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeVoiceRate(1.1);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeVoiceRate(0.9);
    } 
}
