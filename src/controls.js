const {ipcRenderer} = require('electron');

var bPlay = document.getElementById('btn-play');
var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');
var w = undefined;
var index = 0;
var text = ["Eu","sou","eu","e","mais","ninguém","aqui","para","mim."];

function buttonPlay(){
    
    if (w == undefined){
        w = new Worker("play-pause.js");
        data = {index: index, text: text};
        w.postMessage(data);
        w.onmessage = function(event) {
            bPlay.textContent = "ll";
            before_word.textContent = event.data.before_word;
            after_word.textContent = event.data.after_word;
            word.textContent = event.data.word;
            index = event.data.index;
            
            if (index == text.length){
                w.terminate();
                w = undefined;
                bPlay.textContent = "l>";
                index = 0;
            }
        };
    }
    else {
        w.terminate();
        w = undefined;
        bPlay.textContent = "l>";
    }
    
}
