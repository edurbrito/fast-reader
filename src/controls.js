const {ipcRenderer} = require('electron');
const workers = require('./worker.js');

var bPlay = document.getElementById('btn-play');
var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');

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
var data = {index: index, text: text};



class PlayPauseWorker extends workers.ReaderWorker {
    
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

}

elems = {bPlay : bPlay, before_word : before_word, after_word : after_word, word : word}
var playPauseWorker = new PlayPauseWorker("play-pause.js",data);

function buttonPlay(){
    if (data.index.i == 0)
        playPauseWorker.initWorker(true);
    else
        playPauseWorker.initWorker(false);   
}
