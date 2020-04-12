/** @module controls */

const {ipcRenderer} = require('electron');
const {npages, text} = require('./readings.js');

document.activeElement.blur();

var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');
var bPlay = document.getElementById('btn-play');
var label_rate = document.getElementById('rate-value');
var label_page = document.getElementById('page-index');
var range_bar = document.getElementById('range-bar');

var data = {index: 0, text: text, rate: 180};

/**
 * Creates a new PlayPauseWorker.
 * @class
 */
class PlayPauseWorker {
    
    /**
     * @constructs PlayPauseWorker
     * @param {string} script To be run by the Worker
     * @param {array} text List of words
     * @param {int} rate Velocity of update for the words on the screen
     * @param {array} npages List of word indexes corresponding to new pages
     */
    constructor(script, text, rate, npages) {
        this.script = script;
        this.data = {index: 0, text: text, rate: rate, npages: npages};
        this.w = undefined;
        this.setText();
        range_bar.step = 1;
        range_bar.min = 1;
        range_bar.max = this.data.npages.length - 1;
        range_bar.value = 1;
    }

    /**
     * Initiates the worker, either by defining it for the first time,
     * or by terminating it, redefining it again.
     * The first corresponds to the play state,
     * The second, to the restart state.
     * If @param restart is false, and on a playing state,
     * the worker is set on a pause state
     * @param restart If true, it restarts the worker, otherwise, it terminates it
     */
    initWorker = function(restart) {
        if (this.w == undefined) {
            this.w = new Worker(this.script);
            this.onmessage();
            this.postMessage();            
        }
        else {
            this.terminate();
            if (restart)
                this.initWorker(false);
            else    
                range_bar.style = "pointer-events: auto;";
        }
    };

    /**
     * Sends the message with the data to the module called by the worker
     * @fires message
     */
    postMessage = function() {
        range_bar.style = "pointer-events: none;";

        this.w.postMessage(this.data);
    };

    /**
     * Terminates the worker, setting it on a pause state
     */
    terminate = function() {
        bPlay.textContent = "l>";

        if (this.w != undefined)
            this.w.terminate();
        this.w = undefined;  
    };

    /**
     * Sets the listener for receiving messages from the module called by the worker
     * The listener @callback this.w.onmessage is responsible for updating the ui
     * with the new words, and also the current index.
     * @event message
     */
    onmessage = function() {
        let currWorker = this;
        this.w.onmessage = function(event) {

            bPlay.textContent = "ll";
            before_word.textContent = event.data.before_word;
            after_word.textContent = event.data.after_word;
            word.textContent = event.data.word;

            currWorker.setIndex(event.data.index - 1,false);

            if (currWorker.getIndex() == currWorker.getTextLength() - 1) {
                bPlay.textContent = "l>";
            }
        }
    };

    /**
     * @returns The text length
     */
    getTextLength = function() {
        return this.data.text.length;
    }

    /**
     * Sets the current page index based on the @param index
     * @param index The word index to calculate the current page index
     */
    setPageIndex = function(index) {
        var elem = this.data.npages.findIndex( function(val) {
            return val > index;
        });

        if (elem > -1) {
            label_page.textContent = "Page: " + (elem);
            range_bar.value = elem;
        }
    }

    /**
     * Sets the current page index
     * @param pageIndex The new current page index to be set
     */
    setPage = function(pageindex) {
        label_page.textContent = "Page: " + (pageindex);

        var index = this.data.npages[pageindex - 1] + 1;

        if (this.data.text[index] != undefined && index > 1)
            this.setIndex(index,false);
        else   
            this.setIndex(index - 1,false);
        
        this.setText();
    }

    /**
     * @returns The current page index
     */
    getPageIndex = function() {
        return range_bar.value;
    }

    /**
     * Sets the current word index
     * @param index The new index to be set
     */
    setIndex = function(index) {
        this.data.index = index;
        this.setPageIndex(index);
    }

    /**
     * @returns The current word index
     */
    getIndex = function() {
        return this.data.index;
    }

    /**
     * Sets the next word index
     */
    increaseIndex = function() {
        this.setIndex(this.data.index + 1,false);
    }

    /**
     * Sets the previous word index
     */
    decreaseIndex = function() {
        this.setIndex(this.data.index - 1,false);
    }

    /**
     * Sets the current rate
     * @param index The new rate to be set
     */
    setRate = function(rate) {
        this.data.rate = rate;
        if (this.w != undefined)
            this.postMessage();
    }

