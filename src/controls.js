const {ipcRenderer} = require('electron');

var text = ["Eu","sou","eu","e","mais","ninguém","aqui","para","mim."];
var nIntervId, updt , i = 0; // Time interval between words, update Word shadow function, index of the current word displayed , response to Main shadow function
var rate = 180; // Time in ms between words
var before_word = document.getElementById('before-word');
var word = document.getElementById('word');
var after_word = document.getElementById('after-word');

updt = function updateWord(){
    rate = 180;
    if (i > 0)
        before_word.textContent = text[i - 1];
    else
        before_word.textContent = "";
    word.textContent = text[i];
    if (i < text.length - 1)
        after_word.textContent = text[i + 1];
    else
        after_word.textContent = "";
    i++;
    if (i == text.length){
        i = 0;
    }
    if (text[i].length <= 3){
        rate = 300;
    }
    clearInterval(nIntervId);
    nIntervId = setInterval(function(){updt();}, rate);
}

function buttonPlay(){
    var bPlay = document.getElementById('btn-play');
    
    bPlay.textContent = "ll";

    var i = 0;
    clearInterval(nIntervId);
    nIntervId = setInterval(function(){updt();}, rate);
}
