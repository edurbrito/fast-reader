const {ipcRenderer} = require('electron');

var bPlay = document.getElementById('btn-play');
var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');
var label_rate = document.getElementById('rate-value');

var index = {i:-1};
var text = ["Eu","sou","eu","e","mais","ninguém","diligente","sábio","culto","aqui","só","para","mim."];
// text = ["Her","life","in","the","confines","of","the","house","became","her","new","normal.",
// "I","want","more","detailed","information.",
// "Charles","ate","the","french","fries","knowing","they","would","be","his","last","meal.",
// "Buried","deep","in","the","snow,","he","hoped","his","batteries","were","fresh","in","his","avalanche","beacon.",
// "They're","playing","the","piano","while","flying","in","the","plane.",
// "The","beauty","of","the","African","sunset","disguised","the","danger","lurking","nearby.",
// "The","sun","had","set","and","so","had","his","dreams.",
// "She","works","two","jobs","to","make","ends","meet;","at","least,","that","was","her","reason","for","not","having","time","to","join","us.",
// "8%","of","25","is","the","same","as","25%","of","8","and","one","of","them","is","much","easier","to","do","in","your","head.",
// "I","checked","to","make","sure","that","he","was","still","alive."];
var data = {index: index, text: text, rate: 180};

class PlayPauseWorker {
    
    constructor(script,data){
        this.script = script;
        this.data = data;
        this.w = undefined;
        this.onPause = true;
    }

    initWorker = function(restart) {
        this.onPause = false;
        if (this.w == undefined){
            this.w = new Worker(this.script);
            this.postMessage();            
            this.onmessage();
        }
        else{
            this.terminate();
            if (restart)
                this.initWorker(false);
        }
    };

    postMessage = function(){
        this.w.postMessage(this.data);
    };

    terminate = function() {
        bPlay.textContent = "l>";
        if (this.w != undefined)
            this.w.terminate();
        this.w = undefined;  
    };

    onmessage = function() {
        this.w.onmessage = function(event){
            bPlay.textContent = "ll";
            before_word.textContent = event.data.before_word;
            after_word.textContent = event.data.after_word;
            word.textContent = event.data.word;
            index.i = event.data.index.i;
            data.index = index;
            if (index.i == data.text.length){
                bPlay.textContent = "l>";
                index.i = -1;
            }
        }
    };

    setRate = function (rate) {
        this.data.rate = rate;
        if (this.w != undefined)
            this.postMessage();
    }

    getRate = function (){
        return this.data.rate;
    }

    increaseRate = function (){
        if (this.data.rate > 0){
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
        if (index.i > 0)
            before_word.textContent = text[index.i - 1];
        else
            before_word.textContent = "";
        
        word.textContent = text[index.i];
        
        if (index.i < text.length - 1)
            after_word.textContent = text[index.i + 1];
        else
            after_word.textContent = "";
    }
}

var playPauseWorker = new PlayPauseWorker("play-pause.js",data);

function buttonPlay (){
    if (data.index.i < 0){
        playPauseWorker.initWorker(true); 
        playPauseWorker.onPause = false; 
    }
    else{
        playPauseWorker.initWorker(false); 
        playPauseWorker.onPause = true; 
    } 
}

function buttonIncRate (){
    playPauseWorker.increaseRate();
    label_rate.textContent = "Rate: " + playPauseWorker.getRate();
}

function buttonDecRate (){
    playPauseWorker.decreaseRate();
    label_rate.textContent = "Rate: " + playPauseWorker.getRate();
}

function buttonNextWord (){
    if(playPauseWorker.onPause){
        console.log("ON PAUSE - INC",index.i);
        if(index.i < text.length - 1)
            index.i += 1;

        playPauseWorker.setText();
    }
}

function buttonPreviousWord (){

    if(playPauseWorker.onPause){
        console.log("ON PAUSE - DEC",index.i);
        if(index.i > 0)
            index.i -= 1;
        
        playPauseWorker.setText();
    }
}