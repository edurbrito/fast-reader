const {ipcRenderer} = require('electron');
const workers = require('./worker.js');

var bPlay = document.getElementById('btn-play');
var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');
var label_rate = document.getElementById('rate-value');

var index = {i:0};
var text = ["Eu","sou","eu","e","mais","ninguém","diligente","sábio","culto","aqui","só","para","mim."];
text = ["Her","life","in","the","confines","of","the","house","became","her","new","normal.",
"I","want","more","detailed","information.",
"Charles","ate","the","french","fries","knowing","they","would","be","his","last","meal.",
"Buried","deep","in","the","snow,","he","hoped","his","batteries","were","fresh","in","his","avalanche","beacon.",
"They're","playing","the","piano","while","flying","in","the","plane.",
"The","beauty","of","the","African","sunset","disguised","the","danger","lurking","nearby.",
"The","sun","had","set","and","so","had","his","dreams.",
"She","works","two","jobs","to","make","ends","meet;","at","least,","that","was","her","reason","for","not","having","time","to","join","us.",
"8%","of","25","is","the","same","as","25%","of","8","and","one","of","them","is","much","easier","to","do","in","your","head.",
"I","checked","to","make","sure","that","he","was","still","alive."];
var data = {index: index, text: text, rate: 180};

class PlayPauseWorker extends workers.ReaderWorker {
    
    initWorker = function(restart) {
        
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
            index = event.data.index;
            data.index = index;
            if (index.i == data.text.length){
                bPlay.textContent = "l>";
                index.i = 0;
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
        if (this.data.index.i > 0)
            before_word.textContent = this.data.text[this.data.index.i - 1];
        else 
            before_word.textContent = "";
        
        word.textContent = this.data.text[this.data.index.i];
        
        if (this.data.index.i < this.data.text.length - 1)
            after_word.textContent = this.data.text[this.data.index.i + 1];
        else 
            after_word.textContent = "";
    }
}

var playPauseWorker = new PlayPauseWorker("play-pause.js",data);

function buttonPlay (){
    if (data.index.i == 0){
        playPauseWorker.initWorker(true);
    }
    else{
        playPauseWorker.initWorker(false);  
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
}

function buttonPreviousWord (){
}