    /**
     * @returns The current rate
     */
    getRate = function() {
        return this.data.rate;
    }

    /**
     * Sets the next rate, increasing the current one by 10
     */
    increaseRate = function() {
        if (this.data.rate > 10) {
            this.data.rate -= 10;
            label_rate.textContent = "Rate: " + playPauseWorker.getRate();
            if (this.w != undefined)
                this.postMessage();
        }
    }

    /**
     * Sets the previous rate, decreasing the current one by 10
     */
    decreaseRate = function() {
        if (this.data.rate < 300) {
            this.data.rate += 10;
            label_rate.textContent = "Rate: " + playPauseWorker.getRate();
            if (this.w != undefined)
                this.postMessage();
        }
    }

    /**
     * Sets the words on the screen
     */
    setText = function() {
        var i = this.data.index
        if (i > 0)
            before_word.textContent = this.data.text[i - 1];
        else
            before_word.textContent = "";
        
        word.textContent = this.data.text[i];
        
        if (i < this.getTextLength() - 1)
            after_word.textContent = this.data.text[i + 1];
        else
            after_word.textContent = "";
    }

    /**
     * @returns true if on Pause, false otherwise
     */
    onPause = function() {
        return bPlay.textContent == "l>";
    }
}

let playPauseWorker = new PlayPauseWorker("play-pause.js",text,180,npages);

/**
 * Called when play button is pressed, playing it or pausing the reader
 * @event button-play
 */
function buttonPlay() {
    var onbeginning = playPauseWorker.getIndex() == 0;
    var onend = playPauseWorker.getIndex() == playPauseWorker.getTextLength() - 1;
    if ( onbeginning || onend ) { // It means that text has not STARTed 
        playPauseWorker.setIndex(0);
        playPauseWorker.initWorker(true); 
    }
    else {
        playPauseWorker.initWorker(false);
    } 
    document.activeElement.blur();
}

/**
 * Called when increment-rate button is pressed, incrementing the rate
 * @event button-increment-rate
 */
function buttonIncRate() {
    playPauseWorker.increaseRate();
    document.activeElement.blur();
}

/**
 * Called when decrement-rate button is pressed, decrementing the rate
 * @event button-decrement-rate
 */
function buttonDecRate() {
    playPauseWorker.decreaseRate();
    document.activeElement.blur();
}

/**
 * Called when next-word button is pressed, presenting the next words on the screen
 * @event button-next-word
 */
function buttonNextWord() {
    if (playPauseWorker.onPause()) {
        if (playPauseWorker.getIndex() < playPauseWorker.getTextLength() - 1) {
            playPauseWorker.increaseIndex();
        }
        else {
            playPauseWorker.setIndex(0);
        }
        playPauseWorker.setText();
    }
    document.activeElement.blur();
}

/**
 * Called when previous-word button is pressed, presenting the previous words on the screen
 * @event button-previous-word
 */
function buttonPreviousWord() {

    if (playPauseWorker.onPause()) {
        if (playPauseWorker.getIndex() > 0) {
            playPauseWorker.decreaseIndex();
        }
        else {
            playPauseWorker.setIndex(playPauseWorker.getTextLength() - 1);
        }
        playPauseWorker.setText();
    }
    document.activeElement.blur();
}

/**
 * Range Bar Listener
 * @event oninput 
 */
range_bar.oninput = function() {
    if (playPauseWorker.onPause()) {
        playPauseWorker.setPage(this.value);
    } 
}

/**
 * Keyboard Listener
 * @event keyup 
 */
document.addEventListener('keyup', (e) => {
    if (e.key === " " || e.code == "Space") 
        buttonPlay();
});

/**
 * Keyboard Listener
 * @event keypress 
 */
document.addEventListener('keypress', (e) => {
    e.preventDefault();
    if (e.key === "+") 
        buttonIncRate();

    else if (e.key === "-") 
        buttonDecRate();
});

/**
 * Keyboard Listener
 * @event keydown 
 */
document.onkeydown = function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
       // left arrow
       buttonPreviousWord();
    }
    else if (e.keyCode == '39') {
       // right arrow
       buttonNextWord();
    }
};

/**
 * @fires resize
 */
function resize() {
    ipcRenderer.send('resize');
}

/**
 * @fires main-menu
 */
function goToMainMenu() {
    ipcRenderer.send('main-menu');
}