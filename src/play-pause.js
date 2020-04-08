var text;
var index;
var rate;

self.addEventListener('message' , function(e){
    
    var init = false;
    if (text == undefined)
        init = true;

    text = e.data.text;
    index = e.data.index;
    rate = e.data.rate;
    if (init)
        updateWord();
});

var data = {};

function updateWord(){
    var currRate = rate;

    if (index == text.length){
        postMessage(data);
        return;
    }

    var word = text[index];

    if (index > 0)
        data.before_word = text[index - 1];
    else
        data.before_word = "";
    
    data.word = word;
    
    if (index < text.length - 1)
        data.after_word = text[index + 1];
    else
        data.after_word = "";
    
    if (word != undefined && (word.length <= 5 || word[word.length - 1] == '.')){
        currRate = rate * 2.2;
    }
    
    index++;
    data.index = index

    postMessage(data);
    if (index < text.length)
        setTimeout(function(){updateWord()},currRate);
}
