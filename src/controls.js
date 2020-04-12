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

class PlayPauseWorker {
    
    constructor(script,text,rate, npages){
        this.script = script;
        this.data = {index: 0, text: text, rate: rate, npages: npages};
        this.w = undefined;
        this.setText();
        range_bar.step = 1;
        range_bar.min = 1;
        range_bar.max = this.data.npages.length - 1;
        range_bar.value = 1;
    }

    initWorker = function(restart) {
        if (this.w == undefined){
            this.w = new Worker(this.script);
            this.onmessage();
            this.postMessage();            
        }
        else{
            this.terminate();
            if (restart)
                this.initWorker(false);
            else    
                range_bar.style = "pointer-events: auto;";
        }
    };

    postMessage = function(){
        range_bar.style = "pointer-events: none;";
        this.w.postMessage(this.data);
    };

    terminate = function() {
        bPlay.textContent = "l>";
        if (this.w != undefined)
            this.w.terminate();
        this.w = undefined;  
    };

    onmessage = function() {
        let currWorker = this;
        this.w.onmessage = function(event){
            bPlay.textContent = "ll";
            before_word.textContent = event.data.before_word;
            after_word.textContent = event.data.after_word;
            word.textContent = event.data.word;
            currWorker.setIndex(event.data.index - 1,false);
            if (currWorker.getIndex() == currWorker.data.text.length - 1){
                bPlay.textContent = "l>";
            }
        }
    };

    setPageIndex = function(index) {
        var elem = this.data.npages.findIndex(function(val){
            return val >= index;
        });
        var pageindex = elem - 1;
        if (pageindex != -1){
            label_page.textContent = "Page: " + (pageindex + 1);
            range_bar.value = pageindex + 1;
        }
    }

    setPage = function(pageindex) {
        label_page.textContent = "Page: " + (pageindex);
        var index = this.data.npages[pageindex - 1] + 1;
        if(this.data.text[index] != undefined && index > 1)
            this.setIndex(index,false);
        else   
            this.setIndex(index - 1,false);
        this.setText();
    }

    increasePage = function() {
        var index = this.data.index;
        var elem = this.data.npages.findIndex(function(val){
            return val >= index;
        });
        var pageindex = elem + 1;
        this.setPage(pageindex);
    }

    getPageIndex = function() {
        return range_bar.value;
    }

    setIndex = function(index, run) {
        this.data.index = index;
        this.setPageIndex(index);
        if (this.w != undefined && run)
            this.postMessage();
    }

    getIndex = function () {
        return this.data.index;
    }

    increaseIndex = function() {
        this.setIndex(this.data.index + 1,false);
    }

    decreaseIndex = function() {
        this.setIndex(this.data.index - 1,false);
    }

    setRate = function (rate) {
        this.data.rate = rate;
        if (this.w != undefined)
            this.postMessage();
    }

    getRate = function (){
        return this.data.rate;
    }

    increaseRate = function (){
        if (this.data.rate > 10){
            this.data.rate -= 10;
            if (this.w != undefined)
                this.postMessage();
        }
    }

    decreaseRate = function (){
        if (this.data.rate < 300){
            this.data.rate += 10;
            if (this.w != undefined)
                this.postMessage();
        }
    }

    setText = function(){
        var i = this.data.index
        if (i > 0)
            before_word.textContent = this.data.text[i - 1];
        else
            before_word.textContent = "";
        
        word.textContent = this.data.text[i];
        
        if (i < this.data.text.length - 1)
            after_word.textContent = this.data.text[i + 1];
        else
            after_word.textContent = "";
    }

    onPause = function() {
        return bPlay.textContent == "l>";
    }
}

let playPauseWorker = new PlayPauseWorker("play-pause.js",text,180,npages);

function buttonPlay (){
    if (playPauseWorker.getIndex() == 0 || playPauseWorker.getIndex() == playPauseWorker.data.text.length - 1){ // It means that text has not STARTed 
        playPauseWorker.setIndex(0,false);
        playPauseWorker.initWorker(true); 
    }
    else{
        playPauseWorker.initWorker(false);
    } 
    document.activeElement.blur();
}

function buttonIncRate (){
    playPauseWorker.increaseRate();
    label_rate.textContent = "Rate: " + playPauseWorker.getRate();
    document.activeElement.blur();
}

function buttonDecRate (){
    playPauseWorker.decreaseRate();
    label_rate.textContent = "Rate: " + playPauseWorker.getRate();
    document.activeElement.blur();
}

function buttonNextWord (){
    if(playPauseWorker.onPause()){
        if(playPauseWorker.getIndex() < playPauseWorker.data.text.length - 1){
            playPauseWorker.increaseIndex();
        }
        else{
            playPauseWorker.setIndex(0,false);
        }
        playPauseWorker.setText();
    }
    document.activeElement.blur();
}

function buttonPreviousWord (){

    if(playPauseWorker.onPause()){
        if(playPauseWorker.getIndex() > 0){
            playPauseWorker.decreaseIndex();
        }
        else{
            playPauseWorker.setIndex(playPauseWorker.data.text.length - 1,false);
        }
        playPauseWorker.setText();
    }
    document.activeElement.blur();
}

function buttonNextPage (){
}

function buttonPreviousPage (){
}

range_bar.oninput = function() {
    if(playPauseWorker.onPause()){
        playPauseWorker.setPage(this.value);
    } 
}

// Keyboard Listener
document.addEventListener('keyup', (e) => {
    if (e.key === " " || e.code == "Space") buttonPlay();
});

// Keyboard Listener
document.addEventListener('keypress', (e) => {
    e.preventDefault();
    if (e.key === "+") buttonIncRate();
    else if (e.key === "-") buttonDecRate();
});


document.onkeydown = function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
       buttonPreviousWord();
    }
    else if (e.keyCode == '39') {
       // right arrow
       buttonNextWord();
    }
};

function resize (){
    ipcRenderer.send('resize');
}

function goToMainMenu (){
    ipcRenderer.send('main-menu');
}